const apiRouter = require("./routes/api.router");
const webRouter = require("./routes/web.router");
class Router {
  constructor(express, next, apiRouter, webRouter) {
    this.express = express;
    this.next = next;
    this.apiRouter = apiRouter;
    this.webRouter = webRouter;
  }

  async init() {
    apiRouter.map((route) => {
      if (route.length && typeof route[0] == "function") {
        this.express.use(`/api/`, ...route);
      }
      if (typeof route[0] == "string") {
        this.express.use(`/api/${route[0]}/`, route[1]);
      } else {
        this.express.use("/api/", route);
      }
    });
    this.initWebRoutes();
    this.initPages();
    this.initErrors();
  }

  initPages() {
    this.express.get("*", (req, res) => {
      return this.next.render(req, res, `${req.path}`, req.query);
    });
  }

  initWebRoutes() {
    this.express.use(this.webRouter);
  }

  initErrors() {
    // catch 404 and forward to error handler
    this.express.use((req, res, next) => {
      const err = new Error("Not Found");
      err.status = 404;
      next(err);
    });

    this.express.use((err, req, res, next) => {
      if (err.status == 403) err.status = 404;
      res.status(err.status || 500);
      res.locals.error = err;
      res.locals.errorDescription = err.message;
      this.next.render(req, res, "/_error");
    });
  }
}

const router = (express, next) => {
  return new Router(express, next, apiRouter, webRouter);
};

module.exports = router;
