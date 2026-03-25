import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { MongoMemoryServer } from 'mongodb-memory-server';

dotenv.config();

const connectDB = async () => {
    // Check if we are already connected or connecting
    if (mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2) {
        return mongoose.connection;
    }

    try {
        const uri = process.env.MONGODB_URI;
        console.log('📡 Attempting to connect to primary database...');

        // Attempt primary connection
        const conn = await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 2000 // Even faster fail
        });

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        return conn;

    } catch (error) {
        console.error(`❌ Database Connection Error: ${error.message}`);

        try {
            // Ensure no lingering connection state
            if (mongoose.connection.readyState !== 0) {
                await mongoose.disconnect();
            }

            console.log('🔄 Attempting to start in-memory MongoDB fallback...');
            const mongod = await MongoMemoryServer.create();
            const uri = mongod.getUri();

            console.log(`📦 In-Memory MongoDB started at: ${uri}`);

            const conn = await mongoose.connect(uri);
            console.log(`✅ MongoDB (In-Memory) Connected: ${conn.connection.host}`);

            return conn;
        } catch (fallbackError) {
            console.error(`❌ In-Memory Fallback Failed: ${fallbackError.message}`);
            console.warn('⚠️ Switching to OFF-LINE MOCK MODE (Simulation).');
            console.warn('   - Login will accept any credentials');
            console.warn('   - Data will be ephemeral (simulated)');

            global.OFFLINE_MODE = true;
            return null;
        }
    }
};

export default connectDB;
