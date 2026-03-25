'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '../components/AuthProvider';
import { useRouter } from 'next/navigation';
import { api } from '../lib/api';
import {
    Users, Briefcase, Heart, Award, Calendar, MessageSquare,
    TrendingUp, DollarSign, UserCheck, FileText, Settings, LogOut, Bell, Zap, ChevronRight
} from 'lucide-react';

export default function DashboardPage() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [totalDonations, setTotalDonations] = useState(0);
    const [unreadNotifications, setUnreadNotifications] = useState(0);
    const [upcomingEvents, setUpcomingEvents] = useState([]);

    useEffect(() => {
        if (!user) { router.push('/login'); return; }
        const donations = parseInt(localStorage.getItem('totalDonations') || '0');
        setTotalDonations(donations);
        const updateNotifications = () => {
            const all = JSON.parse(localStorage.getItem('app_notifications') || '[]');
            if (user) {
                const unread = all.filter(n => (n.userId === user._id || n.userId === user.id) && !n.isRead).length;
                setUnreadNotifications(unread);
            }
        };
        updateNotifications();
        const interval = setInterval(updateNotifications, 3000);
        return () => clearInterval(interval);
    }, [user, router]);

    useEffect(() => {
        if (!user) return;
        const fetchEvents = async () => {
            try {
                const res = await api.get('/events');
                let events = (res.data || []).filter(e => new Date(e.startDate) > new Date());
                if (user.role === 'student' && user.department) {
                    events.sort((a, b) => {
                        const ai = a.department === user.department, bi = b.department === user.department;
                        if (ai && !bi) return -1; if (!ai && bi) return 1;
                        return new Date(a.startDate) - new Date(b.startDate);
                    });
                } else events.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
                setUpcomingEvents(events.slice(0, 3));
                const notifiedEvents = JSON.parse(localStorage.getItem('notified_events') || '[]');
                const near = events.filter(e => { const d = (new Date(e.startDate) - new Date()) / (1000 * 60 * 60 * 24); return d >= 0 && d <= 7; });
                if (near.length > 0) {
                    const allNotifs = JSON.parse(localStorage.getItem('app_notifications') || '[]');
                    let changed = false;
                    near.forEach(event => {
                        if (!notifiedEvents.includes(event._id)) {
                            allNotifs.push({ id: Date.now().toString() + Math.random(), userId: user._id || user.id, type: 'event_reminder', title: `Upcoming Event: ${event.title}`, message: `${event.title} on ${new Date(event.startDate).toLocaleDateString()}`, isRead: false, createdAt: new Date().toISOString() });
                            notifiedEvents.push(event._id);
                            changed = true;
                        }
                    });
                    if (changed) {
                        localStorage.setItem('app_notifications', JSON.stringify(allNotifs));
                        localStorage.setItem('notified_events', JSON.stringify(notifiedEvents));
                        setUnreadNotifications(allNotifs.filter(n => (n.userId === user._id || n.userId === user.id) && !n.isRead).length);
                    }
                }
            } catch (err) { console.error(err); }
        };
        fetchEvents();
    }, [user]);

    if (!user) return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{ width: 48, height: 48, border: '3px solid rgba(139,92,246,0.3)', borderTop: '3px solid var(--violet)', borderRadius: '50%', animation: 'spin-slow 1s linear infinite', margin: '0 auto 1rem' }} />
                <p style={{ color: 'var(--silver)' }}>Loading...</p>
            </div>
        </div>
    );

    const roleMeta = {
        alumni: { label: 'Alumni Dashboard', sub: 'Your impact and engagement at a glance', color: 'var(--violet-glow)' },
        student: { label: 'Student Dashboard', sub: 'Connect with alumni, find mentors, explore opportunities', color: 'var(--neon-cyan)' },
        admin: { label: 'Admin Dashboard', sub: 'Manage the alumni platform and monitor activities', color: 'var(--lavender-soft)' },
    };
    const meta = roleMeta[user.role] || roleMeta.alumni;

    const roleCards = {
        alumni: [
            { title: 'My Network', value: '145', icon: Users, link: '/directory', color: 'var(--violet-glow)' },
            { title: 'Active Mentees', value: '3', icon: UserCheck, link: '/mentorship', color: 'var(--neon-cyan)' },
            { title: 'Job Posts', value: '2', icon: Briefcase, link: '/jobs', color: 'var(--lavender-soft)' },
            { title: 'Total Donations', value: '₹25,000', icon: Heart, link: '/donations', color: '#f87171' },
        ],
        student: [
            { title: 'Mentors', value: '2', icon: UserCheck, link: '/mentorship', color: 'var(--neon-cyan)' },
            { title: 'Job Applications', value: '5', icon: Briefcase, link: '/jobs', color: 'var(--violet-glow)' },
            { title: 'Events Registered', value: '3', icon: Calendar, link: '/events', color: 'var(--lavender-soft)' },
            { title: 'Network Size', value: '42', icon: Users, link: '/directory', color: 'var(--neon-cyan)' },
        ],
        admin: [
            { title: 'Total Alumni', value: '12,348', icon: Users, link: '/admin', color: 'var(--neon-cyan)' },
            { title: 'Pending Approvals', value: '23', icon: FileText, link: '/admin', color: '#f59e0b', highlight: true },
            { title: 'Active Jobs', value: '127', icon: Briefcase, link: '/admin', color: 'var(--violet-glow)' },
            { title: 'Funds Raised', value: '₹2.5Cr', icon: DollarSign, link: '/admin', color: 'var(--lavender-soft)' },
        ],
    };
    const cards = roleCards[user.role] || [];

    const roleActions = {
        alumni: [
            { label: 'Post a Job', icon: Briefcase, link: '/jobs/create' },
            { label: 'Make Donation', icon: Heart, link: '/donations' },
            { label: 'Update Profile', icon: Settings, link: '/profile' },
            { label: 'Browse Directory', icon: Users, link: '/directory' },
        ],
        student: [
            { label: 'My Profile', icon: Settings, link: '/profile' },
            { label: 'Find Mentor', icon: UserCheck, link: '/mentorship' },
            { label: 'Browse Jobs', icon: Briefcase, link: '/jobs' },
            { label: 'Join Events', icon: Calendar, link: '/events' },
        ],
        admin: [
            { label: 'Approve Users', icon: UserCheck, link: '/admin' },
            { label: 'Manage Jobs', icon: Briefcase, link: '/admin' },
            { label: 'View Analytics', icon: TrendingUp, link: '/admin' },
            { label: 'Create Event', icon: Calendar, link: '/admin' },
        ],
    };
    const actions = roleActions[user.role] || [];

    const recentActivity = [
        { text: 'New connection request from Sarah Johnson', time: '2h ago', icon: '👤' },
        { text: 'Job application received for Senior Developer', time: '5h ago', icon: '💼' },
        { text: 'Alumni Meetup 2026 — 24 days away', time: '1d ago', icon: '📅' },
        { text: 'Mentorship session scheduled with Raj Kumar', time: '2d ago', icon: '🎓' },
    ];

    return (
        <div style={{ minHeight: '100vh', background: 'var(--black-deep)', position: 'relative' }}>
            {/* Ambient glow */}
            <div style={{ position: 'fixed', top: 0, right: 0, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle,rgba(124,58,237,0.06) 0%,transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
            <div style={{ position: 'fixed', bottom: 0, left: 0, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(0,212,255,0.04) 0%,transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

            {/* ── HEADER ── */}
            <header className="glass" style={{ borderBottom: '1px solid rgba(139,92,246,0.2)', position: 'sticky', top: 0, zIndex: 100 }}>
                <nav className="container flex items-center justify-between" style={{ padding: '0.85rem 1.5rem' }}>
                    <div className="flex items-center gap-6">
                        {/* Logo */}
                        <div className="flex items-center gap-2">
                            <div style={{ width: 36, height: 36, borderRadius: '9px', background: 'linear-gradient(135deg,#7c3aed,#00d4ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 14px rgba(124,58,237,0.5)' }}>
                                <Award size={20} color="#fff" />
                            </div>
                            <span style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '0.05em', color: '#fff' }}>ALUMIO</span>
                        </div>
                        {/* Nav links */}
                        <div className="flex gap-1 hide-mobile">
                            {[
                                ['Dashboard', '/dashboard'], ['Directory', '/directory'],
                                ['Jobs', '/jobs'], ['Mentorship', '/mentorship'],
                                ['Events', '/events'],
                                ...(user.role === 'admin' ? [['Admin', '/admin']] : []),
                            ].map(([label, href]) => (
                                <a key={label} href={href} className={`nav-link ${href === '/dashboard' ? 'active' : ''}`} style={{ fontSize: '0.85rem' }}>{label}</a>
                            ))}
                        </div>
                    </div>
                    {/* Right side */}
                    <div className="flex items-center gap-3">
                        <span style={{ fontSize: '0.85rem', color: 'var(--silver)' }}>
                            Welcome, <strong style={{ color: '#fff' }}>{user.name}</strong>
                        </span>
                        <span className="badge badge-primary" style={{ textTransform: 'capitalize' }}>{user.role}</span>

                        {/* Notification bell */}
                        <a href="/notifications" style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', color: 'var(--silver)', transition: 'color 0.2s' }}
                            onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                            onMouseLeave={e => e.currentTarget.style.color = 'var(--silver)'}
                        >
                            <Bell size={20} />
                            {unreadNotifications > 0 && (
                                <span style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'var(--danger)', color: '#fff', fontSize: '0.6rem', fontWeight: 700, borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--black-deep)', boxShadow: '0 0 8px rgba(239,68,68,0.6)' }}>
                                    {unreadNotifications}
                                </span>
                            )}
                        </a>

                        <button onClick={logout} className="btn btn-ghost" style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}>
                            <LogOut size={16} />
                        </button>
                    </div>
                </nav>
            </header>

            {/* ── MAIN ── */}
            <main className="container" style={{ padding: '2.5rem 1.5rem', position: 'relative', zIndex: 1 }}>

                {/* Page title */}
                <div style={{ marginBottom: '2rem', animation: 'fade-in-up 0.5s ease forwards' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.25rem 0.85rem', background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: '999px', marginBottom: '0.75rem' }}>
                        <Zap size={12} color="var(--neon-cyan)" />
                        <span style={{ fontSize: '0.7rem', color: 'var(--lavender-soft)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{meta.label}</span>
                    </div>
                    <h1 className="h1" style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>{meta.label}</h1>
                    <p style={{ color: 'var(--silver)', fontSize: '0.9rem' }}>{meta.sub}</p>
                </div>

                {/* Stats cards */}
                <div className="grid grid-cols-4 stagger" style={{ marginBottom: '2rem' }}>
                    {cards.map((card, i) => (
                        <div
                            key={i}
                            className="card animate-fade-in"
                            style={{ cursor: 'pointer', border: card.highlight ? '1px solid rgba(245,158,11,0.4)' : undefined, boxShadow: card.highlight ? '0 0 20px rgba(245,158,11,0.2)' : undefined }}
                            onClick={() => router.push(card.link)}
                        >
                            <div className="corner-accent tl" />
                            <div className="flex items-center justify-between" style={{ marginBottom: '1rem' }}>
                                <span style={{ fontSize: '0.8rem', color: 'var(--silver)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{card.title}</span>
                                <div className="icon-box" style={{ width: 38, height: 38 }}>
                                    <card.icon size={18} color={card.color} />
                                </div>
                            </div>
                            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: card.color, textShadow: `0 0 20px ${card.color}50` }}>
                                {card.value}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Quick Actions */}
                <div style={{ marginBottom: '2rem' }}>
                    <h2 className="h3" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Zap size={16} color="var(--neon-cyan)" /> Quick Actions
                    </h2>
                    <div className="grid grid-cols-4 stagger">
                        {actions.map((action, i) => (
                            <button
                                key={i}
                                onClick={() => router.push(action.link)}
                                className="card flex items-center gap-3 animate-fade-in"
                                style={{ cursor: 'pointer', textAlign: 'left', border: 'none', padding: '1rem 1.25rem' }}
                            >
                                <div className="icon-box">
                                    <action.icon size={20} color="var(--lavender-soft)" />
                                </div>
                                <div>
                                    <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#fff', display: 'block' }}>{action.label}</span>
                                    <ChevronRight size={12} color="var(--silver)" style={{ marginTop: '2px' }} />
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Activity + Events */}
                <div className="grid grid-cols-2">
                    {/* Recent Activity */}
                    <div className="card">
                        <div className="corner-accent tl" /><div className="corner-accent br" />
                        <h3 className="h3" style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <TrendingUp size={16} color="var(--violet-glow)" /> Recent Activity
                        </h3>
                        <div className="flex flex-col gap-3">
                            {recentActivity.map((item, i) => (
                                <div key={i} className="flex justify-between items-center" style={{
                                    padding: '0.75rem 1rem',
                                    background: 'rgba(139,92,246,0.06)',
                                    border: '1px solid rgba(139,92,246,0.12)',
                                    borderRadius: 'var(--radius)',
                                    transition: 'all 0.2s',
                                    cursor: 'default',
                                }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(139,92,246,0.12)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(139,92,246,0.06)'}
                                >
                                    <span style={{ fontSize: '0.85rem', color: 'var(--silver-light)', display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                                        <span>{item.icon}</span>{item.text}
                                    </span>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--silver)', opacity: 0.65, whiteSpace: 'nowrap', marginLeft: '0.75rem' }}>{item.time}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Upcoming Events */}
                    <div className="card">
                        <div className="corner-accent tr" /><div className="corner-accent bl" />
                        <h3 className="h3" style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Calendar size={16} color="var(--neon-cyan)" /> Upcoming Events
                        </h3>
                        <div className="flex flex-col gap-3">
                            {upcomingEvents.length > 0 ? upcomingEvents.map((event, i) => {
                                const isDept = user.role === 'student' && event.department === user.department;
                                return (
                                    <div key={i} style={{
                                        padding: '0.75rem 1rem',
                                        background: isDept ? 'rgba(0,212,255,0.06)' : 'rgba(139,92,246,0.06)',
                                        border: `1px solid ${isDept ? 'rgba(0,212,255,0.2)' : 'rgba(139,92,246,0.12)'}`,
                                        borderRadius: 'var(--radius)',
                                        borderLeft: isDept ? '3px solid var(--neon-cyan)' : '3px solid rgba(139,92,246,0.3)',
                                    }}>
                                        <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#fff', marginBottom: '0.25rem' }}>{event.title}</div>
                                        <div className="flex justify-between items-center">
                                            <div style={{ fontSize: '0.8rem', color: 'var(--silver)', opacity: 0.75 }}>{new Date(event.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                                            <span className="badge badge-accent" style={{ fontSize: '0.65rem' }}>{event.attendees?.length || 0} attending</span>
                                        </div>
                                    </div>
                                );
                            }) : (
                                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--silver)', opacity: 0.5 }}>
                                    <Calendar size={32} style={{ marginBottom: '0.5rem', opacity: 0.4 }} />
                                    <p style={{ fontSize: '0.875rem' }}>No upcoming events found.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
