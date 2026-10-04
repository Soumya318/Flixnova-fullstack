require('dotenv').config();
// Prefer IPv4: on some networks/hotspots Node's fetch fails over IPv6 even though browsers work
require('dns').setDefaultResultOrder('ipv4first');
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const OMDB_API_KEY = process.env.OMDB_API_KEY;
const RATINGS_FILE = path.join(__dirname, 'data', 'ratings.json');
const CACHE_FILE = path.join(__dirname, 'data', 'omdb-cache.json');

app.use(cors());
app.use(express.json());

// ---- tiny JSON-file storage helpers ----
function readJson(file) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return {}; }
}
function writeJson(file, obj) {
  fs.writeFileSync(file, JSON.stringify(obj, null, 2));
}

// ---- simple rate limiter (per IP, 400 req/min) ----
const hits = new Map();
app.use('/api', (req, res, next) => {
  const now = Date.now();
  const rec = (hits.get(req.ip) || []).filter(t => now - t < 60000);
  rec.push(now);
  hits.set(req.ip, rec);
  if (rec.length > 400) return res.status(429).json({ error: 'Too many requests' });
  next();
});

// ---- health ----
app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

// ---- OMDb proxy (keeps the API key on the server, caches on disk) ----
app.get('/api/movie', async (req, res) => {
  const title = (req.query.title || '').trim();
  if (!title || title.length > 200) {
    return res.status(400).json({ Response: 'False', error: 'A valid "title" query param is required' });
  }
  if (!OMDB_API_KEY) return res.status(500).json({ Response: 'False', error: 'OMDB_API_KEY is not configured' });

  const cache = readJson(CACHE_FILE);
  if (cache[title]) return res.json(cache[title]);

  let lastErr;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const r = await fetch(`https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${OMDB_API_KEY}`, { signal: AbortSignal.timeout(10000) });
      const data = await r.json();
      if (data.Response !== 'True') console.warn(`OMDb said "${data.Error}" for "${title}"`);
      if (data.Response === 'True') {
        cache[title] = data;
        writeJson(CACHE_FILE, cache);
      }
      return res.json(data);
    } catch (err) {
      lastErr = err;
      await new Promise(r => setTimeout(r, 400 * attempt));
    }
  }
  const cause = lastErr.cause ? (lastErr.cause.code || lastErr.cause.message) : '';
  console.error(`OMDb error for "${title}":`, lastErr.message, cause);
  res.status(502).json({ Response: 'False', error: 'Failed to reach OMDb', detail: cause });
});

// ---- ratings CRUD ----
app.get('/api/ratings', (req, res) => res.json({ ratings: readJson(RATINGS_FILE) }));

app.put('/api/ratings', (req, res) => {
  const { key, value } = req.body || {};
  const v = Number(value);
  if (typeof key !== 'string' || !key.trim() || key.length > 200) {
    return res.status(400).json({ error: '"key" must be a non-empty string' });
  }
  if (!Number.isInteger(v) || v < 1 || v > 5) {
    return res.status(400).json({ error: '"value" must be an integer between 1 and 5' });
  }
  const ratings = readJson(RATINGS_FILE);
  ratings[key] = v;
  writeJson(RATINGS_FILE, ratings);
  res.json({ key, value: v });
});

app.delete('/api/ratings/:key', (req, res) => {
  const ratings = readJson(RATINGS_FILE);
  if (!(req.params.key in ratings)) return res.status(404).json({ error: 'Rating not found' });
  delete ratings[req.params.key];
  writeJson(RATINGS_FILE, ratings);
  res.json({ deleted: req.params.key });
});

// ---- serve the frontend ----
app.use(express.static(path.join(__dirname, '..', 'client')));

// ---- 404 + error handlers ----
app.use('/api', (req, res) => res.status(404).json({ error: 'Route not found' }));
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => console.log(`FlixNova running at http://localhost:${PORT}`));
