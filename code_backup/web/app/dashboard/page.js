'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '../components/AuthProvider';
import { useRouter } from 'next/navigation';
import { api } from '../lib/api';
import {
    Users, Briefcase, Heart, Award, Calendar, MessageSquare,
    TrendingUp, DollarSign, UserCheck, FileText, Settings, LogOut, Bell
} from 'lucide-react';

export default function DashboardPage() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [totalDonations, setTotalDonations] = useState(0);
    const [unreadNotifications, setUnreadNotifications] = useState(0);
    const [upcomingEvents, setUpcomingEvents] = useState([]);

    useEffect(() => {
        if (!user) {
            router.push('/login');
        }

        // Load total donations from localStorage
        const donations = parseInt(localStorage.getItem('totalDonations') || '0');
        setTotalDonations(donations);

        // Load notifications count
        const updateNotifications = () => {
            const allNotifications = JSON.parse(localStorage.getItem('app_notifications') || '[]');
            if (user) {
                const myUnread = allNotifications.filter(n =>
                    (n.userId === user._id || n.userId === user.id) && !n.isRead
                ).length;
                setUnreadNotifications(myUnread);
            }
        };

        updateNotifications();
        // Poll for updates every few seconds to simulate real-time
        const interval = setInterval(updateNotifications, 3000);
        return () => clearInterval(interval);

    }, [user, router]);

    // Fetch Events & Check Notifications
    useEffect(() => {
        if (!user) return;

        const fetchAndProcessEvents = async () => {
            try {
                const res = await api.get('/events');
                let events = res.data || [];

                // Filter past events
                events = events.filter(e => new Date(e.startDate) > new Date());

                // Sort: Department Priority for Students, then Date
                if (user.role === 'student' && user.department) {
                    events.sort((a, b) => {
                        const aIsDept = a.department === user.department;
                        const bIsDept = b.department === user.department;
                        if (aIsDept && !bIsDept) return -1;
                        if (!aIsDept && bIsDept) return 1;
                        return new Date(a.startDate) - new Date(b.startDate);
                    });
                } else {
                    events.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
                }

                setUpcomingEvents(events.slice(0, 3));

                // Notification Logic for "Nearest" Events (within 7 days)
                const notifiedEvents = JSON.parse(localStorage.getItem('notified_events') || '[]');
                const upcomingNear = events.filter(e => {
                    const diffTime = new Date(e.startDate) - new Date();
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    return diffDays >= 0 && diffDays <= 7;
                });

                if (upcomingNear.length > 0) {
                    const allNotifications = JSON.parse(localStorage.getItem('app_notifications') || '[]');
                    let newNotifs = false;

                    upcomingNear.forEach(event => {
                        if (!notifiedEvents.includes(event._id)) {
                            // Create notification
                            const isDeptMatch = user.role === 'student' && event.department === user.department;

                            allNotifications.push({
                                id: Date.now().toString() + Math.random().toString(),
                                userId: user._id || user.id,
                                type: 'event_reminder',
                                title: isDeptMatch ? `Recommended Event: ${event.title}` : `Upcoming Event: ${event.title}`,
                                message: `${event.title} is happening on ${new Date(event.startDate).toLocaleDateString()}. Register now!`,
                                isRead: false,
                                createdAt: new Date().toISOString()
                            });

                            notifiedEvents.push(event._id);
                            newNotifs = true;
                        }
                    });

                    if (newNotifs) {
                        localStorage.setItem('app_notifications', JSON.stringify(allNotifications));
                        localStorage.setItem('notified_events', JSON.stringify(notifiedEvents));
                        // Update badge count immediately
                        const myUnread = allNotifications.filter(n =>
                            (n.userId === user._id || n.userId === user.id) && !n.isRead
                        ).length;
                        setUnreadNotifications(myUnread);
                    }
                }

            } catch (error) {
                console.error("Failed to fetch events", error);
            }
        };

        fetchAndProcessEvents();
    }, [user]);

    if (!user) return <div>Loading...</div>;

    const roleSpecificCards = {
        alumni: [
            { title: 'My Network', value: '145', icon: Users, link: '/directory' },
            { title: 'Active Mentees', value: '3', icon: UserCheck, link: '/mentorship' },
            { title: 'Job Posts', value: '2', icon: Briefcase, link: '/jobs' },
            { title: 'Total Donations', value: '₹25,000', icon: Heart, link: '/donations' },
        ],
        student: [
            { title: 'Mentors', value: '2', icon: UserCheck, link: '/mentorship' },
            { title: 'Job Applications', value: '5', icon: Briefcase, link: '/jobs' },
            { title: 'Events Registered', value: '3', icon: Calendar, link: '/events' },
            { title: 'Network Size', value: '42', icon: Users, link: '/directory' },
        ],
        admin: [
            { title: 'Total Alumni', value: '12,348', icon: Users, link: '/admin' },
            { title: 'Pending Approvals', value: '23', icon: FileText, link: '/admin', highlight: true },
            { title: 'Active Jobs', value: '127', icon: Briefcase, link: '/admin' },
            { title: 'Funds Raised', value: '₹2.5Cr', icon: DollarSign, link: '/admin' },
        ]
    };

    const cards = roleSpecificCards[user.role] || [];

    const quickActions = {
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
        ]
    };

    const actions = quickActions[user.role] || [];

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-body)' }}>
            {/* Header */}
            <header className="glass" style={{ borderBottom: '1px solid var(--border-light)' }}>
                <nav className="container flex items-center justify-between py-4">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-2">
                            <Award size={28} color="var(--primary)" />
                            <span className="h3" style={{ margin: 0 }}>ALUMIO</span>
                        </div>
                        <div className="flex gap-4">
                            <a href="/dashboard" className="nav-link active">Dashboard</a>
                            <a href="/directory" className="nav-link">Directory</a>
                            <a href="/jobs" className="nav-link">Jobs</a>
                            <a href="/mentorship" className="nav-link">Mentorship</a>
                            <a href="/events" className="nav-link">Events</a>
                            {user.role === 'admin' && <a href="/admin" className="nav-link">Admin</a>}
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm">Welcome, <strong>{user.name}</strong></span>
                        <span className="badge badge-primary" style={{ textTransform: 'capitalize' }}>{user.role}</span>

                        {/* Notifications Bell */}
                        <a href="/notifications" style={{ position: 'relative', display: 'inline-block' }}>
                            <Bell size={20} style={{ cursor: 'pointer' }} />
                            {/* Badge showing pending notifications count */}
                            {unreadNotifications > 0 && (
                                <span style={{
                                    position: 'absolute',
                                    top: '-4px',
                                    right: '-4px',
                                    background: 'var(--danger)',
                                    color: 'white',
                                    fontSize: '0.625rem',
                                    fontWeight: 'bold',
                                    borderRadius: '50%',
                                    width: '16px',
                                    height: '16px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    {unreadNotifications}
                                </span>
                            )}
                        </a>

                        <button onClick={logout} className="btn" style={{ padding: '0.5rem 1rem', background: 'var(--bg-subtle)' }}>
                            <LogOut size={18} />
                        </button>
                    </div>
                </nav>
            </header>

            {/* Main Content */}
            <main className="container py-8">
                <div className="mb-6">
                    <h1 className="h1" style={{ marginBottom: '0.5rem' }}>
                        {user.role === 'admin' ? 'Admin Dashboard' : user.role === 'student' ? 'Student Dashboard' : 'Alumni Dashboard'}
                    </h1>
                    <p className="text-muted">
                        {user.role === 'admin'
                            ? 'Manage the alumni platform and monitor activities'
                            : user.role === 'student'
                                ? 'Connect with alumni, find mentors, and explore opportunities'
                                : 'Your impact and engagement at a glance'}
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-4 mb-8">
                    {cards.map((card, i) => (
                        <div
                            key={i}
                            className="card"
                            style={{
                                cursor: 'pointer',
                                border: card.highlight ? '2px solid var(--warning)' : undefined
                            }}
                            onClick={() => {
                                router.push(card.link);
                            }}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-sm text-muted">{card.title}</span>
                                <div style={{
                                    padding: '0.5rem',
                                    background: 'var(--bg-subtle)',
                                    borderRadius: 'var(--radius)'
                                }}>
                                    <card.icon size={20} color="var(--primary)" />
                                </div>
                            </div>
                            <div className="h2" style={{ margin: 0 }}>{card.value}</div>
                        </div>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="mb-8">
                    <h2 className="h3 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-4">
                        {actions.map((action, i) => (
                            <button
                                key={i}
                                onClick={() => {
                                    router.push(action.link);
                                }}
                                className="card flex items-center gap-3"
                                style={{ cursor: 'pointer', textAlign: 'left', border: 'none' }}
                            >
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
                                    borderRadius: 'var(--radius)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <action.icon size={24} color="white" />
                                </div>
                                <span style={{ fontWeight: 600 }}>{action.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Recent Activity / Notifications */}
                <div className="grid grid-cols-2">
                    <div className="card">
                        <h3 className="h3 mb-4">Recent Activity</h3>
                        <div className="flex flex-col gap-3">
                            {[
                                { text: 'New connection request from Sarah Johnson', time: '2 hours ago' },
                                { text: 'Job application received for Senior Developer', time: '5 hours ago' },
                                { text: 'Upcoming event: Alumni Meetup 2026', time: '1 day ago' },
                                { text: 'Mentorship session scheduled', time: '2 days ago' },
                            ].map((activity, i) => (
                                <div key={i} className="flex justify-between items-center" style={{ padding: '0.75rem', background: 'var(--bg-subtle)', borderRadius: 'var(--radius)' }}>
                                    <span className="text-sm">{activity.text}</span>
                                    <span className="text-sm text-muted">{activity.time}</span>
                                </div>
                            ))}
                        </div>
                    </div>



                    <div className="card">
                        <h3 className="h3 mb-4">Upcoming Events</h3>
                        <div className="flex flex-col gap-3">
                            {upcomingEvents.length > 0 ? (
                                upcomingEvents.map((event, i) => (
                                    <div key={i} className="flex justify-between items-center" style={{
                                        padding: '0.75rem',
                                        background: (user.role === 'student' && event.department === user.department) ? 'rgba(37, 99, 235, 0.05)' : 'var(--bg-subtle)',
                                        borderRadius: 'var(--radius)',
                                        borderLeft: (user.role === 'student' && event.department === user.department) ? '3px solid var(--primary)' : 'none'
                                    }}>
                                        <div>
                                            <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{event.title}</div>
                                            <div className="text-sm text-muted">{new Date(event.startDate).toLocaleDateString()}</div>
                                        </div>
                                        <span className="badge">{event.attendees?.length || 0} attending</span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-muted text-sm">No upcoming events found.</p>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
