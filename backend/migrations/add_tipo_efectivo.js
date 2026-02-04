/**
 * Migración: Agregar columnas para pago en efectivo
 * Ejecutar una sola vez: node migrations/add_tipo_efectivo.js
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const pool = require('../db');

async function migrate() {
  console.log('🔄 Iniciando migración...');

  try {
    // Agregar columna 'tipo' si no existe
    await pool.query(`
      ALTER TABLE comprobantes
      ADD COLUMN IF NOT EXISTS tipo VARCHAR(20) DEFAULT 'transferencia'
    `);
    console.log('✅ Columna "tipo" agregada/verificada');

    // Agregar columna 'registrado_por' si no existe
    await pool.query(`
      ALTER TABLE comprobantes
      ADD COLUMN IF NOT EXISTS registrado_por VARCHAR(100)
    `);
    console.log('✅ Columna "registrado_por" agregada/verificada');

    // Actualizar registros existentes que no tengan tipo
    await pool.query(`
      UPDATE comprobantes
      SET tipo = 'transferencia'
      WHERE tipo IS NULL
    `);
    console.log('✅ Registros existentes actualizados');

    console.log('');
    console.log('🎉 Migración completada exitosamente');
    console.log('');
    console.log('Columnas agregadas a tabla "comprobantes":');
    console.log('  - tipo: VARCHAR(20) DEFAULT "transferencia"');
    console.log('  - registrado_por: VARCHAR(100)');

  } catch (error) {
    console.error('❌ Error en migración:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

migrate();
