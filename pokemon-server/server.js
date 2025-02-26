const express = require('express');
const https = require('https');
const fs = require('fs');
const app = express();
const PORT = 443;

// Middleware para analizar el cuerpo de las solicitudes como JSON
app.use(express.json());

// Ruta de ejemplo
app.get('/api/registro', (req, res) => {
  res.json({ mensaje: 'Hola desde el servidor seguro!' });
});

// Cargar los archivos del certificado
const options = {
  key: fs.readFileSync('ssl/key.pem'), // Ruta a tu clave privada
  cert: fs.readFileSync('ssl/cert.pem'), // Ruta a tu certificado público
};

// Crear el servidor HTTPS
https.createServer(options, app).listen(PORT, () => {
  console.log(`Servidor HTTPS corriendo en https://localhost:${PORT}`);
});