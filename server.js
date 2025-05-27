const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, 'build')));

// Proxy configuration for /sales-agent
app.use('/sales-agent', createProxyMiddleware({
  target: 'https://sales-agent-c3f5ecevdefjcafc.canadacentral-01.azurewebsites.net',
  changeOrigin: true,
  secure: false,
  ws: true,
  logLevel: 'debug',
  pathRewrite: {
    '^/sales-agent': ''
  },
  onProxyRes: function (proxyRes, req, res) {
    console.log('Proxy Response Status:', proxyRes.statusCode);
  },
  onError: function (err, req, res) {
    console.error('Proxy Error:', err);
    res.writeHead(500, {
      'Content-Type': 'text/plain'
    });
    res.end('Something went wrong with the proxy: ' + err.message);
  }
}));

// Handle React routing for all other routes
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 