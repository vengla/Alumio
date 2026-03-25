'use client';
import { useState, useEffect } from 'react';
import { UserCheck, UserX, Bell, Loader2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../components/AuthProvider';
import { useRouter } from 'next/navigation';

export default function NotificationsPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [requests, setRequests] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('requests');

    // Mock data for requests
    const mockRequests = [
        {
            id: '1',
            from: {
                _id: 'student1',
                firstName: 'Rahul',
                lastName: 'Kumar',
                role: 'student',
                department: 'Computer Science',
                batch: '2024-2028',
                profilePhoto: null
            },
            sentAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
            status: 'pending'
        },
        {
            id: '2',
            from: {
                _id: 'student2',
                firstName: 'Priya',
                lastName: 'Sharma',
                role: 'student',
                department: 'Electrical Engineering',
                batch: '2023-2027',
                profilePhoto: null
            },
            sentAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
            status: 'pending'
        }
    ];

    useEffect(() => {
        // Load requests (mock data + dynamic data)
        setTimeout(() => {
            const handled = JSON.parse(localStorage.getItem('handled_requests') || '[]');
            const dynamicRequests = JSON.parse(localStorage.getItem('app_requests') || '[]');

            // Combine mock and dynamic (ensure no duplicates if needed, though IDs should differ)
            const allRequests = [...mockRequests, ...dynamicRequests];

            const filteredRequests = allRequests.filter(req => !handled.includes(req.id));
            setRequests(filteredRequests);
        }, 500);

        // Load notifications from localStorage
        const allNotifications = JSON.parse(localStorage.getItem('app_notifications') || '[]');
        if (user) {
            // Filter notifications for the current user
            const myNotifications = allNotifications.filter(n => n.userId === user._id || n.userId === user.id);
            setNotifications(myNotifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        }
        setLoading(false);
    }, [user]);

    const handleRequest = (requestId, action, userName, studentData) => {
        // Remove the request from the list
        setRequests(prev => prev.filter(req => req.id !== requestId));

        // Persist handled state
        const handled = JSON.parse(localStorage.getItem('handled_requests') || '[]');
        if (!handled.includes(requestId)) {
            handled.push(requestId);
            localStorage.setItem('handled_requests', JSON.stringify(handled));
        }

        if (action === 'accept') {
            // 1. Add student as MENTEE (for Alumni view)
            const mentees = JSON.parse(localStorage.getItem('mentees') || '[]');

            const newMentee = {
                id: studentData._id,
                firstName: studentData.firstName,
                lastName: studentData.lastName,
                department: studentData.department || 'N/A',
                batch: studentData.batch || 'N/A',
                role: studentData.role,
                addedAt: new Date().toISOString(),
                status: 'active'
            };

            if (!mentees.find(m => m.id === studentData._id)) {
                mentees.push(newMentee);
                localStorage.setItem('mentees', JSON.stringify(mentees));
            }

            // 2. Add Alumni as MENTOR (for Student view)
            const mentors = JSON.parse(localStorage.getItem('mentors') || '[]');

            const newMentor = {
                id: user._id || user.id, // Current user is the Alumni
                firstName: user.firstName || user.name.split(' ')[0],
                lastName: user.lastName || user.name.split(' ')[1] || '',
                department: user.department || 'Alumni Department', // Fallback
                role: 'alumni',
                addedAt: new Date().toISOString(),
                status: 'active',
                batch: user.batch || 'Alumni'
            };

            // Check if student already has this mentor (simple global check for demo)
            if (!mentors.find(m => m.id === newMentor.id)) {
                mentors.push(newMentor);
                localStorage.setItem('mentors', JSON.stringify(mentors));
            }

            // --- CREATE NOTIFICATION FOR THE SENDER ---
            const allNotifications = JSON.parse(localStorage.getItem('app_notifications') || '[]');
            const newNotification = {
                id: Date.now().toString(),
                userId: studentData._id, // Target the student
                type: 'request_accepted',
                title: 'Request Accepted',
                message: `${user.name || 'Alumni'} accepted your connection request. Check your 'My Mentors' page!`,
                isRead: false,
                createdAt: new Date().toISOString()
            };
            allNotifications.push(newNotification);

            // --- CREATE NOTIFICATION FOR CURRENT USER (For Demo Feedback) ---
            const myNotification = {
                id: Date.now().toString() + '_me',
                userId: user.id || user._id, // Target myself
                type: 'connection_success',
                title: 'Connection Established',
                message: `You are now connected with ${userName}.`,
                isRead: false,
                createdAt: new Date().toISOString()
            };
            allNotifications.push(myNotification);

            localStorage.setItem('app_notifications', JSON.stringify(allNotifications)); // Persist to LS

            alert(`✅ You are now connected with ${userName}!\n🎓 ${userName} has been added to your mentees.`);
        } else {
            alert(`❌ Connection request from ${userName} declined.`);
        }
    };

    const getTimeAgo = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
        if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        return 'Just now';
    };

    const clearNotifications = () => {
        const allNotifications = JSON.parse(localStorage.getItem('app_notifications') || '[]');
        // Remove only my notifications
        const remaining = allNotifications.filter(n => n.userId !== user._id && n.userId !== user.id);
        localStorage.setItem('app_notifications', JSON.stringify(remaining));
        setNotifications([]);
    };

    const markAsRead = (notificationId) => {
        const allNotifications = JSON.parse(localStorage.getItem('app_notifications') || '[]');
        const updated = allNotifications.map(n => {
            if (n.id === notificationId) {
                return { ...n, isRead: true };
            }
            return n;
        });
        localStorage.setItem('app_notifications', JSON.stringify(updated));

        // Update local state
        setNotifications(prev => prev.map(n => {
            if (n.id === notificationId) {
                return { ...n, isRead: true };
            }
            return n;
        }));
    };

    if (!user) {
        router.push('/login');
        return null;
    }

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-body)' }}>
            <header className="glass" style={{ borderBottom: '1px solid var(--border-light)', padding: '1rem 0' }}>
                <div className="container flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Bell size={28} color="var(--primary)" />
                        <h1 className="h2" style={{ margin: 0 }}>Notifications & Requests</h1>
                    </div>
                    <button onClick={() => router.push('/dashboard')} className="btn btn-outline flex items-center gap-2">
                        <ArrowLeft size={18} /> Back
                    </button>
                </div>
            </header>

            <main className="container py-8">
                {/* Tabs */}
                <div className="flex gap-4 mb-6" style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <button
                        className="py-2 px-4 font-medium"
                        style={{
                            color: activeTab === 'requests' ? 'var(--primary)' : 'var(--text-muted)',
                            borderBottom: activeTab === 'requests' ? '2px solid var(--primary)' : 'none',
                            marginBottom: '-1px'
                        }}
                        onClick={() => setActiveTab('requests')}
                    >
                        Pending Requests ({requests.length})
                    </button>
                    <button
                        className="py-2 px-4 font-medium"
                        style={{
                            color: activeTab === 'notifications' ? 'var(--primary)' : 'var(--text-muted)',
                            borderBottom: activeTab === 'notifications' ? '2px solid var(--primary)' : 'none',
                            marginBottom: '-1px'
                        }}
                        onClick={() => setActiveTab('notifications')}
                    >
                        Notifications ({notifications.filter(n => !n.isRead).length})
                    </button>
                </div>

                <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                            <Loader2 className="animate-spin" size={48} color="var(--primary)" style={{ margin: '0 auto' }} />
                            <p className="mt-4 text-muted">Loading...</p>
                        </div>
                    ) : (
                        <>
                            {activeTab === 'requests' && (
                                requests.length > 0 ? (
                                    <div className="flex flex-col gap-3">
                                        {requests.map(request => (
                                            <div
                                                key={request.id}
                                                className="flex items-center justify-between p-4"
                                                style={{ background: 'var(--bg-subtle)', borderRadius: 'var(--radius)' }}
                                            >
                                                <div className="flex items-center gap-3" style={{ flex: 1 }}>
                                                    {/* Avatar */}
                                                    <div style={{
                                                        width: '56px',
                                                        height: '56px',
                                                        borderRadius: '50%',
                                                        background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: '1.25rem',
                                                        fontWeight: 'bold',
                                                        color: 'white'
                                                    }}>
                                                        {request.from.firstName[0]}{request.from.lastName[0]}
                                                    </div>

                                                    {/* Info */}
                                                    <div style={{ flex: 1 }}>
                                                        <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
                                                            {request.from.firstName} {request.from.lastName}
                                                        </div>
                                                        <div className="text-sm text-muted">
                                                            {request.from.role.toUpperCase()} • {request.from.department}
                                                        </div>
                                                        <div className="text-sm text-muted">
                                                            Batch {request.from.batch} • {getTimeAgo(request.sentAt)}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex gap-2">
                                                    {user.role === 'alumni' ? (
                                                        <>
                                                            <button
                                                                onClick={() => handleRequest(request.id, 'accept', `${request.from.firstName} ${request.from.lastName}`, request.from)}
                                                                className="btn flex items-center gap-2"
                                                                style={{ padding: '0.5rem 1rem', background: 'var(--success)', color: 'white' }}
                                                            >
                                                                <UserCheck size={16} /> Accept
                                                            </button>
                                                            <button
                                                                onClick={() => handleRequest(request.id, 'decline', `${request.from.firstName} ${request.from.lastName}`, request.from)}
                                                                className="btn btn-outline flex items-center gap-2"
                                                                style={{ padding: '0.5rem 1rem' }}
                                                            >
                                                                <UserX size={16} /> Decline
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <span className="badge" style={{ background: 'var(--text-muted)', color: 'white' }}>
                                                            View Only
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                                        <Bell size={64} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                                        <h3 className="h3">No Pending Requests</h3>
                                        <p className="text-muted">You don't have any connection requests at the moment.</p>
                                    </div>
                                )
                            )}

                            {activeTab === 'notifications' && (
                                notifications.length > 0 ? (
                                    <div>
                                        <div className="flex justify-end mb-2">
                                            <button onClick={clearNotifications} className="btn-text" style={{ fontSize: '0.875rem', color: 'var(--danger)' }}>Clear All</button>
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            {notifications.map(notif => (
                                                <div
                                                    key={notif.id}
                                                    className="p-4"
                                                    onClick={() => markAsRead(notif.id)}
                                                    style={{
                                                        background: notif.isRead ? 'var(--bg-subtle)' : 'var(--bg-card)',
                                                        borderRadius: 'var(--radius)',
                                                        borderLeft: notif.isRead ? '4px solid transparent' : '4px solid var(--primary)',
                                                        boxShadow: notif.isRead ? 'none' : '0 2px 8px rgba(0,0,0,0.05)',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{notif.title}</div>
                                                            <div className="text-sm">{notif.message}</div>
                                                            <div className="text-xs text-muted mt-2">{getTimeAgo(notif.createdAt)}</div>
                                                        </div>
                                                        {!notif.isRead && (
                                                            <span className="badge" style={{ fontSize: '0.65rem', background: 'var(--primary)', color: 'white' }}>NEW</span>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                                        <Bell size={64} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                                        <h3 className="h3">No Notifications</h3>
                                        <p className="text-muted">You're all caught up!</p>
                                    </div>
                                )
                            )}
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}
