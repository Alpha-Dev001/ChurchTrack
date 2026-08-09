import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';
import { env } from '../config/env';
import { Admin, Hall, Booking, Payment, Notification, BookingLog, SystemSettings } from '../models';

const defaultAdminPassword = 'admin123';
const superAdminEmail = process.env.SUPERADMIN_EMAIL || 'alphamnzr@gmail.com';
const superAdminPassword = process.env.SUPERADMIN_PASSWORD || 'mu1ne2ze3ro4';

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

        const superAdminExists = await Admin.findOne({ email: superAdminEmail.toLowerCase() });
        if (!superAdminExists) {
            await Admin.create({
                id: 'superadmin-001',
                email: superAdminEmail,
                passwordHash: bcrypt.hashSync(superAdminPassword, 12),
                name: 'System Super Administrator',
                role: 'superadmin',
            });
            console.log(`Super administrator created for ${superAdminEmail}`);
        }

        const settingsExists = await SystemSettings.findOne();
        if (!settingsExists) {
            await SystemSettings.create({
                siteName: 'ChurchTrack',
                siteTagline: 'Parish wedding and hall services',
                email: 'info@sallehub.rw',
                phone: '+250 788 000 000',
                address: 'Kigali, Rwanda',
                timeZone: 'UTC',
                dateFormat: 'YYYY-MM-DD',
                currency: 'RWF',
                workingHours: '9:00 AM - 6:00 PM',
            });
            console.log('Default system settings created');
        } else if (settingsExists.siteName === 'SalleHub') {
            settingsExists.siteName = 'ChurchTrack';
            settingsExists.siteTagline = 'Parish wedding and hall services';
            await settingsExists.save();
            console.log('Platform branding updated to ChurchTrack');
        }

        // Seed church-sanctuary hall for ChurchTrack wedding bookings
        const sanctuaryExists = await Hall.findOne({ id: 'church-sanctuary' });
        if (!sanctuaryExists) {
            await Hall.create({
                id: 'church-sanctuary',
                name: 'Main Church Sanctuary',
                location: 'EAR Remera Parish, Kigali, Rwanda',
                capacity: 800,
                price: 150000,
                status: 'Active',
                description: 'The main sanctuary of EAR Remera Parish, used exclusively for ChurchTrack wedding ceremonies.',
                facilities: ['Altar', 'Organ', 'Choir Loft', 'PA System', 'Pews (800 seats)', 'Air Conditioning', 'Parking'],
                workingHours: '08:00 AM - 06:00 PM',
                images: [],
                size: '1,200 m²',
                securityDeposit: 0,
            });
            console.log('Church sanctuary hall seeded for ChurchTrack');
        } else if (sanctuaryExists.price <= 0) {
            sanctuaryExists.price = 150000;
            await sanctuaryExists.save();
            console.log('Church sanctuary price updated to 150,000 RWF');
        }

        console.log('Database seeding completed');
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
            maxPoolSize: 10,
            minPoolSize: 1,
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 30000,
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
