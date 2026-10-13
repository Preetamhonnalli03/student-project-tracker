
import express from 'express';

const app = express();

// Parse JSON request bodies.
app.use(express.json({ limit: '10kb' }));

// Health-check route must be registered before static serving or any fallback.
app.get('/api/health', (req, res) => {
  res.status(200).json({ ok: true });
});

// Serve the existing frontend.
app.use(express.static('public'));

const port = Number(process.env.PORT || 3000);

app.listen(port, () => {
  console.log(`Open http://localhost:${port}`);
});







