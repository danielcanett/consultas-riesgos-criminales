const { createProxyMiddleware } = require('http-proxy-middleware');

// 🔥 CACHE BUSTER PARA PROXY
console.log('🔥🔥🔥 PROXY CACHE BUSTER:', Date.now());

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:8001',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '', // remove base path
      },
      onProxyReq: (proxyReq, req, res) => {
        console.log('🔥 PROXY REQUEST:', req.method, req.url);
      },
      onProxyRes: (proxyRes, req, res) => {
        console.log('🔥 PROXY RESPONSE:', proxyRes.statusCode);
      }
    })
  );
};
