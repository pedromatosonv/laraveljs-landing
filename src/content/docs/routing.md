---
title: Routing
group: The Basics
order: 3
---

## Basic routing

A route connects an HTTP method and path to a handler. The proposed API groups routes in files such as `routes/web.ts` so the entry points are easy to find.

```ts
Route.get('/health', () => {
  return { status: 'ok' }
})
```

## Route parameters

A named path segment captures part of the request URL. A handler can use that value to look up the requested resource.

```ts
Route.get('/posts/:id', async ({ params }) => {
  return Post.find(params.id)
})
```

## Route middleware

Middleware represents behavior shared by multiple routes, such as authentication. The landing page includes a sketch of a protected dashboard route.
