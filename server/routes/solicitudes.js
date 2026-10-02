const express = require('express');
const Solicitud = require('../models/Solicitud');
const requireAuth = require('../middleware/auth');

const router = express.Router();

// POST /api/solicitudes -> pública, la usa el formulario "Solicitar diagnóstico empresarial"
router.post('/', async (req, res) => {
  try {
    const { empresa, contacto, email, telefono, tipoEquipo, cantidad, info } = req.body;

    if (!empresa || !contacto || !email || !telefono || !tipoEquipo || !cantidad) {
      return res.status(400).json({ error: 'Por favor completa todos los campos obligatorios' });
    }

    const solicitud = await Solicitud.create({
      empresa,
      contacto,
      email,
      telefono,
      tipoEquipo,
      cantidad,
      info,
    });

    res.status(201).json(solicitud);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'No se pudo guardar tu solicitud. Intenta de nuevo.' });
  }
});

// GET /api/solicitudes -> protegida, la usa el panel de empleados
router.get('/', requireAuth, async (req, res) => {
  try {
    const solicitudes = await Solicitud.find().sort({ createdAt: -1 });
    res.json(solicitudes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'No se pudieron cargar las solicitudes' });
  }
});

// PATCH /api/solicitudes/:id/estado -> protegida, marcar como contactado/cerrada
router.patch('/:id/estado', requireAuth, async (req, res) => {
  try {
    const { estado } = req.body;
    if (!['nueva', 'contactado', 'cerrada'].includes(estado)) {
      return res.status(400).json({ error: 'Estado inválido' });
    }

    const solicitud = await Solicitud.findByIdAndUpdate(
      req.params.id,
      { estado },
      { new: true }
    );

    if (!solicitud) {
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }

    res.json(solicitud);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'No se pudo actualizar la solicitud' });
  }
});

module.exports = router;
