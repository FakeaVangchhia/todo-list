/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { webpack, nextRuntime }) => {
    if (nextRuntime === "edge") {
      config.plugins.push(
        new webpack.DefinePlugin({
          "process.version": JSON.stringify("v20.0.0"),
        })
      );
    }

    return config;
  },
};

export default nextConfig;
