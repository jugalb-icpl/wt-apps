module.exports = {
    apps: [
      {
        name: 'express-app',
        script: './index.js', // Replace with the entry point of your application
        instances: 1,
        autorestart: true,
        watch: false,
        max_memory_restart: '1G',
      },
    ],
  };
  