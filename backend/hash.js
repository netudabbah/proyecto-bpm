const crypto = require('crypto');

/**
 * Genera un hash SHA-256 a partir de texto OCR normalizado
 */
function hashText(texto) {
  if (!texto || typeof texto !== 'string') {
    throw new Error('Texto inválido para hashear');
  }

  const normalizado = texto
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();

  return crypto
    .createHash('sha256')
    .update(normalizado)
    .digest('hex');
}

module.exports = { hashText };
