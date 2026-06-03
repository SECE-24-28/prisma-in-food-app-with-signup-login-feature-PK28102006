"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "tastybites_jwt_secret_key_2026";
const COOKIE_NAME = "auth_token";

export async function signUp(formData: any) {
  try {
    const { name, email, password } = formData;

    if (!name || !email || !password) {
      return { success: false, error: "Please fill in all fields" };
    }

    if (password.length < 6) {
      return {
        success: false,
        error: "Password must be at least 6 characters",
      };
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { success: false, error: "Email is already registered" };
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "customer",
      },
    });

    return { success: true, message: "User registered successfully!" };
  } catch (error: any) {
    console.error("Error signing up user:", error);
    return { success: false, error: error.message || "Failed to sign up" };
  }
}

export async function login(formData: any) {
  try {
    const { email, password } = formData;

    if (!email || !password) {
      return { success: false, error: "Please fill in all fields" };
    }

    if (!email.includes("@")) {
      return { success: false, error: "Please enter a valid email" };
    }

    // Create a timeout promise
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(
        () => reject(new Error("Request timeout - database unreachable")),
        8000,
      ),
    );

    // Find the user with timeout
    const userPromise = prisma.user.findUnique({
      where: { email },
    });

    const user = await Promise.race([userPromise, timeoutPromise]);

    if (!user) {
      return { success: false, error: "Invalid email or password" };
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(
      password,
      (user as any).password,
    );
    if (!isPasswordValid) {
      return { success: false, error: "Invalid email or password" };
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: (user as any).id,
        email: (user as any).email,
        name: (user as any).name,
        role: (user as any).role,
      },
      JWT_SECRET,
      { expiresIn: "7d" },
    );

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
      sameSite: "strict",
    });

    return {
      success: true,
      user: {
        id: (user as any).id,
        name: (user as any).name,
        email: (user as any).email,
        role: (user as any).role,
      },
    };
  } catch (error: any) {
    console.error("Error logging in:", error);
    const errorMessage = error.message || "Failed to log in";

    // Provide more specific error messages
    if (errorMessage.includes("timeout")) {
      return {
        success: false,
        error:
          "Database connection timeout. Please check your database connection.",
      };
    }
    if (errorMessage.includes("ECONNREFUSED")) {
      return {
        success: false,
        error:
          "Cannot connect to database. Please check if PostgreSQL is running.",
      };
    }

    return { success: false, error: errorMessage };
  }
}

export async function logout() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAME);
    return { success: true };
  } catch (error: any) {
    console.error("Error logging out:", error);
    return { success: false, error: "Failed to log out" };
  }
}

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const tokenObj = cookieStore.get(COOKIE_NAME);

    if (!tokenObj || !tokenObj.value) {
      return null;
    }

    // Verify token
    const decoded = jwt.verify(tokenObj.value, JWT_SECRET) as any;

    // Create a timeout promise
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timeout")), 5000),
    );

    // Fetch fresh user data from DB with timeout
    const userPromise = prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    const user = await Promise.race([userPromise, timeoutPromise]);

    return user;
  } catch (error) {
    // If token is expired or invalid
    console.error("Error getting current user:", error);
    return null;
  }
}
