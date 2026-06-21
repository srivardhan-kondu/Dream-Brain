import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
// Load server/.env regardless of the process working directory.
dotenv.config({ path: join(dirname(fileURLToPath(import.meta.url)), '../.env') });
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { connectDB } from './config/db.js';
import routes from './routes/index.js';

const app = express();
const PORT = process.env.PORT || 5050;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/dream_brain';
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

app.use(cors({ origin: CLIENT_ORIGIN.split(',').map((s) => s.trim()) }));
app.use(express.json());
app.use(morgan('dev'));

app.use('/api', routes);

app.get('/', (req, res) => res.json({ service: 'Dream Brain API', docs: '/api/health' }));

// 404 + error handlers
app.use((req, res) => res.status(404).json({ error: 'Not found.' }));
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong on the server.' });
});

connectDB(MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`✓ Dream Brain API listening on http://localhost:${PORT}`));
  })
  .catch(() => {
    console.error('Server not started because the database is unreachable.');
    process.exit(1);
  });
