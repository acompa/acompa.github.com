import { createReadStream, existsSync } from 'node:fs';
import { copyFile, mkdir, readdir, stat } from 'node:fs/promises';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const TEXT_TYPES = new Set([
  'text/html',
  'application/xml',
  'application/json',
  'text/css',
  'application/javascript',
  'text/plain',
]);

const MIME_TYPES = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.xml', 'application/xml; charset=utf-8'],
  ['.atom', 'application/atom+xml; charset=utf-8'],
  ['.rss', 'application/rss+xml; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'],
  ['.js', 'application/javascript; charset=utf-8'],
  ['.txt', 'text/plain; charset=utf-8'],
  ['.svg', 'image/svg+xml'],
  ['.png', 'image/png'],
  ['.jpg', 'image/jpeg'],
  ['.jpeg', 'image/jpeg'],
  ['.gif', 'image/gif'],
  ['.webp', 'image/webp'],
  ['.ico', 'image/x-icon'],
  ['.pdf', 'application/pdf'],
]);

function contentTypeFor(pathname) {
  const type = MIME_TYPES.get(extname(pathname).toLowerCase()) ?? 'application/octet-stream';
  if (TEXT_TYPES.has(type.split(';')[0]) && !type.includes('charset')) {
    return `${type}; charset=utf-8`;
  }
  return type;
}

async function fileExists(path) {
  try {
    await stat(path);
    return true;
  } catch (error) {
    if (error && error.code === 'ENOENT') {
      return false;
    }
    throw error;
  }
}

function resolveCandidates(pathname) {
  let decoded;
  try {
    decoded = decodeURIComponent(pathname);
  } catch (error) {
    return [];
  }

  const cleaned = decoded.replace(/^\/+/, '').replace(/\/+/g, '/');
  if (!cleaned) {
    return [];
  }

  const base = cleaned.replace(/\/+$/, '');
  const candidates = new Set();
  const extension = extname(base);

  if (extension) {
    candidates.add(base);
  } else {
    candidates.add(base);
    candidates.add(`${base}.html`);
    candidates.add(`${base}/index.html`);
  }

  return [...candidates].filter(Boolean);
}

async function copyLegacyContents(legacyRoot, outDir) {
  const queue = [{ source: legacyRoot, destination: outDir }];

  while (queue.length > 0) {
    const { source, destination } = queue.pop();
    const entries = await readdir(source, { withFileTypes: true });

    await mkdir(destination, { recursive: true });

    for (const entry of entries) {
      const sourcePath = join(source, entry.name);
      const destinationPath = join(destination, entry.name);

      if (entry.isDirectory()) {
        queue.push({ source: sourcePath, destination: destinationPath });
        continue;
      }

      if (await fileExists(destinationPath)) {
        continue;
      }

      await mkdir(dirname(destinationPath), { recursive: true });
      await copyFile(sourcePath, destinationPath);
    }
  }
}

function legacyDevMiddleware(legacyRoot) {
  return async function legacyHandler(req, res, next) {
    if (!req.url) {
      return next();
    }

    const url = new URL(req.url, 'http://local');
    if (url.pathname === '/' || url.pathname.startsWith('/@') || url.pathname.startsWith('/_astro/')) {
      return next();
    }

    if (req.method && !['GET', 'HEAD'].includes(req.method.toUpperCase())) {
      return next();
    }

    const candidates = resolveCandidates(url.pathname);
    for (const relative of candidates) {
      const filePath = resolve(legacyRoot, relative);
      if (!filePath.startsWith(legacyRoot)) {
        continue;
      }

      try {
        const stats = await stat(filePath);
        if (!stats.isFile()) {
          continue;
        }

        res.setHeader('Content-Type', contentTypeFor(filePath));
        res.setHeader('Cache-Control', 'no-cache');
        if (req.method && req.method.toUpperCase() === 'HEAD') {
          res.statusCode = 200;
          res.end();
          return;
        }

        return createReadStream(filePath).pipe(res);
      } catch (error) {
        if (error && error.code === 'ENOENT') {
          continue;
        }
        return next(error);
      }
    }

    return next();
  };
}

export default function legacyStatic() {
  let legacyRoot;
  let legacyAvailable = false;

  return {
    name: 'legacy-static',
    hooks: {
      'astro:config:setup': ({ config, updateConfig }) => {
        const rootDir = config.root ? fileURLToPath(config.root) : process.cwd();
        legacyRoot = resolve(rootDir, 'public', 'legacy');
        legacyAvailable = existsSync(legacyRoot);

        if (!legacyAvailable) {
          return;
        }

        updateConfig({
          vite: {
            plugins: [
              {
                name: 'legacy-static-dev',
                configureServer(server) {
                  server.middlewares.use(legacyDevMiddleware(legacyRoot));
                },
              },
            ],
          },
        });
      },
      'astro:build:done': async ({ dir }) => {
        if (!legacyRoot || !legacyAvailable) {
          return;
        }

        const outDir = fileURLToPath(dir);
        await copyLegacyContents(legacyRoot, outDir);
      },
    },
  };
}
