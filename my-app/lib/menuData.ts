export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: "pending" | "confirmed" | "preparing" | "ready" | "delivered";
  date: string;
}

export const menuItems: MenuItem[] = [
  {
    id: 1,
    name: "Margherita Pizza",
    description: "Classic pizza with tomato, mozzarella, and basil",
    price: 8.99,
    category: "Veg",
  },
  {
    id: 2,
    name: "Pepperoni Pizza",
    description: "Pizza with pepperoni and melted cheese",
    price: 10.99,
    category: "Non-Veg",
  },
  {
    id: 3,
    name: "Vegetarian Pizza",
    description: "Pizza with fresh vegetables and cheese",
    price: 9.99,
    category: "Veg",
  },
  {
    id: 4,
    name: "Caesar Salad",
    description: "Romaine lettuce, parmesan, croutons, Caesar dressing",
    price: 7.99,
    category: "Veg",
  },
  {
    id: 5,
    name: "Greek Salad",
    description: "Tomatoes, cucumbers, olives, feta cheese",
    price: 8.99,
    category: "Veg",
  },
  {
    id: 6,
    name: "Burger",
    description: "Beef burger with lettuce, tomato, and onion",
    price: 9.99,
    category: "Non-Veg",
  },
  {
    id: 7,
    name: "Chicken Burger",
    description: "Grilled chicken burger with mayo and vegetables",
    price: 8.99,
    category: "Non-Veg",
  },
  {
    id: 8,
    name: "Veggie Burger",
    description: "Plant-based burger with all the fixings",
    price: 7.99,
    category: "Veg",
  },
  {
    id: 9,
    name: "Pasta Carbonara",
    description: "Spaghetti with bacon, egg, and parmesan",
    price: 11.99,
    category: "Non-Veg",
  },
  {
    id: 10,
    name: "Pasta Marinara",
    description: "Spaghetti with tomato sauce and basil",
    price: 9.99,
    category: "Veg",
  },
  {
    id: 11,
    name: "Coke",
    description: "Cold cola beverage",
    price: 2.99,
    category: "Veg",
  },
  {
    id: 12,
    name: "Iced Tea",
    description: "Refreshing iced tea",
    price: 2.49,
    category: "Veg",
  },
];

export const categories = ["Veg", "Non-Veg"];
