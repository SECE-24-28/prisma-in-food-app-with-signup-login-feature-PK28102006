# Prisma Deployment & Best Practices Guide

## Production Deployment Checklist

- [ ] Database credentials stored in secure environment variables
- [ ] `DATABASE_URL` uses connection pooling (PgBouncer or similar)
- [ ] Prisma Client generated and committed to version control
- [ ] Migrations tested in staging environment
- [ ] Connection pool settings optimized for load
- [ ] Error logging configured
- [ ] Backup strategy in place for PostgreSQL

## Environment Configuration

### Development (.env.local)

```env
DATABASE_URL="postgresql://postgres:Pk@2006.@localhost:5432/food_order"
NODE_ENV=development
JWT_SECRET=dev_secret_key_12345
```

### Production (.env.production)

```env
DATABASE_URL="postgresql://user:password@prod-db.example.com:5432/food_order_prod"
NODE_ENV=production
JWT_SECRET=your_secure_random_jwt_secret_at_least_32_chars
```

**Important**:

- Never commit `.env.local` to git (it's in `.gitignore`)
- Use strong, unique JWT_SECRET in production (generate: `openssl rand -base64 32`)
- Use connection pooling services in production

## Deployment Steps

### 1. Prepare Application

```bash
# Install dependencies
npm install --production

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate deploy
```

### 2. Deploy to Cloud Platform

**Vercel (Recommended for Next.js)**:

```bash
npm install -g vercel
vercel link  # Connect project
vercel env add DATABASE_URL "your_prod_connection_string"
vercel env add JWT_SECRET "your_secure_jwt_secret"
vercel deploy
```

**Docker Deployment**:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install --production
RUN npx prisma generate
EXPOSE 3000
CMD ["npm", "start"]
```

### 3. Database Setup on Cloud

**Recommended Providers**:

- AWS RDS PostgreSQL
- Google Cloud SQL
- Azure Database for PostgreSQL
- Railway.app (simple, good for startups)
- Supabase (PostgreSQL + Auth)

**Connection String Format**:

```
postgresql://username:password@host:port/database?schema=public
```

## Database Optimization

### Indexing Strategy

The schema has natural indexes on:

- `User.email` (UNIQUE constraint creates index)
- Foreign keys (automatically indexed)

Consider adding:

```sql
-- Speed up user order queries
CREATE INDEX idx_orders_user_id ON "Orders"(user_id);

-- Speed up order status queries
CREATE INDEX idx_orders_status ON "Orders"(status);

-- Speed up food category queries
CREATE INDEX idx_fooditems_category ON "FoodItems"(category);
```

### Connection Pooling

**Current Setup** (lib/prisma.ts):

```typescript
const adapter = new PrismaPg(pool, {
  // Max 10 concurrent connections
  // Idle timeout: 30 seconds
  // Connection timeout: 2 seconds
});
```

For production, use **PgBouncer** or **Supabase connection pooling**:

```env
# PgBouncer connection string
DATABASE_URL="postgresql://user:password@pgbouncer-host:6432/food_order?schema=public"
```

### Query Optimization

**Problem**: N+1 queries

```typescript
// ❌ Bad - 11 queries (1 + 10)
const orders = await prisma.order.findMany({ take: 10 });
for (const order of orders) {
  order.items = await prisma.orderItem.findMany({
    where: { orderId: order.id },
  });
}
```

**Solution**: Use include

```typescript
// ✅ Good - 1 query
const orders = await prisma.order.findMany({
  take: 10,
  include: { items: true },
});
```

## Monitoring & Logging

### Enable Prisma Logging

```typescript
// lib/prisma.ts
const prisma = new PrismaClient({
  log: [
    { emit: "stdout", level: "query" }, // Log all queries
    { emit: "stdout", level: "error" },
    { emit: "stdout", level: "warn" },
  ],
});
```

### Application Monitoring

Track in your logging service:

- Signup/Login failures
- Order creation/update failures
- Database connection errors
- Slow queries (>1 second)

## Security Enhancements

### 1. Rate Limiting (Auth Endpoints)

```typescript
// app/actions/auth.ts - Add rate limiter
import rateLimit from "express-rate-limit";

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: "Too many login attempts, please try again later",
});
```

### 2. CSRF Protection

```typescript
// Implement CSRF tokens for form submissions
import { csrf } from "csrf";
```

### 3. Email Verification

```prisma
model User {
  // ... existing fields
  emailVerified DateTime?
  verificationToken String?
}
```

### 4. Password Reset Flow

```prisma
model PasswordReset {
  id String @id @default(cuid())
  email String
  token String @unique
  expiresAt DateTime
  createdAt DateTime @default(now())
}
```

### 5. Refresh Tokens (Extend Sessions)

```prisma
model RefreshToken {
  id String @id @default(cuid())
  userId Int
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  token String @unique
  expiresAt DateTime
  createdAt DateTime @default(now())
}
```

### 6. Audit Logging

```prisma
model AuditLog {
  id String @id @default(cuid())
  userId Int?
  action String  // 'login', 'create_order', 'delete_user', etc.
  entity String  // 'User', 'Order', 'FoodItem'
  entityId Int
  changes Json?
  ipAddress String?
  createdAt DateTime @default(now())
}
```

## Database Backup Strategy

### Automated Backups

```bash
# Daily backup script
0 2 * * * /usr/local/bin/backup-db.sh

# backup-db.sh
#!/bin/bash
pg_dump -h $PGHOST -U $PGUSER -d food_order | \
  gzip > /backups/food_order_$(date +%Y%m%d_%H%M%S).sql.gz
```

### Backup Rotation

Keep:

- Daily backups for 7 days
- Weekly backups for 4 weeks
- Monthly backups for 1 year

## Scaling Considerations

### Phase 1: Single Database (Current)

- Works up to ~10,000 concurrent users
- Simple setup, low cost

### Phase 2: Read Replicas

```env
# Write to primary
DATABASE_URL_WRITE="postgresql://...primary..."
# Read from replica
DATABASE_URL_READ="postgresql://...replica..."
```

### Phase 3: Database Sharding

- Shard by `userId`
- Shard by `region` (deliveryCity)

### Phase 4: NoSQL Complement

- Cache menu items in Redis
- Session storage in Redis
- Elasticsearch for full-text search

## Troubleshooting Production Issues

### High Connection Pool Usage

**Symptoms**: "too many connections" errors

**Solutions**:

1. Reduce `max` pool connections if possible
2. Increase PgBouncer pool size
3. Add connection pooling layer
4. Implement connection timeout cleanup

### Slow Queries in Production

```bash
# Check slow query log
psql -U postgres food_order -c "
  SELECT query, calls, total_time, mean_time
  FROM pg_stat_statements
  ORDER BY mean_time DESC LIMIT 10;
"
```

### Replication Lag Issues

**When using read replicas**:

```typescript
// Critical writes use primary
await prisma.$transaction(async (tx) => {
  await tx.order.create({ data: /* ... */ });
  // Immediately query from primary, not replica
});
```

### Migration Failures in Production

```bash
# Rollback last migration
npx prisma migrate resolve --rolled-back migrate_name

# Retry
npx prisma migrate deploy

# Or manually check migration status
npx prisma migrate status
```

## Version Upgrade Path

### Upgrading Prisma

```bash
# Check current version
npm list @prisma/client

# Update to latest
npm update @prisma/client prisma

# Or specific version
npm install @prisma/client@latest prisma@latest

# Regenerate client
npx prisma generate

# Test migrations
npx prisma migrate status
```

### Database Version Upgrades

1. Take backup
2. Test migration in staging
3. Schedule maintenance window
4. Run `pg_upgrade` or migration commands
5. Verify with `SELECT version();`

## Compliance & Data Protection

### GDPR Compliance

Implement user deletion:

```typescript
// app/actions/auth.ts
export async function deleteUserAccount(userId: number) {
  await prisma.user.delete({
    where: { id: userId },
    // Cascade deletes all related orders
  });
}
```

### PII Data Handling

- Encrypt sensitive fields (phone, address) in transit (HTTPS only)
- Hash passwords with bcrypt
- Consider field-level encryption for payment data
- Implement data retention policies

### Audit Trail

```typescript
// Log all data modifications
async function logAction(
  userId: number,
  action: string,
  entity: string,
  entityId: number,
) {
  await prisma.auditLog.create({
    data: { userId, action, entity, entityId, ipAddress: getClientIP() },
  });
}
```

## Cost Optimization

### Database Size Monitoring

```bash
# Check database size
psql -U postgres food_order -c "
  SELECT pg_size_pretty(pg_database_size('food_order'));
"

# Check table sizes
psql -U postgres food_order -c "
  SELECT
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
  FROM pg_tables
  ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
"
```

### Archive Old Data

```typescript
// Archive orders older than 1 year
const oldOrders = await prisma.order.findMany({
  where: {
    createdAt: { lt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) },
  },
});

// Move to archive table and delete
await prisma.order.deleteMany({
  where: { id: { in: oldOrders.map((o) => o.id) } },
});
```

## Additional Resources

- [Prisma Deployment Guide](https://www.prisma.io/docs/guides/deployment)
- [PostgreSQL Performance](https://wiki.postgresql.org/wiki/Performance_Optimization)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [OWASP Security Guidelines](https://owasp.org/www-project-top-ten/)

---

**Last Updated**: June 2026  
**Framework**: Next.js 16 + Prisma 7.8  
**Database**: PostgreSQL 12+
