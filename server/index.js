require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./db');
const authRoutes = require('./routes/auth');
const solicitudesRoutes = require('./routes/solicitudes');

const app = express();

app.use(cors());
app.use(express.json());

// ---- API ----
app.use('/api/auth', authRoutes);
app.use('/api/solicitudes', solicitudesRoutes);

// ---- Frontend estático (carpeta /public) ----
const publicDir = path.join(__dirname, '..', 'public');
app.use(express.static(publicDir));

// Cualquier otra ruta devuelve el index.html (sitio de una sola página)
app.get('*', (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0'; 

connectDB().then(() => {
  app.listen(PORT, HOST, () => {
    console.log(`🚀 CYMORA corriendo en http://localhost:${PORT}`);
  });
});
