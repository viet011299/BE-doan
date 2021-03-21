const NODE_ENV = 'production'
module.exports = {
  apps: [
    {
      name: 'traveloka-backend',
      script: './src/server.js',
      env: {
        NODE_ENV,
      },
    },
  ],
}
