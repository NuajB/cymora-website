const mongoose = require('mongoose');

const empleadoSchema = new mongoose.Schema(
  {
    usuario: { type: String, required: true, unique: true, trim: true, lowercase: true },
    passwordHash: { type: String, required: true },
    nombre: { type: String, trim: true, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Empleado', empleadoSchema);
