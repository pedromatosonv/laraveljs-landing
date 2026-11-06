---
title: Installation
group: Getting Started
order: 1
---

## Meet LaravelJS

LaravelJS is an experimental web framework concept for JavaScript and TypeScript. It explores how Laravel-style conventions could organize routes, application logic, and tests in a JavaScript project.

### Project status

This site documents the design as it evolves. The examples describe a proposed API. The landing repository contains the website and documentation source.

## Run the documentation locally

From a checkout of the website repository, use Node.js 24 and npm to start the development server.

```sh
npm ci
npm run dev
```

The terminal prints the local address. Open the documentation path from the landing page using the **Docs** link.

## Frontend integrations

LaravelJS explores how a TypeScript server can share types with a React, Vue, or Svelte frontend. The design groups HTTP routes and application logic on the server while leaving the choice of UI framework to the application.

See [Routing](routing/) for proposed request handlers.

## Next steps

Read [Configuration](configuration/) for the proposed settings model or [Routing](routing/) for an example request handler.
