'use client';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../components/AuthProvider';
import { GraduationCap, Mail, Lock, ChevronLeft, Eye, EyeOff, Zap } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

function ParticlesBg() {
    const ref = useRef(null);
    useEffect(() => {
        const c = ref.current;
        if (!c) return;
        const colors = ['#7c3aed', '#a855f7', '#00d4ff', '#22d3ee', '#b57bee'];
        for (let i = 0; i < 25; i++) {
            const p = document.createElement('div');
            const sz = Math.random() * 3 + 1;
            p.style.cssText = `position:absolute;width:${sz}px;height:${sz}px;background:${colors[Math.floor(Math.random() * colors.length)]};border-radius:50%;left:${Math.random() * 100}%;bottom:-10px;animation:float-up ${Math.random() * 12 + 8}s ${Math.random() * 8}s linear infinite;box-shadow:0 0 ${sz * 4}px currentColor;opacity:0.6;`;
            c.appendChild(p);
        }
        return () => { while (c.firstChild) c.removeChild(c.firstChild); };
    }, []);
    return <div ref={ref} className="particles-container" />;
}

export default function LoginPage() {
    const { login } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    useState(() => {
        if (searchParams.get('expired')) setError('Session expired. Please login again.');
    }, [searchParams]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoggingIn(true);
        const result = await login(email, password);
        if (!result.success) setError(result.message || 'Invalid credentials. Please try again.');
        setIsLoggingIn(false);
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem 1rem',
            background: `
                radial-gradient(ellipse 80% 60% at 30% 20%, rgba(124,58,237,0.18) 0%, transparent 60%),
                radial-gradient(ellipse 60% 60% at 80% 80%, rgba(0,212,255,0.12) 0%, transparent 60%),
                var(--black-deep)
            `,
            position: 'relative',
            overflow: 'hidden',
        }}>
            <ParticlesBg />

            {/* Background grid */}
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(139,92,246,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(139,92,246,0.05) 1px,transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none' }} />

            {/* Glowing orbs */}
            <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle,rgba(124,58,237,0.12) 0%,transparent 70%)', top: '10%', left: '-5%', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', width: 250, height: 250, borderRadius: '50%', background: 'radial-gradient(circle,rgba(0,212,255,0.1) 0%,transparent 70%)', bottom: '10%', right: '-5%', pointerEvents: 'none' }} />

            <div style={{ width: '100%', maxWidth: '440px', position: 'relative', zIndex: 1, animation: 'fade-in-up 0.6s ease forwards' }}>

                {/* Back button */}
                <button
                    onClick={() => router.push('/')}
                    className="flex items-center gap-2"
                    style={{ background: 'none', border: 'none', color: 'var(--silver)', marginBottom: '1.5rem', fontSize: '0.875rem', opacity: 0.75, transition: 'opacity 0.2s' }}
                    onMouseEnter={e => e.target.style.opacity = 1}
                    onMouseLeave={e => e.target.style.opacity = 0.75}
                >
                    <ChevronLeft size={18} /> Back to Home
                </button>

                {/* Card */}
                <div className="card" style={{ padding: '2.5rem', position: 'relative' }}>
                    <div className="corner-accent tl" />
                    <div className="corner-accent tr" />
                    <div className="corner-accent bl" />
                    <div className="corner-accent br" />

                    {/* Header */}
                    <div className="flex items-center gap-3" style={{ marginBottom: '2rem' }}>
                        <div style={{ width: 48, height: 48, borderRadius: '12px', background: 'linear-gradient(135deg,#7c3aed,#00d4ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(124,58,237,0.5)' }}>
                            <GraduationCap size={26} color="#fff" />
                        </div>
                        <div>
                            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', margin: 0 }}>Welcome Back</h1>
                            <p style={{ fontSize: '0.8rem', color: 'var(--silver)', margin: 0, opacity: 0.75 }}>Sign in to your alumni account</p>
                        </div>
                    </div>

                    {/* Neon divider */}
                    <div className="neon-divider" style={{ margin: '0 0 1.5rem' }} />

                    {/* Error */}
                    {error && (
                        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius)', padding: '0.75rem 1rem', marginBottom: '1.25rem', color: '#fca5a5', fontSize: '0.85rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            ⚠ {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin}>
                        {/* Email */}
                        <div style={{ marginBottom: '1.25rem' }}>
                            <label>
                                <Mail size={14} style={{ display: 'inline', marginRight: '0.4rem', verticalAlign: 'middle' }} />
                                Email Address
                            </label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type="email"
                                    id="login-email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="admin@alumni.edu"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label>
                                <Lock size={14} style={{ display: 'inline', marginRight: '0.4rem', verticalAlign: 'middle' }} />
                                Password
                            </label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showPass ? 'text' : 'password'}
                                    id="login-password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    style={{ paddingRight: '3rem' }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass(!showPass)}
                                    style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--silver)', padding: '0.25rem' }}
                                >
                                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Remember / forgot */}
                        <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
                            <label className="flex items-center gap-2" style={{ fontSize: '0.85rem', color: 'var(--silver)', cursor: 'pointer' }}>
                                <input type="checkbox" id="remember-me" style={{ width: 'auto', padding: 0, accentColor: 'var(--violet)' }} /> Remember me
                            </label>
                            <a href="#" style={{ fontSize: '0.85rem', color: 'var(--lavender-soft)', fontWeight: 600 }}>Forgot password?</a>
                        </div>

                        <button
                            id="login-submit"
                            type="submit"
                            className="btn btn-primary"
                            style={{ width: '100%', padding: '0.9rem', fontSize: '1rem', marginBottom: '1rem' }}
                            disabled={isLoggingIn}
                        >
                            {isLoggingIn ? (
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin-slow 0.8s linear infinite', display: 'inline-block' }} />
                                    Authenticating...
                                </span>
                            ) : (
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Zap size={16} /> Sign In
                                </span>
                            )}
                        </button>

                        <div className="neon-divider" />

                        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                            <span style={{ fontSize: '0.875rem', color: 'var(--silver)', opacity: 0.75 }}>Don&apos;t have an account? </span>
                            <a href="/register" style={{ fontSize: '0.875rem', color: 'var(--lavender-soft)', fontWeight: 700 }}>Register here</a>
                        </div>
                    </form>
                </div>

                {/* Demo hint */}
                <div style={{ marginTop: '1rem', padding: '0.85rem 1.25rem', background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 'var(--radius)', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <Zap size={16} color="var(--neon-cyan)" style={{ flexShrink: 0, marginTop: '0.1rem' }} />
                    <p style={{ fontSize: '0.8rem', color: 'var(--silver)', margin: 0, lineHeight: 1.6 }}>
                        <strong style={{ color: 'var(--lavender-soft)' }}>Demo Access:</strong>{' '}
                        Use <code style={{ color: 'var(--neon-cyan)', background: 'rgba(0,212,255,0.08)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>admin@alumni.edu</code>{' '}
                        / <code style={{ color: 'var(--neon-cyan)', background: 'rgba(0,212,255,0.08)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>admin123</code>
                    </p>
                </div>
            </div>
        </div>
    );
}
