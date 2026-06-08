const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3001;
const DB_PATH = path.join(__dirname, 'db.json');

// ── UPLOADS ───────────────────────────────────────────────────────────────────

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, `${uuidv4()}${path.extname(file.originalname)}`)
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Apenas imagens são permitidas'));
  }
});

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

function readDB() {
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
}

function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// ── UPLOAD ────────────────────────────────────────────────────────────────────

app.post('/upload', upload.single('imagem'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'Nenhuma imagem enviada' });
  res.json({ url: `http://localhost:${PORT}/uploads/${req.file.filename}` });
});

// ── AUTH ──────────────────────────────────────────────────────────────────────

app.post('/auth/login', (req, res) => {
  const { email, senha } = req.body;
  if (!email || !senha) return res.status(400).json({ message: 'Email e senha são obrigatórios' });

  const db = readDB();
  const usuario = db.usuarios.find(u => u.email === email && u.senha === senha);
  if (!usuario) return res.status(401).json({ message: 'Email ou senha inválidos' });

  const { senha: _, ...usuarioSemSenha } = usuario;
  res.json(usuarioSemSenha);
});

app.post('/auth/register', (req, res) => {
  const { nome, email, senha } = req.body;
  if (!nome || !email || !senha) return res.status(400).json({ message: 'Todos os campos são obrigatórios' });

  const db = readDB();
  if (db.usuarios.find(u => u.email === email)) {
    return res.status(409).json({ message: 'Usuário já existe' });
  }

  const novo = { id: uuidv4(), nome, email, senha, tipo: 'cliente' };
  db.usuarios.push(novo);
  writeDB(db);

  const { senha: _, ...usuarioSemSenha } = novo;
  res.status(201).json(usuarioSemSenha);
});

// ── IMÓVEIS ───────────────────────────────────────────────────────────────────

app.get('/imoveis', (req, res) => {
  const db = readDB();
  const { cidade, tipo } = req.query;
  let imoveis = db.imoveis;

  if (cidade) imoveis = imoveis.filter(i => i.cidade.toLowerCase().includes(cidade.toLowerCase()));
  if (tipo) imoveis = imoveis.filter(i => i.tipo.toLowerCase() === tipo.toLowerCase());

  res.json(imoveis);
});

app.get('/imoveis/:id', (req, res) => {
  const db = readDB();
  const imovel = db.imoveis.find(i => i.id === req.params.id);
  if (!imovel) return res.status(404).json({ message: 'Imóvel não encontrado' });
  res.json(imovel);
});

app.post('/imoveis', (req, res) => {
  const db = readDB();
  const novo = { id: uuidv4(), ...req.body };
  db.imoveis.push(novo);
  writeDB(db);
  res.status(201).json(novo);
});

app.put('/imoveis/:id', (req, res) => {
  const db = readDB();
  const idx = db.imoveis.findIndex(i => i.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Imóvel não encontrado' });
  db.imoveis[idx] = { ...db.imoveis[idx], ...req.body, id: req.params.id };
  writeDB(db);
  res.json(db.imoveis[idx]);
});

app.delete('/imoveis/:id', (req, res) => {
  const db = readDB();
  const idx = db.imoveis.findIndex(i => i.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Imóvel não encontrado' });
  db.imoveis.splice(idx, 1);
  writeDB(db);
  res.status(204).send();
});

// ── INTERESSES ────────────────────────────────────────────────────────────────

app.get('/interesses', (req, res) => {
  const db = readDB();
  const { clienteId } = req.query;
  const result = clienteId
    ? db.interesses.filter(i => String(i.clienteId) === String(clienteId))
    : db.interesses;
  res.json(result);
});

app.post('/interesses', (req, res) => {
  const { clienteId, imovelId } = req.body;
  if (!clienteId || !imovelId) return res.status(400).json({ message: 'clienteId e imovelId são obrigatórios' });

  const db = readDB();
  const jaExiste = db.interesses.find(
    i => String(i.clienteId) === String(clienteId) && i.imovelId === imovelId
  );
  if (jaExiste) return res.status(409).json({ message: 'Interesse já registrado' });

  const novo = { id: uuidv4(), clienteId: String(clienteId), imovelId };
  db.interesses.push(novo);
  writeDB(db);
  res.status(201).json(novo);
});

app.delete('/interesses/:id', (req, res) => {
  const db = readDB();
  const idx = db.interesses.findIndex(i => String(i.id) === String(req.params.id));
  if (idx === -1) return res.status(404).json({ message: 'Interesse não encontrado' });
  db.interesses.splice(idx, 1);
  writeDB(db);
  res.status(204).send();
});

// ── USUÁRIOS ──────────────────────────────────────────────────────────────────

app.put('/usuarios/:id', (req, res) => {
  const db = readDB();
  const idx = db.usuarios.findIndex(u => String(u.id) === String(req.params.id));
  if (idx === -1) return res.status(404).json({ message: 'Usuário não encontrado' });

  const { nome } = req.body;
  if (!nome || !nome.trim()) return res.status(400).json({ message: 'Nome é obrigatório' });

  db.usuarios[idx].nome = nome.trim();
  writeDB(db);

  const { senha, ...usuarioSemSenha } = db.usuarios[idx];
  res.json(usuarioSemSenha);
});

// ─────────────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});
