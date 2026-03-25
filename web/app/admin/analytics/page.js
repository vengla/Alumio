'use client';
import { useState, useEffect } from 'react';
import { TrendingUp, Users, Briefcase, Calendar, Heart, Award, Target, Activity } from 'lucide-react';
import { api } from '../../lib/api';

export default function AnalyticsPage() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                // Fetch various platform statistics
                const [usersStats, jobsData, eventsData] = await Promise.all([
                    api.get('/users/stats'),
                    api.get('/jobs'),
                    api.get('/events')
                ]);

                // Calculate statistics
                const totalJobs = jobsData.data?.length || 0;
                const totalEvents = eventsData.data?.length || 0;

                // Get job applications count
                let totalApplications = 0;
                jobsData.data?.forEach(job => {
                    totalApplications += job.applicants?.length || 0;
                });

                // Get event registrations count
                let totalRegistrations = 0;
                eventsData.data?.forEach(event => {
                    totalRegistrations += event.attendees?.length || 0;
                });

                setStats({
                    users: usersStats.data,
                    jobs: {
                        total: totalJobs,
                        applications: totalApplications
                    },
                    events: {
                        total: totalEvents,
                        registrations: totalRegistrations
                    }
                });
            } catch (error) {
                console.error('Failed to fetch analytics:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', background: 'var(--bg-body)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="text-center">
                    <Activity className="animate-spin" size={48} style={{ margin: '0 auto 1rem', color: 'var(--primary)' }} />
                    <p className="text-muted">Loading analytics...</p>
                </div>
            </div>
        );
    }

    const overviewCards = [
        {
            title: 'Total Alumni',
            value: stats?.users?.totalAlumni || 0,
            icon: Users,
            color: '#3b82f6',
            change: '+12% this month'
        },
        {
            title: 'Total Students',
            value: stats?.users?.totalStudents || 0,
            icon: Award,
            color: '#8b5cf6',
            change: '+8% this semester'
        },
        {
            title: 'Active Jobs',
            value: stats?.jobs?.total || 0,
            icon: Briefcase,
            color: '#10b981',
            change: `${stats?.jobs?.applications || 0} applications`
        },
        {
            title: 'Upcoming Events',
            value: stats?.events?.total || 0,
            icon: Calendar,
            color: '#f59e0b',
            change: `${stats?.events?.registrations || 0} registrations`
        },
        {
            title: 'Mentors Available',
            value: stats?.users?.mentorsAvailable || 0,
            icon: Target,
            color: '#06b6d4',
            change: 'Ready to help'
        },
        {
            title: 'Total Donations',
            value: '₹2.5 Cr',
            icon: Heart,
            color: '#ec4899',
            change: '+15% this quarter'
        }
    ];

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-body)' }}>
            <header className="glass" style={{ borderBottom: '1px solid var(--border-light)', padding: '1rem 0' }}>
                <div className="container flex items-center justify-between">
                    <div>
                        <h1 className="h2" style={{ margin: 0 }}>Platform Analytics</h1>
                        <p className="text-muted text-sm" style={{ marginTop: '0.25rem' }}>Real-time insights and performance metrics</p>
                    </div>
                    <a href="/admin" className="btn btn-outline">← Back to Admin</a>
                </div>
            </header>

            <main className="container py-8">
                {/* Overview Cards */}
                <div className="mb-8">
                    <h2 className="h3 mb-4">Platform Overview</h2>
                    <div className="grid grid-cols-3">
                        {overviewCards.map((card, i) => (
                            <div key={i} className="card" style={{
                                borderLeft: `4px solid ${card.color}`,
                                background: `linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.95))`
                            }}>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm text-muted">{card.title}</span>
                                    <div style={{
                                        width: '48px',
                                        height: '48px',
                                        background: `${card.color}15`,
                                        borderRadius: 'var(--radius)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <card.icon size={24} style={{ color: card.color }} />
                                    </div>
                                </div>
                                <div className="h2" style={{ margin: '0 0 0.5rem 0', color: card.color }}>{card.value}</div>
                                <div className="text-sm" style={{ color: card.color, fontWeight: 500 }}>
                                    {card.change}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Department Breakdown */}
                <div className="mb-8">
                    <h2 className="h3 mb-4">Department-wise Distribution</h2>
                    <div className="card">
                        <div className="flex flex-col gap-3">
                            {stats?.users?.departmentWise?.slice(0, 8).map((dept, i) => (
                                <div key={i} className="flex items-center justify-between" style={{
                                    padding: '1rem',
                                    background: 'var(--bg-subtle)',
                                    borderRadius: 'var(--radius)'
                                }}>
                                    <div className="flex items-center gap-3" style={{ flex: 1 }}>
                                        <div style={{
                                            width: '8px',
                                            height: '40px',
                                            background: `hsl(${i * 40}, 70%, 50%)`,
                                            borderRadius: '4px'
                                        }} />
                                        <div>
                                            <div style={{ fontWeight: 600 }}>{dept._id || 'Unknown'}</div>
                                            <div className="text-sm text-muted">{dept.count} members</div>
                                        </div>
                                    </div>
                                    <div style={{
                                        background: `hsl(${i * 40}, 70%, 95%)`,
                                        padding: '0.5rem 1rem',
                                        borderRadius: 'var(--radius)',
                                        fontWeight: 600,
                                        color: `hsl(${i * 40}, 70%, 40%)`
                                    }}>
                                        {dept.count}
                                    </div>
                                </div>
                            )) || <p className="text-muted">No data available</p>}
                        </div>
                    </div>
                </div>

                {/* Batch-wise Distribution */}
                <div className="mb-8">
                    <h2 className="h3 mb-4">Batch-wise Alumni Distribution</h2>
                    <div className="card">
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end', height: '300px' }}>
                            {stats?.users?.batchWise?.slice(0, 10).map((batch, i) => {
                                const maxCount = Math.max(...(stats?.users?.batchWise?.map(b => b.count) || [1]));
                                const height = (batch.count / maxCount) * 100;
                                return (
                                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                                        <div style={{
                                            background: `linear-gradient(180deg, #3b82f6, #8b5cf6)`,
                                            width: '100%',
                                            height: `${height}%`,
                                            borderRadius: '4px 4px 0 0',
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            justifyContent: 'center',
                                            paddingTop: '0.5rem',
                                            color: 'white',
                                            fontSize: '0.875rem',
                                            fontWeight: 600,
                                            minHeight: '40px'
                                        }}>
                                            {batch.count}
                                        </div>
                                        <div style={{
                                            fontSize: '0.75rem',
                                            textAlign: 'center',
                                            transform: 'rotate(-45deg)',
                                            whiteSpace: 'nowrap',
                                            marginTop: '1rem'
                                        }}>
                                            {batch._id}
                                        </div>
                                    </div>
                                );
                            }) || <p className="text-muted">No data available</p>}
                        </div>
                    </div>
                </div>

                {/* Engagement Metrics */}
                <div className="mb-8">
                    <h2 className="h3 mb-4">Engagement Metrics</h2>
                    <div className="grid grid-cols-2">
                        <div className="card">
                            <h3 className="h4 mb-4">Job Portal Activity</h3>
                            <div className="flex flex-col gap-3">
                                <div className="flex justify-between items-center p-3" style={{ background: 'var(--bg-subtle)', borderRadius: 'var(--radius)' }}>
                                    <span>Total Job Posts</span>
                                    <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{stats?.jobs?.total || 0}</span>
                                </div>
                                <div className="flex justify-between items-center p-3" style={{ background: 'var(--bg-subtle)', borderRadius: 'var(--radius)' }}>
                                    <span>Total Applications</span>
                                    <span style={{ fontWeight: 600, color: 'var(--success)' }}>{stats?.jobs?.applications || 0}</span>
                                </div>
                                <div className="flex justify-between items-center p-3" style={{ background: 'var(--bg-subtle)', borderRadius: 'var(--radius)' }}>
                                    <span>Avg Applications/Job</span>
                                    <span style={{ fontWeight: 600, color: 'var(--warning)' }}>
                                        {stats?.jobs?.total > 0 ? Math.round((stats?.jobs?.applications || 0) / stats?.jobs?.total) : 0}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="card">
                            <h3 className="h4 mb-4">Event Participation</h3>
                            <div className="flex flex-col gap-3">
                                <div className="flex justify-between items-center p-3" style={{ background: 'var(--bg-subtle)', borderRadius: 'var(--radius)' }}>
                                    <span>Upcoming Events</span>
                                    <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{stats?.events?.total || 0}</span>
                                </div>
                                <div className="flex justify-between items-center p-3" style={{ background: 'var(--bg-subtle)', borderRadius: 'var(--radius)' }}>
                                    <span>Total Registrations</span>
                                    <span style={{ fontWeight: 600, color: 'var(--success)' }}>{stats?.events?.registrations || 0}</span>
                                </div>
                                <div className="flex justify-between items-center p-3" style={{ background: 'var(--bg-subtle)', borderRadius: 'var(--radius)' }}>
                                    <span>Avg Attendees/Event</span>
                                    <span style={{ fontWeight: 600, color: 'var(--warning)' }}>
                                        {stats?.events?.total > 0 ? Math.round((stats?.events?.registrations || 0) / stats?.events?.total) : 0}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
