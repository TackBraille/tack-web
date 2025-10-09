// Simple example proxy for LLM calls. Keep API key on the server.
// Usage: node server/proxy-gemini.js

import express from 'express';
import fetch from 'node-fetch';

const app = express();
app.use(express.json({ limit: '10mb' }));

const GEMINI_URL = process.env.GEMINI_URL || 'https://api.your-llm.example/v1/generate';
const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.warn('GEMINI_API_KEY is not set. Proxy will reject requests without a key.');
}

app.post('/v1/gemini-proxy', async (req, res) => {
  try {
    if (!API_KEY) return res.status(500).json({ error: 'Server missing GEMINI_API_KEY' });
    const body = req.body;
    const r = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify(body),
    });
    const data = await r.json();
    res.status(r.status).json(data);
  } catch (err) {
    console.error('Proxy error:', err);
    res.status(500).json({ error: 'Proxy error' });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`LLM proxy listening on http://localhost:${port}`);
});
