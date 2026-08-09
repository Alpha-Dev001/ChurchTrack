import React from 'react';
import { AlertCircle, ArrowRight, Lock, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import type { ViewName, ViewParams } from '../types';
import { adminLoginSchema, AdminLoginFormData } from '../lib/schemas';
import SalleHubLogo from '../components/SalleHubLogo';
import heroChurchBuildingImg from '../assets/images/parish_hero_building_1784664516350.jpg';

interface AdminLoginProps {
    lang?: string;
    onNavigate: (view: ViewName, params?: ViewParams) => void;
}

const tAdminLogin: Record<string, any> = {
    EN: {
        portal: 'Administration',
        title: 'ChurchTrack',
        headline: 'Coordinator access',
        subtitle: 'Sign in to manage parish halls, schedules, and reservations.',
        email: 'Email',
        password: 'Password',
        placeholderEmail: 'coordinator@parish.org',
        placeholderPassword: 'Enter your password',
        submit: 'Sign in',
        loading: 'Signing in…',
        secure: 'Secure staff access only',
        back: 'Back to site',
        formHint: 'Enter your credentials to continue.',
        signIn: 'Sign in',
    },
    FR: {
        portal: 'Administration',
        title: 'ChurchTrack',
        headline: 'Accès coordinateur',
        subtitle: 'Connectez-vous pour gérer les salles, horaires et réservations.',
        email: 'E-mail',
        password: 'Mot de passe',
        placeholderEmail: 'coordinateur@paroisse.org',
        placeholderPassword: 'Saisir le mot de passe',
        submit: 'Se connecter',
        loading: 'Connexion…',
        secure: 'Accès réservé au personnel',
        back: 'Retour au site',
        formHint: 'Saisissez vos identifiants pour continuer.',
        signIn: 'Connexion',
    },
    RW: {
        portal: 'Ubuyobozi',
        title: 'ChurchTrack',
        headline: "Kwinjira nk'umuhuzabikorwa",
        subtitle: "Yinjira urebe amasalle, gahunda n'ubusabe bwa paruwasi.",
        email: 'Imeri',
        password: "Ijambo ry'ibanga",
        placeholderEmail: 'umuhuzabikorwa@paruwasi.org',
        placeholderPassword: "Andika ijambo ry'ibanga",
        submit: 'Injira',
        loading: 'Kwinjira...',
        secure: 'Bihari gusa ku bakozi',
        back: 'Subira ku rubuga',
        formHint: "Andika imeri n'ijambo ry'ibanga.",
        signIn: 'Injira',
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
        const user = await login(data.email, data.password);
        if (user) {
            toast.success('Signed in successfully!');
            onNavigate(user.role === 'superadmin' ? 'superadmin-dashboard' : 'admin-dashboard');
        } else {
            toast.error('Authentication failed. Invalid email or password.');
        }
    };

    return (
        <div
            className="font-sans text-navy-900 min-h-[calc(100vh-61px)] md:min-h-[calc(100vh-65px)] flex flex-col lg:flex-row"
            id="admin-login-view"
        >
            {/* Brand panel */}
            <section className="relative lg:w-[48%] min-h-[38vh] lg:min-h-0 overflow-hidden bg-navy-950 text-white flex flex-col justify-end lg:justify-center px-6 py-10 md:px-12 lg:px-14">
                <div className="absolute inset-0">
                    <img
                        src={heroChurchBuildingImg}
                        alt=""
                        className="w-full h-full object-cover opacity-40 select-none pointer-events-none"
                        referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/80 to-navy-950/55" />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.08),transparent_55%)]" />
                </div>

                <motion.div
                    className="relative z-10 max-w-md space-y-5"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, ease: 'easeOut' }}
                >
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/15 bg-white/10 backdrop-blur-sm">
                            <SalleHubLogo size={22} className="text-white" />
                        </div>
                        <span className="section-eyebrow !text-white/55">{t.portal}</span>
                    </div>

                    <div className="space-y-3">
                        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl tracking-tight leading-none text-white">
                            {t.title}
                        </h1>
                        <p className="font-serif text-lg md:text-xl text-white/80 italic font-light">
                            {t.headline}
                        </p>
                        <p className="text-sm md:text-base text-white/60 font-light leading-relaxed max-w-sm">
                            {t.subtitle}
                        </p>
                    </div>

                    <div className="hidden lg:flex items-center gap-2 pt-2 text-[11px] uppercase tracking-[0.16em] text-white/40 font-semibold">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        {t.secure}
                    </div>
                </motion.div>
            </section>

            {/* Form panel */}
            <section className="relative flex-1 flex items-center justify-center px-5 py-12 md:px-10 lg:px-16 bg-navy-50">
                <div
                    className="pointer-events-none absolute inset-0 opacity-[0.45]"
                    style={{
                        backgroundImage:
                            'radial-gradient(circle at 1px 1px, rgba(11,31,51,0.06) 1px, transparent 0)',
                        backgroundSize: '22px 22px',
                    }}
                />

                <motion.div
                    className="relative z-10 w-full max-w-[400px] space-y-8"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.08, ease: 'easeOut' }}
                >
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-navy-500">
                            <Lock className="w-3.5 h-3.5" />
                            <span className="section-eyebrow">{t.portal}</span>
                        </div>
                        <h2 className="font-serif text-2xl md:text-3xl text-navy-950 tracking-tight">
                            {t.signIn}
                        </h2>
                        <p className="text-sm text-navy-500 font-light leading-relaxed">
                            {t.formHint}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                        {(loginError || errors.email || errors.password) && (
                            <div
                                className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-xs text-red-700 space-y-1"
                                id="login-error-alert"
                                role="alert"
                            >
                                {loginError && <p className="font-medium">{loginError}</p>}
                                {errors.email && (
                                    <p className="flex items-center gap-1.5">
                                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                        {errors.email.message}
                                    </p>
                                )}
                                {errors.password && (
                                    <p className="flex items-center gap-1.5">
                                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                        {errors.password.message}
                                    </p>
                                )}
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label htmlFor="login-input-email" className="section-eyebrow !text-navy-600">
                                {t.email}
                            </label>
                            <input
                                id="login-input-email"
                                type="email"
                                autoComplete="email"
                                placeholder={t.placeholderEmail}
                                {...register('email')}
                                className={`input-field ${errors.email
                                    ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
                                    : ''
                                    }`}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="login-input-password" className="section-eyebrow !text-navy-600">
                                {t.password}
                            </label>
                            <input
                                id="login-input-password"
                                type="password"
                                autoComplete="current-password"
                                placeholder={t.placeholderPassword}
                                {...register('password')}
                                className={`input-field ${errors.password
                                    ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
                                    : ''
                                    }`}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loginLoading}
                            className="btn-primary w-full !py-3.5 disabled:opacity-50"
                            id="login-submit-btn"
                        >
                            <span>{loginLoading ? t.loading : t.submit}</span>
                            {!loginLoading && <ArrowRight className="w-4 h-4" />}
                        </button>
                    </form>

                    <div className="flex items-center justify-between gap-4 pt-1 border-t border-navy-200/80">
                        <p className="flex items-center gap-1.5 text-[11px] text-navy-400 font-medium">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            {t.secure}
                        </p>
                        <button
                            type="button"
                            onClick={() => onNavigate('visitor-home')}
                            className="text-[11px] font-semibold uppercase tracking-[0.14em] text-navy-600 hover:text-navy-950 transition"
                        >
                            {t.back}
                        </button>
                    </div>
                </motion.div>
            </section>
        </div>
    );
}
