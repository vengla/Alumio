import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import chatRoutes from './routes/chatRoutes.js';

// Initialize express app
const app = express();

// Connect to database and seed if using in-memory
import seedDatabase from './scripts/seedDatabase.js';

const startApp = async () => {
    const conn = await connectDB();

    if (!conn) return; // Offline mode initiated

    // Check if we're using MongoMemoryServer (host will be 127.0.0.1 or similar)
    if (conn.connection.host.includes('127.0.0.1') || conn.connection.host.includes('localhost')) {
        console.log('🤖 Detected local/in-memory database. Running auto-seed...');
        await seedDatabase();
    }
};

startApp();

// Middleware
app.use(cors({
    origin: [process.env.FRONTEND_URL || 'http://localhost:3000', 'http://localhost:3001'],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware (development)
if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.path}`);
        next();
    });
}

// Health check route
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Alumni Platform API is running',
        timestamp: new Date().toISOString()
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/chat', chatRoutes);

// Root route
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Welcome to Alumni Platform API',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            users: '/api/users',
            jobs: '/api/jobs',
            health: '/health'
        }
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);

    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log('='.repeat(60));
    console.log(`🚀 Alumni Platform API Server`);
    console.log(`📡 Running on port ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 API Base URL: http://localhost:${PORT}`);
    console.log(`📚 API Docs: http://localhost:${PORT}/`);
    console.log('='.repeat(60));
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('❌ Unhandled Promise Rejection:', err);
    // Close server & exit process
    process.exit(1);
});

export default app;
