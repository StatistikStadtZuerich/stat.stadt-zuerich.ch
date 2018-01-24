// Example Express server

const express = require("express");
const app = require("./index");

const port = parseInt(process.env.PORT, 10) || 3000;

app.prepare().then(middleware => {
  const server = express();

  server.use(middleware);

  server.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
