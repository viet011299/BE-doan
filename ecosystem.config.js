const NODE_ENV = 'production'
module.exports = {
  apps: [
    {
      name: 'do-an-backend',
      script: './src/server.js',
      env: {
        NODE_ENV,
      },
    },
  ],
}
