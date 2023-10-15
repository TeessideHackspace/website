/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
    serverComponentsExternalPackages: [
      "handlebars",
      "gocardless-nodejs",
      "@aws-sdk/client-dynamodb",
      "@aws-sdk/client-ses",
      "@aws-sdk/lib-dynamodb",
    ],
  },
};

module.exports = nextConfig;
