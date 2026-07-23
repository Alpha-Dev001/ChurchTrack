import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { Admin, Hall, Booking, Payment } from '../models';
import { seedDatabase } from '../services/database.service';
import { AppError } from '../middlewares/error.middleware';

export const handleLogin = async (req: any, res: any) => {
    const { email, password } = req.body;

    if (!email || !password) {
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
