const mongoose = require('mongoose');

const solicitudSchema = new mongoose.Schema(
  {
    empresa: { type: String, required: true, trim: true },
    contacto: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    telefono: { type: String, required: true, trim: true },
    tipoEquipo: { type: String, required: true, trim: true },
    cantidad: { type: Number, required: true, min: 1 },
    info: { type: String, trim: true, default: '' },
    estado: {
      type: String,
      enum: ['nueva', 'contactado', 'cerrada'],
      default: 'nueva',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Solicitud', solicitudSchema);
