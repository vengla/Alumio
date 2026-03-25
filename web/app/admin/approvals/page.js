'use client';
import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { api } from '../../lib/api';
import { useAuth } from '../../components/AuthProvider';
import { useRouter } from 'next/navigation';

export default function ApprovalsPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [pendingUsers, setPendingUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const usersData = await api.get('/users/pending');
            setPendingUsers(usersData.data);
        } catch (error) {
            console.error('Failed to fetch pending users:', error);
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
            alert(`Failed to ${status} user: ${error.message}`);
        }
    };

    if (loading) {
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
                    <h1 className="h2" style={{ margin: 0 }}>User Approvals</h1>
                    <a href="/admin" className="btn btn-outline">← Back to Admin</a>
                </div>
            </header>

            <main className="container py-8">
                <h3 className="h3 mb-4">Pending User Approvals ({pendingUsers.length})</h3>
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
            </main>
        </div>
    );
}
