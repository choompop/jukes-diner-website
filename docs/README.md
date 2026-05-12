# Juke's Dashboard Documentation

## Authentication

- [Dashboard Authentication Migration Guide](./DASHBOARD_AUTH_MIGRATION.md) - Complete guide for migrating from plaintext to hashed authentication

## Quick Links

### Production Setup
```bash
# Generate password hash
node scripts/hash-dashboard-password.mjs 'your-password'

# Set environment variables
NODE_ENV=production
DASHBOARD_ADMIN_USERNAME=owner
DASHBOARD_ADMIN_PASSWORD_HASH=<generated-hash>
```

### Development Setup
```bash
# .env.local
NODE_ENV=development
DASHBOARD_ADMIN_USERNAME=local-admin
DASHBOARD_ADMIN_PASSWORD=developer-secret
```

See the full [migration guide](./DASHBOARD_AUTH_MIGRATION.md) for detailed instructions.
