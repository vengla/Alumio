'use client';
import { useState, useEffect } from 'react';
import { Search, MapPin, Briefcase, Linkedin, UserPlus, Loader2 } from 'lucide-react';
import { useAuth } from '../components/AuthProvider';
import { api } from '../lib/api';

export default function DirectoryPage() {
    const { user } = useAuth();
    const [alumniList, setAlumniList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({ batch: '', department: '', city: '' });
    const [stats, setStats] = useState(null);
    const [connectionRequests, setConnectionRequests] = useState(new Set());

    const fetchAlumni = async () => {
        setLoading(true);
        try {
            const query = new URLSearchParams();
            if (searchTerm) query.append('search', searchTerm);
            if (filters.batch) query.append('batch', filters.batch);
            if (filters.department) query.append('department', filters.department);
            if (filters.city) query.append('city', filters.city);
            query.append('role', 'alumni'); // Only show alumni in this directory

            const data = await api.get(`/users?${query.toString()}`);
            setAlumniList(data.data);
        } catch (error) {
            console.error('Failed to fetch alumni:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAlumni();
    }, [filters]);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchAlumni();
    };

    const handleConnect = async (alumniId, alumniName) => {
        // If already connected, cancel the request
        if (connectionRequests.has(alumniId)) {
            setConnectionRequests(prev => {
                const newSet = new Set(prev);
                newSet.delete(alumniId);
                return newSet;
            });
            alert(`Connection request to ${alumniName} cancelled.`);
            return;
        }

        // Send new connection request
        try {
            // Simulate sending connection request
            // In a real implementation, this would be an API call
            await new Promise(resolve => setTimeout(resolve, 500));

            // --- CREATE REQUEST OBJECT FOR LOCAL STORAGE (For Demo) ---
            const requests = JSON.parse(localStorage.getItem('app_requests') || '[]');
            const newRequest = {
                id: Date.now().toString(),
                toUserId: alumniId, // Identify who this request is for
                from: {
                    _id: user.id || user._id,
                    firstName: user.firstName || user.name.split(' ')[0],
                    lastName: user.lastName || user.name.split(' ')[1] || '',
                    role: user.role,
                    department: user.department || 'Student Dept',
                    batch: user.batch || '2025',
                    profilePhoto: null
                },
                sentAt: new Date(),
                status: 'pending'
            };
            requests.push(newRequest);
            localStorage.setItem('app_requests', JSON.stringify(requests));

            // Also notify the user visually
            setConnectionRequests(prev => new Set(prev).add(alumniId));
            alert(`Connection request sent to ${alumniName}!`);
        } catch (error) {
            console.error(error);
            alert('Failed to send connection request. Please try again.');
        }
    };

    const displayedAlumni = alumniList.filter(a => !connectionRequests.has(a._id));

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-body)' }}>
            {/* Simple Header */}
            <header className="glass" style={{ borderBottom: '1px solid var(--border-light)', padding: '1rem 0' }}>
                <div className="container flex items-center justify-between">
                    <h1 className="h2" style={{ margin: 0 }}>Alumni Directory</h1>
                    <a href="/dashboard" className="btn btn-outline">← Back to Dashboard</a>
                </div>
            </header>

            <main className="container py-8">
                {/* Search & Filters */}
                <div className="card mb-6">
                    <form onSubmit={handleSearch} className="flex gap-4 items-end">
                        <div style={{ flex: 1 }}>
                            <label className="text-sm" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
                                <Search size={16} style={{ display: 'inline' }} /> Search Alumni
                            </label>
                            <input
                                type="text"
                                placeholder="Search by name, company, or skills..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: '1px solid var(--border-light)',
                                    borderRadius: 'var(--radius)',
                                    fontFamily: 'inherit'
                                }}
                            />
                        </div>

                        <select
                            value={filters.batch}
                            onChange={(e) => setFilters({ ...filters, batch: e.target.value })}
                            style={{ padding: '0.75rem', border: '1px solid var(--border-light)', borderRadius: 'var(--radius)' }}
                        >
                            <option value="">All Batches</option>
                            {['2018-2022', '2019-2023', '2020-2024', '2021-2025'].map(y => <option key={y}>{y}</option>)}
                        </select>

                        <select
                            value={filters.department}
                            onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                            style={{ padding: '0.75rem', border: '1px solid var(--border-light)', borderRadius: 'var(--radius)' }}
                        >
                            <option value="">All Departments</option>
                            <option>Agricultural Engineering</option>
                            <option>Artificial Intelligence and Data Science</option>
                            <option>Civil Engineering</option>
                            <option>Computer Science</option>
                            <option>Cyber Security</option>
                            <option>Electrical Engineering</option>
                            <option>Electronics & Communication</option>
                            <option>Information Technology</option>
                            <option>Mechanical Engineering</option>
                            <option>Medical Electronics</option>
                        </select>

                        <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
                            Search
                        </button>
                    </form>

                    <div className="mt-4 text-sm text-muted">
                        {loading ? 'Searching...' : `Found ${displayedAlumni.length} alumni`}
                    </div>
                </div>

                {/* Alumni Grid */}
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '100px 0' }}>
                        <Loader2 className="animate-spin" size={48} color="var(--primary)" />
                        <p className="mt-4 text-muted">Loading alumni directory...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-3">
                        {displayedAlumni.length > 0 ? (
                            displayedAlumni.map(alumni => (
                                <div key={alumni._id} className="card">
                                    {/* Profile Header */}
                                    <div className="flex items-start gap-3 mb-3">
                                        <div style={{
                                            width: '64px',
                                            height: '64px',
                                            borderRadius: '50%',
                                            background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '1.5rem',
                                            fontWeight: 'bold',
                                            color: 'white'
                                        }}>
                                            {alumni.firstName ? `${alumni.firstName[0]}${alumni.lastName?.[0] || ''}` : (alumni.name?.[0] || '?')}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <h3 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{alumni.firstName ? `${alumni.firstName} ${alumni.lastName}` : alumni.name || 'Unknown User'}</h3>
                                            <div className="text-sm text-muted">{alumni.department} | Batch {alumni.batch}</div>
                                        </div>
                                    </div>

                                    {/* Current Role */}
                                    <div className="mb-3">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Briefcase size={16} color="var(--primary)" />
                                            <span style={{ fontWeight: 600 }}>{alumni.profile?.currentCompany ? `${alumni.profile.currentRole} at ${alumni.profile.currentCompany}` : 'Job details not shared'}</span>
                                        </div>
                                    </div>

                                    {/* Location */}
                                    {alumni.profile?.location && (
                                        <div className="flex items-center gap-2 mb-3 text-sm text-muted">
                                            <MapPin size={16} />
                                            {alumni.profile.location}
                                        </div>
                                    )}

                                    {/* Skills */}
                                    {alumni.profile?.skills?.length > 0 && (
                                        <div className="mb-4">
                                            <div className="flex gap-2 flex-wrap">
                                                {alumni.profile.skills.slice(0, 3).map((skill, i) => (
                                                    <span key={i} className="badge">{skill}</span>
                                                ))}
                                                {alumni.profile.skills.length > 3 && (
                                                    <span className="text-xs text-muted">+{alumni.profile.skills.length - 3} more</span>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Mentor Status */}
                                    {alumni.mentorship?.isMentor && (
                                        <div className="mb-3 p-2" style={{ background: '#dcfce7', borderRadius: 'var(--radius)' }}>
                                            <span className="text-sm" style={{ color: 'var(--success)' }}>✓ Available for Mentorship</span>
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleConnect(alumni._id, `${alumni.firstName || ''} ${alumni.lastName || ''}`.trim() || alumni.name || 'Alumni')}
                                            className={connectionRequests.has(alumni._id) ? "btn btn-outline" : "btn btn-primary"}
                                            style={{ flex: 1, padding: '0.5rem', fontSize: '0.875rem' }}
                                        >
                                            <UserPlus size={16} /> {connectionRequests.has(alumni._id) ? 'Cancel' : 'Connect'}
                                        </button>
                                        {alumni.profile?.linkedIn ? (
                                            <a
                                                href={alumni.profile.linkedIn}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn btn-outline"
                                                style={{ padding: '0.5rem' }}
                                            >
                                                <Linkedin size={16} />
                                            </a>
                                        ) : (
                                            <button
                                                onClick={() => alert(`${alumni.firstName} ${alumni.lastName} has not shared their LinkedIn profile yet.`)}
                                                className="btn btn-outline"
                                                style={{ padding: '0.5rem' }}
                                            >
                                                <Linkedin size={16} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-3 text-center py-20 card">
                                <h3 className="h3">No alumni found</h3>
                                <p className="text-muted">Try adjusting your filters or search terms.</p>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
