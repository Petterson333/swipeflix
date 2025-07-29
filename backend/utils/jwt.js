const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

function sign(payload) {
  return jwt.sign(payload, secret, { expiresIn: '7d' });
}

function verify(token) {
  return jwt.verify(token, secret);
}

module.exports = { sign, verify };
