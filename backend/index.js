// backend/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
// (plus tard tu pourras ajouter moviesRoutes, swipeRoutes, etc.)

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
// app.use('/movies', moviesRoutes);
// app.use('/swipe', swipeRoutes);
// app.use('/match', matchRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
