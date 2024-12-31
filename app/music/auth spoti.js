import dotenv from 'dotenv';
import fs from 'fs';
import express from 'express';

dotenv.config();

const app = express();
const port = 4000;

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const redirectUri = 'http://localhost:4000/callback';
const scopes = 'user-library-read';

const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(redirectUri)}`;

console.log(`Visita esta URL para autorizar la aplicación: ${authUrl}`);

app.get('/callback', async (req, res) => {
  const code = req.query.code;
  console.log(`Authorization code: ${code}`);
  res.send('Authorization code received. You can now close this window.');

  // Guardar el código de autorización en un archivo
  fs.writeFileSync('authorization_code.txt', code);
  await getAccessToken();
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// Función para obtener el token de acceso
async function getAccessToken() {
  let refreshToken;
  try {
    refreshToken = fs.readFileSync('refresh_token.txt', 'utf8');
  } catch (err) {
    console.error('No se pudo leer el archivo refresh_token.txt:', err);
    return null;
  }

  const authOptions = {
    method: 'post',
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization:
        'Basic ' +
        Buffer.from(clientId + ':' + clientSecret).toString('base64'),
    },
    data: `grant_type=refresh_token&refresh_token=${refreshToken}`,
  };

  try {
    const response = await axios(authOptions);
    console.log('Token de acceso:', response.data.access_token);
    return response.data.access_token;
  } catch (error) {
    console.log('Error obteniendo el token de acceso:', error.response.data);
    return null;
  }
}
