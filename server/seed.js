require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Empleado = require('./models/Empleado');

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ Falta MONGODB_URI en tu archivo .env');
    process.exit(1);
  }

  await mongoose.connect(uri);

  const usuario = (process.env.SEED_EMPLEADO_USUARIO || 'cymora').toLowerCase().trim();
  const password = process.env.SEED_EMPLEADO_PASSWORD || 'cambia-esta-clave';

  const existente = await Empleado.findOne({ usuario });

  if (existente) {
    console.log(`⚠️  Ya existe un empleado con usuario "${usuario}". No se creó nada.`);
    console.log('   Si quieres cambiar la contraseña, bórralo desde MongoDB Atlas y vuelve a correr "npm run seed".');
  } else {
    const passwordHash = await bcrypt.hash(password, 10);
    await Empleado.create({ usuario, passwordHash, nombre: 'Administrador CYMORA' });
    console.log('✅ Empleado creado correctamente:');
    console.log(`   Usuario:    ${usuario}`);
    console.log(`   Contraseña: ${password}`);
    console.log('   Puedes crear más empleados repitiendo este proceso con otro SEED_EMPLEADO_USUARIO en tu .env');
  }

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Error creando el empleado:', err.message);
  process.exit(1);
});
