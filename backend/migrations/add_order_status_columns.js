/**
 * Migración: Agregar columnas para estado de pedido y datos del cliente
 * Ejecutar una sola vez: node migrations/add_order_status_columns.js
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const pool = require('../db');

async function migrate() {
  console.log('🔄 Iniciando migración de estado de pedido...');

  try {
    // Agregar columna 'estado_pedido' si no existe
    await pool.query(`
      ALTER TABLE orders_validated
      ADD COLUMN IF NOT EXISTS estado_pedido VARCHAR(20) DEFAULT 'pendiente_pago'
    `);
    console.log('✅ Columna "estado_pedido" agregada/verificada');

    // Agregar columnas de cliente
    await pool.query(`
      ALTER TABLE orders_validated
      ADD COLUMN IF NOT EXISTS customer_name VARCHAR(255)
    `);
    console.log('✅ Columna "customer_name" agregada/verificada');

    await pool.query(`
      ALTER TABLE orders_validated
      ADD COLUMN IF NOT EXISTS customer_email VARCHAR(255)
    `);
    console.log('✅ Columna "customer_email" agregada/verificada');

    await pool.query(`
      ALTER TABLE orders_validated
      ADD COLUMN IF NOT EXISTS customer_phone VARCHAR(50)
    `);
    console.log('✅ Columna "customer_phone" agregada/verificada');

    // Agregar columnas de timestamps de workflow
    await pool.query(`
      ALTER TABLE orders_validated
      ADD COLUMN IF NOT EXISTS printed_at TIMESTAMP
    `);
    console.log('✅ Columna "printed_at" agregada/verificada');

    await pool.query(`
      ALTER TABLE orders_validated
      ADD COLUMN IF NOT EXISTS packed_at TIMESTAMP
    `);
    console.log('✅ Columna "packed_at" agregada/verificada');

    await pool.query(`
      ALTER TABLE orders_validated
      ADD COLUMN IF NOT EXISTS shipped_at TIMESTAMP
    `);
    console.log('✅ Columna "shipped_at" agregada/verificada');

    // Actualizar estado_pedido basado en estado_pago existente
    await pool.query(`
      UPDATE orders_validated
      SET estado_pedido = CASE
        WHEN estado_pago IN ('confirmado_total', 'a_favor') THEN 'a_imprimir'
        WHEN estado_pago = 'confirmado_parcial' THEN 'a_imprimir'
        ELSE 'pendiente_pago'
      END
      WHERE estado_pedido IS NULL OR estado_pedido = 'pendiente_pago'
    `);
    console.log('✅ Estados de pedido actualizados según estado de pago');

    console.log('');
    console.log('🎉 Migración completada exitosamente');
    console.log('');
    console.log('Columnas agregadas a tabla "orders_validated":');
    console.log('  - estado_pedido: VARCHAR(20) DEFAULT "pendiente_pago"');
    console.log('  - customer_name: VARCHAR(255)');
    console.log('  - customer_email: VARCHAR(255)');
    console.log('  - customer_phone: VARCHAR(50)');
    console.log('  - printed_at: TIMESTAMP');
    console.log('  - packed_at: TIMESTAMP');
    console.log('  - shipped_at: TIMESTAMP');

  } catch (error) {
    console.error('❌ Error en migración:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

migrate();
