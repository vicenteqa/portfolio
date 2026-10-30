/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // self-contained server for the Docker image (see Dockerfile)
  output: 'standalone',
  async redirects() {
    // the music page was briefly the collection page (vinyl + games; games hidden for now)
    return [{ source: '/collection', destination: '/music', permanent: true }];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.scdn.co',
      },
      {
        protocol: 'https',
        hostname: 'open.spotify.com',
      },
    ],
  },
};

export default nextConfig;
