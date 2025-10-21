// /backend/generar-hash.js
const bcrypt = require('bcrypt');

// Aquí pones la contraseña que quieres hashear
const passwordPlana = 'rdproblems25';
const saltRounds = 10;

console.log(`Generando hash para: ${passwordPlana}`);

bcrypt.hash(passwordPlana, saltRounds, (err, hash) => {
  if (err) {
    console.error('Error al generar el hash:', err);
    return;
  }

  console.log('--- ¡Hash generado! ---');
  console.log(hash);
  console.log('-------------------------');
});