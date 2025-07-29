const { verify } = require('../utils/jwt');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Token manquant' });
  const token = authHeader.split(' ')[1];
  try {
    req.user = verify(token);
    next();
  } catch {
    res.status(401).json({ error: 'Token invalide' });
  }
};
