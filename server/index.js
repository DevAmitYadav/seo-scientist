import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pagespeedRoutes from './src/routes/pagespeedRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use('/api/pagespeed', pagespeedRoutes);

// Home route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to SEO Scientist Server!!!' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global error:", err);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(` Server running at http://localhost:${PORT}`);
});
