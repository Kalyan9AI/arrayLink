const express = require('express');
const path = require('path');
const fs = require('fs');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

const buildDir = path.join(__dirname, 'build');
const buildVersion = process.env.BUILD_VERSION || Math.floor(Date.now() / 1000).toString();

// Serve static files from the React app build directory with sensible cache headers
app.use((req, res, next) => {
  const urlPath = req.path;
  if (urlPath.match(/\.(?:js|css|png|jpg|jpeg|gif|svg|ico|webp|woff2?|ttf|eot)$/)) {
    // CRA outputs hashed filenames for JS/CSS; set long cache
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  }
  next();
});

app.use(express.static(buildDir));

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

// Handle React routing for all other routes with HTML no-cache and build version injection
app.get('*', function(req, res) {
  const indexPath = path.join(buildDir, 'index.html');
  try {
    let html = fs.readFileSync(indexPath, 'utf8');
    html = html.replace(/__BUILD_VERSION__/g, buildVersion);
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
    res.send(html);
  } catch (e) {
    res.sendFile(indexPath);
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}; build version ${buildVersion}`);
}); 