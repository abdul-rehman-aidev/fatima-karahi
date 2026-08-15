/**
 * Minimal static server WITH real compression — for local Lighthouse audits.
 * The `serve` package sends no Content-Encoding at all, which crushes
 * simulated-throttling Lighthouse scores in a way no real host would
 * (Vercel/Netlify/Cloudflare/Nginx all compress automatically). This
 * approximates that so local audit numbers are representative.
 */
import { createServer } from "node:http";
import { existsSync, statSync, readFileSync } from "node:fs";
import { gzipSync, brotliCompressSync, constants as zlibConstants } from "node:zlib";
import path from "node:path";

const ROOT = path.resolve("out");
const PORT = 4173;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".json": "application/json; charset=utf-8",
  ".avif": "image/avif",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".woff2": "font/woff2",
  ".xml": "application/xml",
  ".txt": "text/plain; charset=utf-8",
};
const COMPRESSIBLE = new Set([".html", ".js", ".css", ".svg", ".json", ".xml", ".txt"]);

const server = createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split("?")[0]);
  let filePath = path.join(ROOT, urlPath);

  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end();
    return;
  }
  if (existsSync(filePath) && statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, "index.html");
  }
  if (!existsSync(filePath)) {
    const notFound = path.join(ROOT, "404.html");
    if (existsSync(notFound)) {
      filePath = notFound;
      res.statusCode = 404;
    } else {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
  }

  const ext = path.extname(filePath);
  const contentType = MIME[ext] || "application/octet-stream";
  res.setHeader("Content-Type", contentType);
  res.setHeader("Cache-Control", ext === ".html" ? "no-cache" : "public, max-age=31536000, immutable");

  const acceptEncoding = req.headers["accept-encoding"] || "";
  const data = readFileSync(filePath);

  if (COMPRESSIBLE.has(ext) && /\bbr\b/.test(acceptEncoding)) {
    const compressed = brotliCompressSync(data, {
      params: { [zlibConstants.BROTLI_PARAM_QUALITY]: 11 },
    });
    res.setHeader("Content-Encoding", "br");
    res.setHeader("Content-Length", compressed.length);
    res.end(compressed);
  } else if (COMPRESSIBLE.has(ext) && /gzip/.test(acceptEncoding)) {
    const compressed = gzipSync(data, { level: 9 });
    res.setHeader("Content-Encoding", "gzip");
    res.setHeader("Content-Length", compressed.length);
    res.end(compressed);
  } else {
    res.setHeader("Content-Length", data.length);
    res.end(data);
  }
});

server.listen(PORT, () => {
  console.log(`compressed static server on http://localhost:${PORT}  (root: ${ROOT})`);
});
