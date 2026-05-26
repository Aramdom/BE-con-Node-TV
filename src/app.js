import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { requireApiKey, requireWriteToken } from './middleware/auth.js';
import usersRouter from './routes/users.js';

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.json());

// Serve beautiful static web UI on root /
app.use(express.static(path.join(__dirname, '../public')));

// Apply security middlewares exclusively to all API endpoints
app.use('/api', requireApiKey);
app.use('/api', requireWriteToken);

// User CRUD Router under /api/users
app.use('/api/users', usersRouter);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: `The endpoint ${req.method} ${req.url} does not exist.`
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: err.message || 'An unexpected error occurred.'
  });
});

export default app;
