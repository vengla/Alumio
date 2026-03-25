'use client';
import { useState, useEffect } from 'react';
import {
    Users, FileText, Briefcase, Calendar, Heart, Award,
    TrendingUp, CheckCircle, XCircle, Eye, Loader2
} from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../components/AuthProvider';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('overview');
    const [pendingUsers, setPendingUsers] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [usersData, statsData] = await Promise.all([
                api.get('/users/pending'),
                api.get('/users/stats')
            ]);
            setPendingUsers(usersData.data);
            setStats(statsData.data);
        } catch (error) {
            console.error('Failed to fetch admin data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user && user.role !== 'admin') {
            router.push('/dashboard');
            return;
        }
        fetchData();
    }, [user]);

    const handleApproval = async (id, status) => {
        try {
            await api.put(`/users/${id}/${status}`);
            alert(`User ${status}ed successfully!`);
            fetchData();
        } catch (error) {
            if (error.message.includes('User not found') || error.message.includes('404')) {
                alert('User no longer exists. refreshing list...');
                fetchData();
            } else {
                alert(`Failed to ${status} user: ${error.message}`);
            }
        }
    };

    if (loading && !stats) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Loader2 className="animate-spin" size={48} color="var(--primary)" />
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-body)' }}>
            <header className="glass" style={{ borderBottom: '1px solid var(--border-light)', padding: '1rem 0' }}>
                <div className="container flex items-center justify-between">
                    <h1 className="h2" style={{ margin: 0 }}>Admin Dashboard</h1>
                    <a href="/dashboard" className="btn btn-outline">← Main Dashboard</a>
                </div>
            </header>

            <main className="container py-8">
                {/* Navigation Tabs */}
                <div className="flex gap-4 mb-6">
                    {[
                        { key: 'overview', label: 'Overview', link: null },
                        { key: 'approvals', label: `Approvals (${pendingUsers.length})`, link: null },
                        { key: 'jobs', label: 'Job Management', link: null },
                        { key: 'analytics', label: 'Analytics', link: null }
                    ].map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={activeTab === tab.key ? 'btn btn-primary' : 'btn btn-outline'}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <>
                        {/* Stats */}
                        <div className="grid grid-cols-4 mb-8">
                            {[
                                { label: 'Total Users', value: (stats?.totalAlumni || 0) + (stats?.totalStudents || 0), icon: Users, color: 'var(--primary)' },
                                { label: 'Pending Approvals', value: pendingUsers.length, icon: FileText, color: 'var(--warning)' },
                                { label: 'Total Mentors', value: stats?.mentorsAvailable || 0, icon: Briefcase, color: 'var(--success)' },
                                { label: 'Funds Raised', value: '₹1,50,000', icon: Heart, color: 'var(--danger)' },
                            ].map((stat, i) => (
                                <div key={i} className="card">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-sm text-muted">{stat.label}</span>
                                        <stat.icon size={24} color={stat.color} />
                                    </div>
                                    <div className="h2" style={{ margin: 0, color: stat.color }}>{stat.value}</div>
                                </div>
                            ))}
                        </div>

                        {/* Recent Activity Mock (Replace with real logs later) */}
                        <h3 className="h3 mb-4">Platform Overview</h3>
                        <div className="grid grid-cols-2 gap-6 mb-8">
                            <div className="card">
                                <h4 style={{ marginBottom: '1rem' }}>Department Distribution</h4>
                                <div className="flex flex-col gap-2">
                                    {stats?.departmentWise?.map((dept, i) => (
                                        <div key={i} className="flex justify-between items-center text-sm">
                                            <span>{dept._id}</span>
                                            <span style={{ fontWeight: 600 }}>{dept.count}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="card">
                                <h4 style={{ marginBottom: '1rem' }}>Batch Statistics</h4>
                                <div className="flex flex-col gap-2">
                                    {stats?.batchWise?.slice(0, 5).map((batch, i) => (
                                        <div key={i} className="flex justify-between items-center text-sm">
                                            <span>Batch {batch._id}</span>
                                            <span style={{ fontWeight: 600 }}>{batch.count} users</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* Approvals Tab */}
                {activeTab === 'approvals' && (
                    <>
                        <h3 className="h3 mb-4">Pending User Approvals</h3>
                        <div className="card mb-8">
                            <div className="flex flex-col gap-3">
                                {pendingUsers.length > 0 ? (
                                    pendingUsers.map(u => (
                                        <div key={u._id} className="flex justify-between items-center p-4" style={{ background: 'var(--bg-subtle)', borderRadius: 'var(--radius)' }}>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{u.firstName} {u.lastName}</div>
                                                <div className="text-sm text-muted">
                                                    {u.role.toUpperCase()} • Enrollment: {u.enrollmentNumber} • Batch: {u.batch} • {u.email}
                                                </div>
                                                <div className="text-sm text-muted">Department: {u.department}</div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={() => handleApproval(u._id, 'approve')} className="btn" style={{ padding: '0.5rem 1rem', background: 'var(--success)', color: 'white' }}>
                                                    <CheckCircle size={16} /> Approve
                                                </button>
                                                <button onClick={() => handleApproval(u._id, 'reject')} className="btn" style={{ padding: '0.5rem 1rem', background: 'var(--danger)', color: 'white' }}>
                                                    <XCircle size={16} /> Reject
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-muted">
                                        No pending user approvals found.
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}

                {/* Job Management Tab (Placeholder) */}
                {activeTab === 'jobs' && (
                    <div className="card">
                        <h3 className="h3 mb-4">Active Job Listings</h3>
                        <div className="text-center py-8 text-muted">
                            <Briefcase size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                            <p>All jobs from alumni are auto-approved.</p>
                            <p className="text-sm">Recruiter job moderation coming soon</p>
                        </div>
                    </div>
                )}

                {/* Analytics */}
                {activeTab === 'analytics' && (
                    <div className="grid grid-cols-2 gap-6">
                        <div className="card">
                            <div className="flex items-center gap-3 mb-6">
                                <TrendingUp size={24} color="var(--primary)" />
                                <h3 className="h3" style={{ margin: 0 }}>Department Demographics</h3>
                            </div>
                            <div className="flex flex-col gap-4">
                                {stats?.departmentWise?.map((dept, i) => {
                                    const max = Math.max(...(stats.departmentWise.map(d => d.count)));
                                    const percent = (dept.count / max) * 100;
                                    return (
                                        <div key={i}>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="font-medium">{dept._id}</span>
                                                <span className="text-muted">{dept.count} Members</span>
                                            </div>
                                            <div style={{ width: '100%', height: '8px', background: 'var(--bg-subtle)', borderRadius: '4px', overflow: 'hidden' }}>
                                                <div style={{ width: `${percent}%`, height: '100%', background: 'var(--primary)', borderRadius: '4px' }}></div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="card">
                            <div className="flex items-center gap-3 mb-6">
                                <Calendar size={24} color="var(--success)" />
                                <h3 className="h3" style={{ margin: 0 }}>Alumni by Batch</h3>
                            </div>
                            <div className="flex flex-col gap-4">
                                {stats?.batchWise?.slice(0, 8).map((batch, i) => {
                                    const max = Math.max(...(stats.batchWise.map(d => d.count)));
                                    const percent = (batch.count / max) * 100;
                                    return (
                                        <div key={i}>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="font-medium">Batch {batch._id}</span>
                                                <span className="text-muted">{batch.count} Alumni</span>
                                            </div>
                                            <div style={{ width: '100%', height: '8px', background: 'var(--bg-subtle)', borderRadius: '4px', overflow: 'hidden' }}>
                                                <div style={{ width: `${percent}%`, height: '100%', background: 'var(--success)', borderRadius: '4px' }}></div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
