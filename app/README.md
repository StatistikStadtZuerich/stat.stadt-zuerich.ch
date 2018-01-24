# STIP Frontend App

## Development

```
npm run dev
```

Starts compilation and runs a development server on http://localhost:3000/

## Production server

Node version required: 8.

### 1. Build the app

Before the app can be used in production, it needs to be built.

```
npm run build
```

### 2. Run the app as Express middleware

`index.js` exports an async function `prepare()` which returns a Promise with an Express middleware.

For optimal performance app needs to run with `NODE_ENV=production`.

An example of how to use it is in `server.js`.
