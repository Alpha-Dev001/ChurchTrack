import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { env } from '../config/env';
import { Admin, Hall, Booking, Payment, Notification, BookingLog, SystemSettings } from '../models';
import { seedDatabase } from '../services/database.service';
import { AppError } from '../middlewares/error.middleware';

export const handleLogin = async (req: any, res: any) => {
    const { email, password } = req.body || {};

    if (typeof email !== 'string' || typeof password !== 'string' || email.length > 254 || password.length > 200) {
        throw new AppError('Email and password are required', 400);
    }

    const admin = await Admin.findOne({ email: String(email).toLowerCase().trim() });
    const valid = admin && (await bcrypt.compare(password, admin.passwordHash));

    if (!admin || !valid) {
        throw new AppError('Invalid email or password', 401);
    }

    const token = jwt.sign(
        { id: admin.id, email: admin.email, name: admin.name, role: admin.role },
        env.jwtSecret,
        { expiresIn: '7d' }
    );

    const adminData = {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
    };

    return res.json({ token, user: adminData, admin: adminData });
};

export const getStats = async (_req: any, res: any) => {
    const [totalHalls, pendingBookings, totalBookings, approvedBookings, payments] = await Promise.all([
        Hall.countDocuments(),
        Booking.countDocuments({ status: 'Pending' }),
        Booking.countDocuments(),
        Booking.countDocuments({ status: 'Approved' }),
        Payment.find({ status: 'Paid' }),
    ]);

    const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const occupancyRate =
        totalBookings > 0 ? Math.round((approvedBookings / totalBookings) * 100) : 0;

    return res.json({
        totalBookings,
        pendingBookings,
        totalRevenue,
        totalHalls,
        occupancyRate,
    });
};

export const resetDatabase = async (_req: any, res: any) => {
    await Hall.deleteMany({});
    await Booking.deleteMany({});
    await Payment.deleteMany({});
    await Admin.deleteMany({});

    await seedDatabase();

    return res.json({
        success: true,
        message: 'Database reset successfully and default admin reseeded',
    });
};

export const getSuperAdminInsights = async (_req: any, res: any) => {
    const [admins, totalHalls, totalBookings, pendingBookings, approvedBookings, rejectedBookings, payments, notifications, auditEntries, settings] = await Promise.all([
        Admin.find({}, { id: 1, email: 1, name: 1, role: 1, createdAt: 1 }).sort({ createdAt: -1 }).lean(),
        Hall.countDocuments(),
        Booking.countDocuments(),
        Booking.countDocuments({ status: 'Pending' }),
        Booking.countDocuments({ status: 'Approved' }),
        Booking.countDocuments({ $or: [{ status: 'Rejected' }, { status: 'Cancelled' }] }),
        Payment.find({}, { amount: 1, status: 1 }).lean(),
        Notification.countDocuments({ read: false }),
        BookingLog.find({}, { id: 1, bookingId: 1, action: 1, performedBy: 1, timestamp: 1, details: 1 }).sort({ timestamp: -1 }).limit(12).lean(),
        SystemSettings.findOne().lean(),
    ]);

    const paidPayments = payments.filter((payment) => payment.status === 'Paid');
    const totalRevenue = paidPayments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
    const dbState = ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState] || 'unknown';

    return res.json({
        generatedAt: new Date().toISOString(),
        uptimeSeconds: Math.floor(process.uptime()),
        process: {
            nodeVersion: process.version,
            memoryUsageMb: Math.round(process.memoryUsage().rss / 1024 / 1024),
            environment: process.env.NODE_ENV || 'development',
        },
        services: { api: 'healthy', database: dbState, cloudinary: Boolean(process.env.CLOUDINARY_CLOUD_NAME) ? 'configured' : 'not configured' },
        totals: { admins: admins.length, totalHalls, totalBookings, pendingBookings, approvedBookings, rejectedBookings, totalRevenue, unreadNotifications: notifications, auditEntries: await BookingLog.countDocuments() },
        bookingStatus: { pending: pendingBookings, approved: approvedBookings, rejected: rejectedBookings },
        admins,
        recentAudit: auditEntries,
        settings: settings ? { siteName: settings.siteName, currency: settings.currency, timeZone: settings.timeZone } : null,
    });
};

export const listManagedAdmins = async (_req: any, res: any) => {
    const admins = await Admin.find({}, { passwordHash: 0 }).sort({ createdAt: -1 }).lean();
    return res.json(admins);
};

export const createManagedAdmin = async (req: any, res: any) => {
    const { email, password, name, role = 'admin' } = req.body || {};
    if (typeof email !== 'string' || typeof password !== 'string' || typeof name !== 'string' || !['admin', 'superadmin'].includes(role)) {
        throw new AppError('Name, email, password, and a valid role are required', 400);
    }
    if (password.length < 8) throw new AppError('Password must be at least 8 characters', 400);
    const normalizedEmail = email.toLowerCase().trim();
    if (await Admin.exists({ email: normalizedEmail })) throw new AppError('An administrator with this email already exists', 409);
    const admin = await Admin.create({ id: `admin-${Date.now()}`, email: normalizedEmail, name: name.trim(), role, passwordHash: await bcrypt.hash(password, 12) });
    return res.status(201).json({ id: admin.id, email: admin.email, name: admin.name, role: admin.role, createdAt: admin.createdAt });
};

export const updateManagedAdmin = async (req: any, res: any) => {
    const { name, email, password, role } = req.body || {};
    if (role !== undefined && !['admin', 'superadmin'].includes(role)) throw new AppError('Invalid administrator role', 400);
    if (req.params.id === req.user.id && role === 'admin') throw new AppError('You cannot remove your own super administrator role', 400);
    const update: Record<string, unknown> = {};
    if (typeof name === 'string' && name.trim()) update.name = name.trim();
    if (typeof email === 'string' && email.trim()) update.email = email.toLowerCase().trim();
    if (typeof password === 'string' && password.length > 0) {
        if (password.length < 8) throw new AppError('Password must be at least 8 characters', 400);
        update.passwordHash = await bcrypt.hash(password, 12);
    }
    if (role !== undefined) update.role = role;
    const admin = await Admin.findOneAndUpdate({ id: req.params.id }, update, { new: true, runValidators: true, projection: { passwordHash: 0 } }).lean();
    if (!admin) throw new AppError('Administrator not found', 404);
    return res.json(admin);
};

export const deleteManagedAdmin = async (req: any, res: any) => {
    if (req.params.id === req.user.id) throw new AppError('You cannot delete your own active account', 400);
    const target = await Admin.findOne({ id: req.params.id });
    if (!target) throw new AppError('Administrator not found', 404);
    if (target.role === 'superadmin' && await Admin.countDocuments({ role: 'superadmin' }) <= 1) throw new AppError('At least one super administrator must remain', 400);
    await Admin.deleteOne({ id: req.params.id });
    return res.json({ success: true });
};
