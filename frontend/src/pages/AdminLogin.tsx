import React from 'react';
import { AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import type { ViewName, ViewParams } from '../types';
import { adminLoginSchema, AdminLoginFormData } from '../lib/schemas';
import SalleHubLogo from '../components/SalleHubLogo';

interface AdminLoginProps {
    lang?: string;
    onNavigate: (view: ViewName, params?: ViewParams) => void;
}

const tAdminLogin: Record<string, any> = {
    EN: {
        title: 'SalleHub Coordinator',
        subtitle: 'Sign in to coordinate parish schedules & reservations',
        email: 'Email Address',
        password: 'Password',
        placeholderPassword: 'Enter password',
        submit: 'Sign In to Dashboard',
        loading: 'Authenticating session...',
    },
    FR: {
        title: 'Coordinateur SalleHub',
        subtitle: 'Connectez-vous pour coordonner les horaires et réservations',
        email: 'Adresse e-mail',
        password: 'Mot de passe',
        placeholderPassword: 'Saisir le mot de passe',
        submit: 'Se connecter au tableau de bord',
        loading: 'Authentification de la session...',
    },
    RW: {
        title: 'Umuhuzabikorwa wa SalleHub',
        subtitle: 'Yinjire hano ngo ugenzure gahunda n\'ubusabe bwa paruwasi',
        email: 'Imeri (Email Address)',
        password: 'Ijambo ry\'Ibanga',
        placeholderPassword: 'Andika ijambo ry\'ibanga',
        submit: 'Yinjire kuri Dashboard',
        loading: 'Gushaka session...',
    },
};

export default function AdminLogin({ lang = 'EN', onNavigate }: AdminLoginProps) {
    const { login, loginLoading, loginError } = useAuth();
    const t = tAdminLogin[lang] || tAdminLogin['EN'];

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<AdminLoginFormData>({
        resolver: zodResolver(adminLoginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async (data: AdminLoginFormData) => {
        const success = await login(data.email, data.password);
        if (success) {
            toast.success('Signed in successfully!');
            onNavigate('admin-dashboard');
        } else {
            toast.error('Authentication failed. Invalid email or password.');
        }
    };

    return (
        <div className="font-sans text-navy-800 text-left" id="admin-login-view">
            {/* Top Intro Banner Bar */}
            <section className="relative bg-navy-950 text-white py-12 px-4 overflow-hidden border-b border-navy-900">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80"
                        alt="header"
                        className="w-full h-full object-cover opacity-20 blur-[1px]"
                    />
                    <div className="absolute inset-0 bg-navy-950/80" />
                </div>
                <div className="relative z-10 max-w-5xl mx-auto text-left space-y-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-navy-400 font-sans">
                        {lang === 'FR' ? "PORTAIL D'ADMINISTRATION" : lang === 'RW' ? 'URUBUGA RWA MUDUGUDU' : 'ADMINISTRATION PORTAL'}
                    </span>
                    <h1 className="text-3xl md:text-5xl font-serif font-normal tracking-tight">{t.title}</h1>
                    <p className="text-navy-300 text-xs md:text-base max-w-xl font-sans font-light">
                        {t.subtitle}
                    </p>
                </div>
            </section>

            {/* Form Container */}
            <div className="py-16 px-4 max-w-md mx-auto space-y-6">
                <div className="text-center space-y-2">
                    <div className="p-3 bg-navy-900 text-white rounded-lg shadow-sm inline-block">
                        <SalleHubLogo size={24} className="text-white" />
                    </div>
                    <h2 className="text-lg font-black text-navy-950 font-serif">SalleHub Church Control</h2>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg border border-navy-200/80 p-6 space-y-4 shadow-sm">
                    {(loginError || errors.email || errors.password) && (
                        <div className="text-red-500 text-[11px] font-bold text-center bg-red-50 p-2.5 border border-red-100 rounded-lg space-y-1" id="login-error-alert">
                            {loginError && <p>{loginError}</p>}
                            {errors.email && <p className="flex items-center justify-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.email.message}</p>}
                            {errors.password && <p className="flex items-center justify-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.password.message}</p>}
                        </div>
                    )}

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase text-navy-400 tracking-wider">{t.email}</label>
                        <input
                            type="email"
                            placeholder="e.g. yours@gmail.com"
                            {...register('email')}
                            className={`w-full px-3 py-2 bg-navy-50 border rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 transition ${errors.email ? 'border-red-400 focus:ring-red-500/20' : 'border-navy-200 focus:ring-navy-900'
                                }`}
                            id="login-input-email"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase text-navy-400 tracking-wider">{t.password}</label>
                        <input
                            type="password"
                            placeholder={t.placeholderPassword}
                            {...register('password')}
                            className={`w-full px-3 py-2 bg-navy-50 border rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 transition ${errors.password ? 'border-red-400 focus:ring-red-500/20' : 'border-navy-200 focus:ring-navy-900'
                                }`}
                            id="login-input-password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loginLoading}
                        className="w-full bg-navy-950 hover:bg-navy-800 text-white text-xs font-bold uppercase tracking-wider py-3.5 rounded-lg shadow-sm transition disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
                        id="login-submit-btn"
                    >
                        {loginLoading ? t.loading : t.submit}
                    </button>
                </form>
            </div>
        </div>
    );
}