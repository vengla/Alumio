'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { GraduationCap, Award, ChevronLeft, Mail, Lock, Phone, User, Zap, ChevronRight, Shield } from 'lucide-react';
import { api } from '../lib/api';

function ParticlesBg() {
    const ref = useRef(null);
    useEffect(() => {
        const c = ref.current; if (!c) return;
        const colors = ['#7c3aed', '#a855f7', '#00d4ff', '#22d3ee', '#b57bee'];
        for (let i = 0; i < 20; i++) {
            const p = document.createElement('div');
            const sz = Math.random() * 3 + 1;
            p.style.cssText = `position:absolute;width:${sz}px;height:${sz}px;background:${colors[Math.floor(Math.random() * colors.length)]};border-radius:50%;left:${Math.random() * 100}%;bottom:-10px;animation:float-up ${Math.random() * 14 + 8}s ${Math.random() * 10}s linear infinite;opacity:0.5;box-shadow:0 0 ${sz * 3}px currentColor;`;
            c.appendChild(p);
        }
        return () => { while (c.firstChild) c.removeChild(c.firstChild); };
    }, []);
    return <div ref={ref} className="particles-container" />;
}

const DEPARTMENTS = [
    'Agricultural Engineering', 'Artificial Intelligence and Data Science', 'Civil Engineering',
    'Computer Science', 'Cyber Security', 'Electrical Engineering',
    'Electronics & Communication', 'Information Technology', 'Mechanical Engineering', 'Medical Electronics',
];

export default function RegisterPage() {
    const router = useRouter();
    const [role, setRole] = useState('alumni');
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '', mobile: '',
        enrollmentNumber: '', graduationYear: '', department: '',
        password: '', batch: '2018-2022', degree: 'B.Tech',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); setLoading(true);
        try {
            await api.post('/auth/register', { ...formData, role });
            alert('Registration submitted! Please wait for admin approval.');
            router.push('/login');
        } catch (err) {
            setError(err.message || 'Registration failed. Please try again.');
        } finally { setLoading(false); }
    };

    const Field = ({ label, icon: Icon, ...props }) => (
        <div style={{ marginBottom: '1.1rem' }}>
            <label>
                {Icon && <Icon size={13} style={{ display: 'inline', marginRight: '0.35rem', verticalAlign: 'middle' }} />}
                {label}
            </label>
            <input {...props} />
        </div>
    );

    return (
        <div style={{
            minHeight: '100vh', padding: '2rem 1rem',
            display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
            background: `
                radial-gradient(ellipse 70% 50% at 20% 30%, rgba(124,58,237,0.15) 0%, transparent 60%),
                radial-gradient(ellipse 60% 50% at 85% 70%, rgba(0,212,255,0.10) 0%, transparent 60%),
                var(--black-deep)
            `,
            position: 'relative', overflow: 'hidden',
        }}>
            <ParticlesBg />
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(139,92,246,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(139,92,246,0.05) 1px,transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none' }} />

            <div style={{ width: '100%', maxWidth: '660px', position: 'relative', zIndex: 1, animation: 'fade-in-up 0.6s ease forwards' }}>
                <button onClick={() => router.push('/')} className="flex items-center gap-2" style={{ background: 'none', border: 'none', color: 'var(--silver)', marginBottom: '1.5rem', fontSize: '0.875rem', opacity: 0.75 }}>
                    <ChevronLeft size={18} /> Back to Home
                </button>

                <div className="card" style={{ padding: '2.5rem', position: 'relative' }}>
                    <div className="corner-accent tl" /><div className="corner-accent tr" />
                    <div className="corner-accent bl" /><div className="corner-accent br" />

                    {/* Header */}
                    <div className="flex items-center gap-3" style={{ marginBottom: '1.75rem' }}>
                        <div style={{ width: 48, height: 48, borderRadius: '12px', background: 'linear-gradient(135deg,#7c3aed,#00d4ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(124,58,237,0.5)' }}>
                            <GraduationCap size={26} color="#fff" />
                        </div>
                        <div>
                            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', margin: 0 }}>Create Account</h1>
                            <p style={{ fontSize: '0.8rem', color: 'var(--silver)', margin: 0, opacity: 0.75 }}>Join the ALUMIO network</p>
                        </div>
                    </div>
                    <div className="neon-divider" style={{ margin: '0 0 1.5rem' }} />

                    {error && (
                        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius)', padding: '0.75rem 1rem', marginBottom: '1.25rem', color: '#fca5a5', fontSize: '0.85rem' }}>
                            ⚠ {error}
                        </div>
                    )}

                    {/* Role selection */}
                    <div style={{ marginBottom: '1.75rem' }}>
                        <label style={{ marginBottom: '0.75rem' }}>I am registering as:</label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            {[
                                { value: 'alumni', label: 'Alumni', icon: Award, sub: 'Graduated from SRMVEC' },
                                { value: 'student', label: 'Current Student', icon: GraduationCap, sub: 'Currently enrolled' },
                            ].map(r => (
                                <button
                                    key={r.value}
                                    type="button"
                                    onClick={() => setRole(r.value)}
                                    style={{
                                        padding: '1.1rem', borderRadius: 'var(--radius-lg)', cursor: 'pointer', textAlign: 'center',
                                        background: role === r.value ? 'rgba(124,58,237,0.2)' : 'rgba(20,20,48,0.6)',
                                        border: role === r.value ? '1px solid rgba(139,92,246,0.6)' : '1px solid rgba(139,92,246,0.15)',
                                        boxShadow: role === r.value ? '0 0 20px rgba(124,58,237,0.25)' : 'none',
                                        transition: 'all 0.25s',
                                    }}
                                >
                                    <r.icon size={28} color={role === r.value ? 'var(--lavender-soft)' : 'var(--silver)'} style={{ marginBottom: '0.5rem' }} />
                                    <div style={{ fontWeight: 700, color: role === r.value ? '#fff' : 'var(--silver)', fontSize: '0.95rem' }}>{r.label}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--silver)', opacity: 0.7, marginTop: '0.2rem' }}>{r.sub}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* Name row */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.1rem' }}>
                            <Field label="First Name" icon={User} name="firstName" type="text" required placeholder="John" value={formData.firstName} onChange={handleChange} style={{ marginBottom: 0 }} />
                            <Field label="Last Name" icon={User} name="lastName" type="text" required placeholder="Doe" value={formData.lastName} onChange={handleChange} style={{ marginBottom: 0 }} />
                        </div>

                        <Field label="Email Address" icon={Mail} name="email" type="email" required placeholder="your.email@example.com" value={formData.email} onChange={handleChange} />
                        <Field label="Mobile Number" icon={Phone} name="mobile" type="tel" required placeholder="9876543210" value={formData.mobile} onChange={handleChange} />

                        {/* Enrollment + Year */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.1rem' }}>
                            <Field label="Enrollment Number" name="enrollmentNumber" type="text" required placeholder="2018CS123" value={formData.enrollmentNumber} onChange={handleChange} style={{ marginBottom: 0 }} />
                            <Field label="Graduation Year" name="graduationYear" type="number" required placeholder="2022" value={formData.graduationYear} onChange={handleChange} style={{ marginBottom: 0 }} />
                        </div>

                        {/* Department */}
                        <div style={{ marginBottom: '1.1rem' }}>
                            <label>Department / Branch</label>
                            <select name="department" required value={formData.department} onChange={handleChange}>
                                <option value="">Select Department</option>
                                {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                            </select>
                        </div>

                        <Field label="Password" icon={Lock} name="password" type="password" required placeholder="Min. 6 characters" value={formData.password} onChange={handleChange} />

                        {/* Terms */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label className="flex items-center gap-2" style={{ cursor: 'pointer', fontSize: '0.85rem', color: 'var(--silver)' }}>
                                <input type="checkbox" required style={{ width: 'auto', padding: 0, accentColor: 'var(--violet)' }} />
                                I agree to the{' '}
                                <a href="#" style={{ color: 'var(--lavender-soft)', fontWeight: 600 }}>Terms & Conditions</a>
                                {' '}and{' '}
                                <a href="#" style={{ color: 'var(--lavender-soft)', fontWeight: 600 }}>Privacy Policy</a>
                            </label>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ width: '100%', padding: '0.9rem', fontSize: '1rem', marginBottom: '1rem' }}
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'spin-slow 0.8s linear infinite', display: 'inline-block' }} />
                                    Creating Account...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <Zap size={16} /> Register Now <ChevronRight size={16} />
                                </span>
                            )}
                        </button>

                        <div className="neon-divider" />
                        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                            <span style={{ fontSize: '0.875rem', color: 'var(--silver)', opacity: 0.75 }}>Already have an account?{' '}</span>
                            <a href="/login" style={{ fontSize: '0.875rem', color: 'var(--lavender-soft)', fontWeight: 700 }}>Login here</a>
                        </div>
                    </form>
                </div>

                {/* Verification notice */}
                <div style={{ marginTop: '1rem', padding: '0.85rem 1.25rem', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 'var(--radius)', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <Shield size={16} color="#f59e0b" style={{ flexShrink: 0, marginTop: '0.1rem' }} />
                    <p style={{ fontSize: '0.8rem', color: 'var(--silver)', margin: 0, lineHeight: 1.6 }}>
                        <strong style={{ color: '#f59e0b' }}>Alumni Verification:</strong>{' '}
                        Your account will be reviewed by our admin team within 24–48 hours.
                    </p>
                </div>
            </div>
        </div>
    );
}
