const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const ROOT_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.xml': 'application/xml',
  '.txt': 'text/plain'
};

const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';

  // Support des URLs réécrites comme sur Vercel (/videos/slug -> /video.html)
  if (reqPath.startsWith('/videos/') && !reqPath.includes('.')) {
    reqPath = '/video.html';
  }
  
  let filePath = path.join(ROOT_DIR, reqPath);

  // Sécurité traversée de dossier
  if (!filePath.startsWith(ROOT_DIR)) {
    res.writeHead(403);
    res.end('Accès interdit');
    return;
  }

  // Fallback si cherché dans public/ ou assets/
  if (!fs.existsSync(filePath)) {
    const publicCandidate = path.join(ROOT_DIR, 'public', reqPath);
    if (fs.existsSync(publicCandidate) && fs.statSync(publicCandidate).isFile()) {
      filePath = publicCandidate;
    }
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=UTF-8' });
      res.end('<h1>404 - Page non trouvée</h1><p><a href="/index.html">Retour à l\'accueil</a></p>');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, { 
      'Content-Type': contentType,
      'Cache-Control': 'no-cache'
    });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`Serveur local lancé sur http://localhost:${PORT}`);
});
