const next = require("next");
const path = require("path");

const dev = process.env.NODE_ENV !== "production";

module.exports = {
  prepare: async () => {
    const app = next({ dev, dir: path.join(__dirname, "lib") });
    const handle = app.getRequestHandler();
    
    await app.prepare();

    // The middleware
    return async (req, res, next) => {
      // Add more stuff here if needed (custom routes etc., see https://github.com/zeit/next.js/#custom-server-and-routing)
      await handle(req, res);
      next();
    };
  }
};
