'use client';
import { useRouter } from 'next/navigation';
import { Users, GraduationCap, Briefcase, Heart, Award, Calendar, ChevronRight, Zap, Shield, Globe } from 'lucide-react';
import { useEffect, useRef } from 'react';

function ParticlesBackground() {
    const containerRef = useRef(null);
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;
        const colors = ['#7c3aed', '#a855f7', '#00d4ff', '#22d3ee', '#b57bee', '#8b5cf6'];
        const count = 35;
        for (let i = 0; i < count; i++) {
            const p = document.createElement('div');
            const size = Math.random() * 4 + 1;
            const color = colors[Math.floor(Math.random() * colors.length)];
            const left = Math.random() * 100;
            const duration = Math.random() * 18 + 8;
            const delay = Math.random() * 15;
            p.style.cssText = `
                position:absolute; width:${size}px; height:${size}px;
                background:${color}; border-radius:50%;
                left:${left}%; bottom:-10px;
                animation:float-up ${duration}s ${delay}s linear infinite;
                box-shadow:0 0 ${size * 3}px ${color};
                opacity:0.7;
            `;
            container.appendChild(p);
        }
        return () => { while (container.firstChild) container.removeChild(container.firstChild); };
    }, []);
    return <div ref={containerRef} className="particles-container" />;
}

function HexagonDecor({ style }) {
    return (
        <svg style={{ position: 'absolute', opacity: 0.07, pointerEvents: 'none', ...style }} viewBox="0 0 200 200" fill="none">
            <polygon points="100,10 185,55 185,145 100,190 15,145 15,55" stroke="url(#hg)" strokeWidth="1" fill="none" />
            <polygon points="100,35 160,70 160,135 100,165 40,135 40,70" stroke="url(#hg)" strokeWidth="0.6" fill="none" />
            <defs>
                <linearGradient id="hg" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#00d4ff" />
                </linearGradient>
            </defs>
        </svg>
    );
}

export default function HomePage() {
    const router = useRouter();

    const features = [
        { icon: Users, title: 'Alumni Directory', desc: 'Connect with 12,000+ alumni worldwide across all batches and departments' },
        { icon: GraduationCap, title: 'Mentorship Hub', desc: 'Learn from experienced alumni who guide your career journey' },
        { icon: Briefcase, title: 'Job Portal', desc: 'Exclusive opportunities, referrals and internships from alumni companies' },
        { icon: Heart, title: 'Donate & Support', desc: 'Give back to your alma mater and fund student scholarships' },
        { icon: Award, title: 'Success Stories', desc: 'Celebrate and share remarkable alumni achievements' },
        { icon: Calendar, title: 'Events & Reunions', desc: 'Stay connected — attend meetups, seminars, and batch reunions' },
    ];

    const stats = [
        { label: 'Active Alumni', value: '12,000+', color: 'var(--neon-cyan)' },
        { label: 'Job Placements', value: '850+', color: 'var(--lavender-soft)' },
        { label: 'Sessions Held', value: '3,200+', color: 'var(--neon-cyan)' },
        { label: 'Funds Raised', value: '₹2.5Cr', color: 'var(--lavender-soft)' },
    ];

    return (
        <div style={{ position: 'relative', zIndex: 1 }}>
            {/* Scan line overlay */}
            <div className="scan-overlay" />

            {/* ── NAVBAR ── */}
            <header className="glass" style={{ position: 'sticky', top: 0, zIndex: 100 }}>
                <nav className="container flex items-center justify-between" style={{ padding: '1rem 1.5rem' }}>
                    <div className="flex items-center gap-3">
                        <div style={{
                            width: 40, height: 40, borderRadius: '10px',
                            background: 'linear-gradient(135deg, #7c3aed, #00d4ff)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 0 16px rgba(124,58,237,0.5)',
                        }}>
                            <GraduationCap size={22} color="#fff" />
                        </div>
                        <div>
                            <span style={{ fontWeight: 800, fontSize: '1.25rem', letterSpacing: '0.05em', color: '#fff' }}>ALUMIO</span>
                            <div style={{ fontSize: '0.6rem', color: 'var(--silver)', letterSpacing: '0.15em', marginTop: '-2px' }}>SRM VALLIAMMAI</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 hide-mobile">
                        {['About', 'Directory', 'Jobs', 'Events'].map(l => (
                            <a key={l} href={`/${l.toLowerCase()}`} className="nav-link">{l}</a>
                        ))}
                    </div>

                    <div className="flex gap-3">
                        <button onClick={() => router.push('/login')} className="btn btn-outline" style={{ padding: '0.55rem 1.2rem' }}>Login</button>
                        <button onClick={() => router.push('/register')} className="btn btn-primary" style={{ padding: '0.55rem 1.2rem' }}>
                            Register <ChevronRight size={16} />
                        </button>
                    </div>
                </nav>
            </header>

            {/* ── HERO ── */}
            <section className="hero-bg" style={{ padding: '7rem 0 6rem', minHeight: '85vh', display: 'flex', alignItems: 'center' }}>
                <ParticlesBackground />
                {/* Decorative hexagons */}
                <HexagonDecor style={{ width: 320, height: 320, top: '-60px', left: '-80px' }} />
                <HexagonDecor style={{ width: 260, height: 260, bottom: '-40px', right: '-60px' }} />
                {/* Circuit lines */}
                <div style={{ position: 'absolute', top: '30%', left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg,transparent,rgba(0,212,255,0.15),transparent)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', top: '70%', left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg,transparent,rgba(139,92,246,0.12),transparent)', pointerEvents: 'none' }} />

                <div className="container" style={{ textAlign: 'center', position: 'relative' }}>
                    {/* Badge */}
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 1.2rem', borderRadius: '999px', background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(139,92,246,0.3)', marginBottom: '2rem', animation: 'fade-in-up 0.6s ease forwards' }}>
                        <Zap size={14} color="var(--neon-cyan)" />
                        <span style={{ fontSize: '0.8rem', color: 'var(--lavender-soft)', fontWeight: 600, letterSpacing: '0.08em' }}>OFFICIAL ALUMNI PLATFORM · EST. 2024</span>
                    </div>

                    <h1 className="h1" style={{ marginBottom: '1.5rem', animation: 'fade-in-up 0.7s 0.1s ease both' }}>
                        Empowering Connections,<br />Building Futures
                    </h1>

                    <p style={{ maxWidth: '680px', margin: '0 auto 2.5rem', fontSize: '1.1rem', color: 'var(--silver)', lineHeight: 1.7, animation: 'fade-in-up 0.7s 0.2s ease both' }}>
                        The official alumni association platform of <strong style={{ color: 'var(--lavender-soft)' }}>SRM Valliammai Engineering College</strong>.
                        Connect with peers, give back, and unlock career opportunities.
                    </p>

                    <div className="flex gap-4 justify-center" style={{ flexWrap: 'wrap', animation: 'fade-in-up 0.7s 0.3s ease both' }}>
                        <button onClick={() => router.push('/register')} className="btn btn-accent" style={{ fontSize: '1rem', padding: '0.9rem 2rem', fontWeight: 700 }}>
                            Join the Network <ChevronRight size={18} />
                        </button>
                        <button onClick={() => router.push('/directory')} className="btn btn-outline" style={{ fontSize: '1rem', padding: '0.9rem 2rem' }}>
                            <Globe size={16} /> Explore Directory
                        </button>
                    </div>

                    {/* Trust indicators */}
                    <div className="flex justify-center gap-8" style={{ marginTop: '4rem', flexWrap: 'wrap', animation: 'fade-in-up 0.7s 0.4s ease both' }}>
                        {[shield => <Shield size={14} color="var(--neon-cyan)" />, ''].map(() => null)}
                        {[
                            { icon: <Shield size={14} />, label: 'Secure & Verified' },
                            { icon: <Globe size={14} />, label: 'Global Alumni Network' },
                            { icon: <Zap size={14} />, label: 'AI-Powered Matching' },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-2" style={{ color: 'var(--silver)', fontSize: '0.85rem' }}>
                                <span style={{ color: 'var(--neon-cyan)' }}>{item.icon}</span>
                                {item.label}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── STATS ── */}
            <section style={{ padding: '4rem 0', background: 'var(--black-soft)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 100% at 50% 50%, rgba(124,58,237,0.06),transparent)', pointerEvents: 'none' }} />
                <div className="neon-divider" style={{ margin: '0 0 4rem' }} />
                <div className="container">
                    <div className="grid grid-cols-4 stagger">
                        {stats.map((stat, i) => (
                            <div key={i} className="card animate-fade-in" style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
                                <div className="corner-accent tl" /><div className="corner-accent br" />
                                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: stat.color, marginBottom: '0.5rem', textShadow: `0 0 20px ${stat.color}60` }}>
                                    {stat.value}
                                </div>
                                <div style={{ color: 'var(--silver)', fontSize: '0.9rem', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="neon-divider" style={{ margin: '4rem 0 0' }} />
            </section>

            {/* ── FEATURES ── */}
            <section className="section-glow" style={{ padding: '6rem 0' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <div style={{ display: 'inline-block', padding: '0.3rem 1rem', background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)', borderRadius: '999px', marginBottom: '1rem' }}>
                            <span style={{ fontSize: '0.75rem', color: 'var(--neon-cyan)', fontWeight: 700, letterSpacing: '0.1em' }}>PLATFORM FEATURES</span>
                        </div>
                        <h2 className="h2">Everything You Need to<br />
                            <span className="text-gradient">Stay Connected</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-3 stagger">
                        {features.map((feat, i) => (
                            <div
                                key={i}
                                className="card animate-fade-in"
                                style={{ textAlign: 'center', cursor: 'pointer', padding: '2rem 1.5rem' }}
                                onClick={() => router.push('/login')}
                            >
                                <div className="corner-accent tl" />
                                <div className="feature-icon">
                                    <feat.icon size={28} color="var(--lavender-soft)" />
                                </div>
                                <h3 className="h3" style={{ marginBottom: '0.6rem', fontSize: '1.1rem' }}>{feat.title}</h3>
                                <p style={{ color: 'var(--silver)', fontSize: '0.875rem', lineHeight: 1.65 }}>{feat.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section style={{
                padding: '6rem 0',
                background: 'linear-gradient(135deg, rgba(124,58,237,0.2) 0%, rgba(0,212,255,0.1) 100%)',
                position: 'relative',
                overflow: 'hidden',
            }}>
                <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(139,92,246,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(139,92,246,0.06) 1px,transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none' }} />
                <HexagonDecor style={{ width: 400, height: 400, top: '-100px', right: '-100px' }} />
                <div className="container" style={{ textAlign: 'center', position: 'relative' }}>
                    <h2 style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 800, color: '#fff', marginBottom: '1.25rem' }}>
                        Ready to <span className="text-gradient">Reconnect</span>?
                    </h2>
                    <p style={{ fontSize: '1.1rem', color: 'var(--silver)', marginBottom: '2.5rem', maxWidth: '500px', margin: '0 auto 2.5rem' }}>
                        Join thousands of alumni making a difference. Your network is waiting.
                    </p>
                    <div className="flex gap-4 justify-center" style={{ flexWrap: 'wrap' }}>
                        <button onClick={() => router.push('/register')} className="btn btn-primary animate-glow-pulse" style={{ fontSize: '1.05rem', padding: '1rem 2.5rem' }}>
                            Get Started Today <ChevronRight size={18} />
                        </button>
                        <button onClick={() => router.push('/login')} className="btn btn-ghost" style={{ fontSize: '1.05rem', padding: '1rem 2rem' }}>
                            Already a member?
                        </button>
                    </div>
                </div>
            </section>

            {/* ── FOOTER ── */}
            <footer style={{ background: 'var(--black-space)', borderTop: '1px solid rgba(139,92,246,0.15)', padding: '2rem 0' }}>
                <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                    <div className="flex items-center gap-2">
                        <div style={{ width: 28, height: 28, borderRadius: '6px', background: 'linear-gradient(135deg,#7c3aed,#00d4ff)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <GraduationCap size={16} color="#fff" />
                        </div>
                        <span style={{ fontWeight: 700, color: 'var(--silver)', fontSize: '0.9rem' }}>ALUMIO</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--silver)', opacity: 0.6, textAlign: 'center' }}>
                        © 2026 SRM Valliammai Engineering College Alumni Association. All rights reserved.
                    </div>
                    <div className="flex gap-4">
                        {['Privacy Policy', 'Terms'].map(l => (
                            <a key={l} href="#" style={{ fontSize: '0.8rem', color: 'var(--silver)', opacity: 0.6 }}>{l}</a>
                        ))}
                    </div>
                </div>
            </footer>
        </div>
    );
}
