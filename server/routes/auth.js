const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Empleado = require('../models/Empleado');

const router = express.Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { usuario, password } = req.body;

    if (!usuario || !password) {
      return res.status(400).json({ error: 'Usuario y contraseña son obligatorios' });
    }

    const empleado = await Empleado.findOne({ usuario: usuario.toLowerCase().trim() });
    if (!empleado) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }

    const valido = await bcrypt.compare(password, empleado.passwordHash);
    if (!valido) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }

    const token = jwt.sign(
      { id: empleado._id, usuario: empleado.usuario, nombre: empleado.nombre },
      process.env.JWT_SECRET,
      { expiresIn: '12h' }
    );

    res.json({ token, nombre: empleado.nombre || empleado.usuario });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor. Intenta de nuevo.' });
  }
});

module.exports = router;
