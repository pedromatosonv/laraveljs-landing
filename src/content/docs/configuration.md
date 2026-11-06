---
title: Configuration
group: Getting Started
order: 2
---

## Configuration files

The configuration design gives application settings a predictable home. Modules can read the settings they need through the application configuration.

## Environment variables

Deployment-specific values belong in the environment. Keep credentials out of committed configuration and give contributors an example file with placeholder values.

```dotenv
APP_ENV=development
APP_PORT=3000
```

### Validating configuration

The proposed boot process validates required values before the application starts accepting requests.
