import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import User from './models/User.js';
import Entry from './models/Entry.js';

const app = express();

const PORT = process.env.PORT || 8080;
const ORIGIN = process.env.CORS_ORIGIN || '*';

app.use(cors({ origin: ORIGIN, credentials: true }));
app.use(helmet());
app.use(express.json());
app.use(morgan('tiny'));

app.get('/health', (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

// --- Auth helpers ---
function sign(user) {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
}
function auth(req, res, next) {
  const hdr = req.headers.authorization || '';
  const token = hdr.startsWith('Bearer ') ? hdr.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// --- Auth routes ---
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email & password required' });
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ error: 'User exists' });
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hash });
    res.json({ ok: true, token: sign(user) });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    res.json({ ok: true, token: sign(user) });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// --- Entries CRUD ---
app.get('/api/entries', auth, async (req, res) => {
  const list = await Entry.find({ owner: req.user.id }).sort({ date: -1 }).limit(200);
  res.json(list);
});
app.post('/api/entries', auth, async (req, res) => {
  const entry = await Entry.create({ ...req.body, owner: req.user.id });
  res.json(entry);
});
app.put('/api/entries/:id', auth, async (req, res) => {
  const entry = await Entry.findOneAndUpdate({ _id: req.params.id, owner: req.user.id }, req.body, { new: true });
  res.json(entry);
});
app.delete('/api/entries/:id', auth, async (req, res) => {
  await Entry.deleteOne({ _id: req.params.id, owner: req.user.id });
  res.json({ ok: true });
});

// --- Mongo connect & start ---
async function start() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.DB_NAME || 'mrsticker_production';
  if (!uri) {
    console.error('MONGODB_URI is required');
    process.exit(1);
  }
  await mongoose.connect(uri, { dbName });
  console.log('Mongo connected');
  app.listen(PORT, () => console.log('API up on', PORT));
}
start().catch(err => {
  console.error(err);
  process.exit(1);
});
