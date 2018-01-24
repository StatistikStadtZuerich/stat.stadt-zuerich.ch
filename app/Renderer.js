const next = require("next");
const path = require("path");

const dev = process.env.NODE_ENV !== "production";

class Renderer {
  constructor () {
    const app = next({ dev, dir: path.join(__dirname, "lib") });

    app.prepare().then(() => {
      this.handle = app.getRequestHandler();
    });
  }

  render (req, res) {
    if (!this.handle) {
      return res.end("renderer not ready");
    }

    this.handle(req, res);
  }

  error () {
    this.render(req, res);
  }
}

module.exports = Renderer
