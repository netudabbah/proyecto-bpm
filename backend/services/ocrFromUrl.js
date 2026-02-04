const axios = require('axios');
const vision = require('@google-cloud/vision');

const client = new vision.ImageAnnotatorClient();

/**
 * Ejecuta OCR desde una URL pública y devuelve texto plano normalizado
 */
async function ocrFromUrl(fileUrl) {
  if (!fileUrl) {
    throw new Error('URL de archivo no proporcionada');
  }

  // Descargar archivo
  const response = await axios.get(fileUrl, {
    responseType: 'arraybuffer'
  });

  const buffer = Buffer.from(response.data, 'binary');

  // Enviar a Google Vision
  const [result] = await client.textDetection(buffer);
  const detections = result.textAnnotations;

  if (!detections || detections.length === 0) {
    return '';
  }

  const texto = detections[0].description || '';

  // Normalización básica
  return texto.replace(/\s+/g, ' ').trim();
}

module.exports = { ocrFromUrl };
