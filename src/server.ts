import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

// Example Express Rest API endpoints
// app.get('/api/**', (req, res) => { });
// app.use('/api/**', (req, res) => res.json({ hello: 'foo' }));

app.get('/robots.txt', (req, res) => {
  res.status(200).sendFile(join(browserDistFolder, 'robots.txt'));
});

// Serve static files from /browser
app.get(
  '**',
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: 'index.html',
    setHeaders: (res) => {
      const headers = angularApp.getPrerenderHeaders(res.req);
      for (const [key, value] of headers) {
        res.setHeader(key, value);
      }
    },
  })
);

app.get('**', (req, res, next) => {
  angularApp
    .render(req)
    .then((response) => (response ? writeResponseToNodeResponse(response, res) : next()))
    .catch(next);
});

if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

export default createNodeRequestHandler(app);
