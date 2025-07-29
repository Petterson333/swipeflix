// backend/routes/auth.js
const router = require('express').Router();
const { createUser, findByEmail } = require('../models/user');
const bcrypt = require('bcrypt');
const { sign } = require('../utils/jwt');
const requireAuth = require('../middleware/auth');

// Inscription
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: 'Email et mot de passe requis' });
  try {
    const user = await createUser(email, password);
    const token = sign({ id: user.id, email: user.email });
    res.json({ token });
  } catch (err) {
    res.status(400).json({ error: err.detail || err.message });
  }
});

// Connexion
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await findByEmail(email);
  if (!user) return res.status(400).json({ error: 'Utilisateur non trouvé' });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ error: 'Mot de passe incorrect' });
  const token = sign({ id: user.id, email: user.email });
  res.json({ token });
});

// Route protégée : renvoie les infos du user connecté
router.get('/me', requireAuth, (req, res) => {
  res.json({ id: req.user.id, email: req.user.email });
});

module.exports = router;
