/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // self-contained server for the Docker image (see Dockerfile)
  output: 'standalone',
  async redirects() {
    // the music page became the collection page
    return [{ source: '/music', destination: '/collection', permanent: true }];
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
