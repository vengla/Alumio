'use client';
import { useState } from 'react';
import { useAuth } from '../components/AuthProvider';
import { GraduationCap, Mail, Lock, ChevronLeft } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginPage() {
    const { login } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    // Check for expired session
    useState(() => {
        if (searchParams.get('expired')) {
            setError('Session expired. Please login again.');
        }
    }, [searchParams]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoggingIn(true);
        const result = await login(email, password);
        if (!result.success) {
            setError(result.message || 'Invalid credentials. Please try again.');
        }
        setIsLoggingIn(false);
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-subtle)' }}>
            <div className="card" style={{ width: '100%', maxWidth: '450px', padding: '2.5rem' }}>
                <button onClick={() => router.push('/')} className="flex items-center gap-2 text-muted mb-4" style={{ background: 'none', border: 'none' }}>
                    <ChevronLeft size={20} /> Back to Home
                </button>

                <div className="flex items-center gap-3 mb-8">
                    <GraduationCap size={40} color="var(--primary)" />
                    <div>
                        <h1 className="h2" style={{ margin: 0 }}>Welcome Back</h1>
                        <p className="text-muted text-sm">Login to your account</p>
                    </div>
                </div>

                {error && (
                    <div className="mb-4 p-3" style={{ background: '#ffebee', color: '#c62828', borderRadius: 'var(--radius)', fontSize: '0.875rem' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label className="text-sm" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
                            <Mail size={16} style={{ display: 'inline', marginRight: '0.25rem' }} /> Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@alumni.edu"
                            required
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '1px solid var(--border-light)',
                                borderRadius: 'var(--radius)',
                                fontFamily: 'inherit'
                            }}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="text-sm" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
                            <Lock size={16} style={{ display: 'inline', marginRight: '0.25rem' }} /> Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '1px solid var(--border-light)',
                                borderRadius: 'var(--radius)',
                                fontFamily: 'inherit'
                            }}
                        />
                    </div>

                    <div className="flex justify-between items-center mb-6">
                        <label className="flex items-center gap-2 text-sm">
                            <input type="checkbox" /> Remember me
                        </label>
                        <a href="#" className="text-sm text-primary">Forgot password?</a>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', marginBottom: '1rem' }}
                        disabled={isLoggingIn}
                    >
                        {isLoggingIn ? 'Logging in...' : 'Login'}
                    </button>

                    <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                        <span className="text-sm text-muted">Don't have an account? </span>
                        <a href="/register" className="text-sm text-primary" style={{ fontWeight: 600 }}>Register here</a>
                    </div>
                </form>

                <div className="mt-6 p-3" style={{ background: 'var(--bg-subtle)', borderRadius: 'var(--radius)' }}>
                    <p className="text-sm text-muted" style={{ margin: 0 }}>
                        💡 <strong>Hint:</strong> Use <code>admin@alumni.edu</code> / <code>admin123</code> to login.
                    </p>
                </div>
            </div>
        </div>
    );
}
