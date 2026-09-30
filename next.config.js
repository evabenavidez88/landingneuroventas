/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      // Diagnóstico online (página estática en /public/diagnostico)
      { source: '/diagnostico', destination: '/diagnostico/index.html' },
    ];
  },
};

module.exports = nextConfig;
