/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
    SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
    SPOTIFY_REFRESH_TOKEN: process.env.SPOTIFY_REFRESH_TOKEN,
    EMAIL_SERVICE_ID: process.env.EMAIL_SERVICE_ID,
    EMAIL_TEMPLATE_ID: process.env.EMAIL_TEMPLATE_ID,
    EMAIL_SERVICE_UID: process.env.EMAIL_SERVICE_UID,
  },
  images: {
    domains: ['i.scdn.co', 'open.spotify.com'],
  },
};

export default nextConfig;
