import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';
import { env } from '../config/env';
import { Admin, Hall, Booking, Payment, Notification, BookingLog, SystemSettings } from '../models';

const defaultAdminPassword = 'admin123';

// Load seed data from server-db.json (project root, one level up from backend/)
const getSeedData = () => {
    try {
        // Try multiple paths: project root (one up from backend) and cwd
        const possiblePaths = [
            path.resolve(process.cwd(), '..', 'server-db.json'),   // when cwd = backend/
            path.resolve(process.cwd(), 'server-db.json'),         // when cwd = project root
        ];
        for (const dbPath of possiblePaths) {
            if (fs.existsSync(dbPath)) {
                const raw = fs.readFileSync(dbPath, 'utf-8');
                return JSON.parse(raw);
            }
        }
        console.warn('[seed] server-db.json not found');
        return null;
    } catch (err) {
        console.error('[seed] Failed to read server-db.json:', err);
        return null;
    }
};

export const seedDatabase = async () => {
    try {
        // Admin only — no halls/bookings/payments demo data
        const adminExists = await Admin.findOne({ email: 'admin@sallehub.rw' });
        if (!adminExists) {
            await Admin.create({
                id: 'admin-001',
                email: 'admin@sallehub.rw',
                passwordHash: bcrypt.hashSync(defaultAdminPassword, 10),
                name: 'Parish Coordinator',
                role: 'admin',
            });
            console.log('Default admin user created');
        } else {
            console.log('Admin user already exists — skipping');
        }

        const settingsExists = await SystemSettings.findOne();
        if (!settingsExists) {
            await SystemSettings.create({
                siteName: 'SalleHub',
                siteTagline: 'Premium Parish Venue Reservations',
                timeZone: 'UTC',
                dateFormat: 'YYYY-MM-DD',
                currency: 'USD',
                workingHours: '9:00 AM - 6:00 PM',
            });
            console.log('Default system settings created');
        }

        console.log('Database seeding completed (admin only)');
    } catch (error) {
        console.error('Database seeding failed:', error);
    }
};

export const connectDatabase = async () => {
    if (!env.mongoUri) {
        console.log('MongoDB URI not configured. Please set MONGO_URI in .env');
        throw new Error('MongoDB URI is required');
    }

    try {
        await mongoose.connect(env.mongoUri, {
            dbName: env.mongoDbName,
        });

        console.log(`MongoDB connected successfully to database: ${env.mongoDbName}`);

        // Seed database with initial data
        await seedDatabase();
    } catch (error) {
        console.error('MongoDB connection failed:', error);
        throw error;
    }
};

export const disconnectDatabase = async () => {
    if (mongoose.connection.readyState !== 1) {
        return;
    }

    await mongoose.disconnect();
    console.log('MongoDB disconnected successfully.');
};
