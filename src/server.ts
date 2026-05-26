import app from './app.js';

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(`🚀 Secure User CRUD API is running on port ${PORT}`);
  console.log(`📂 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔒 Authorization Header Required: fha5HpDXSXSjKU0QCbdXiz1a`);
  console.log(`🔑 Non-GET Write Token Required: HIZe4D32twWOUP9h0I1IVTlr`);
  console.log(`===================================================`);
});

// Handle graceful shutdown
const gracefulShutdown = () => {
  console.log('\nStopping server gracefully...');
  server.close(() => {
    console.log('Server stopped.');
    process.exit(0);
  });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
