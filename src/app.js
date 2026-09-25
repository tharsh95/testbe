import express from 'express';
import { config } from './config/env.js';
import userRoutes from './routes/user.routes.js';
import productRoutes from './routes/product.routes.js';
import orderRoutes from './routes/order.routes.js';
// import { notFound } from './middleware/not-found.middleware.js';
import { errorHandler } from './middleware/error.middleware.js';

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// 404 handler
// app.use(notFound);

// Error handler
app.use(errorHandler);

export default app;