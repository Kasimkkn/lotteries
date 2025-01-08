import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js'
import userRoutes from './routes/userRoutes.js';
import raffleRoutes from './routes/raffleRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import ticketRoutes from './routes/ticketRoutes.js';
import clientRoutes from './routes/clientRoutes.js';
import { handleErrors } from './utils/CustomError.js';
import User from './models/userModel.js';
import cloudinary from 'cloudinary';

dotenv.config({
    path: './.env',
});

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

cloudinary['v2'].config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


// Routes
app.use('/api/users', userRoutes);
app.use('/api/raffles', raffleRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/clients', clientRoutes);
// Error handling middleware
app.use(handleErrors);

// Start server
const PORT = process.env.PORT || 5000;

const createadmin = async () => {
    try {
        const admin = await User.findOne({ role: 'admin' });
        if (!admin) {
            await User.create({
                username: 'admin',
                password: 'admin',
                role: 'admin',
            });
        } else {
            console.log('admin user already exists');
        }
    } catch (error) {
        console.error('Failed to create admin user:', error.message);
    }
};

const startServer = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        await createadmin();
        app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
    } catch (error) {
        console.error('Failed to start server:', error.message);
        process.exit(1); // Exit process with failure
    }
};

startServer();
