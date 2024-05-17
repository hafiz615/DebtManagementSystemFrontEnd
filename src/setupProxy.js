const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://165.227.188.235:3000/",
      changeOrigin: true,
    })
  );
};
