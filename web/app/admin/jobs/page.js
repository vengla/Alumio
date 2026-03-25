'use client';
import { useState, useEffect } from 'react';
import { Briefcase, Users, MapPin, DollarSign, Calendar, Trash2, Eye, Building } from 'lucide-react';
import { api } from '../../lib/api';

export default function AdminJobsPage() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, applications: 0 });
    const [selectedJob, setSelectedJob] = useState(null);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const response = await api.get('/jobs');
            const jobsData = response.data || [];
            setJobs(jobsData);

            // Calculate stats
            let totalApplications = 0;
            jobsData.forEach(job => {
                totalApplications += job.applicants?.length || 0;
            });

            setStats({
                total: jobsData.length,
                applications: totalApplications
            });
        } catch (error) {
            console.error('Failed to fetch jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (jobId) => {
        if (!confirm('Are you sure you want to delete this job posting?')) return;

        try {
            await api.delete(`/jobs/${jobId}`);
            alert('Job deleted successfully');
            fetchJobs(); // Refresh list
        } catch (error) {
            alert('Failed to delete job: ' + (error.response?.data?.message || error.message));
        }
    };

    const viewApplicants = (job) => {
        setSelectedJob(job);
    };

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', background: 'var(--bg-body)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="text-center">
                    <Briefcase className="animate-pulse" size={48} style={{ margin: '0 auto 1rem', color: 'var(--primary)' }} />
                    <p className="text-muted">Loading jobs...</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-body)' }}>
            <header className="glass" style={{ borderBottom: '1px solid var(--border-light)', padding: '1rem 0' }}>
                <div className="container flex items-center justify-between">
                    <div>
                        <h1 className="h2" style={{ margin: 0 }}>Manage Jobs</h1>
                        <p className="text-muted text-sm" style={{ marginTop: '0.25rem' }}>
                            Monitor and manage all job postings
                        </p>
                    </div>
                    <a href="/admin" className="btn btn-outline">← Back to Admin</a>
                </div>
            </header>

            <main className="container py-8">
                {/* Stats Overview */}
                <div className="grid grid-cols-3 mb-8">
                    <div className="card" style={{ borderLeft: '4px solid #3b82f6' }}>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-muted">Total Job Posts</span>
                            <Briefcase size={24} style={{ color: '#3b82f6' }} />
                        </div>
                        <div className="h2" style={{ margin: 0, color: '#3b82f6' }}>{stats.total}</div>
                    </div>
                    <div className="card" style={{ borderLeft: '4px solid #10b981' }}>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-muted">Total Applications</span>
                            <Users size={24} style={{ color: '#10b981' }} />
                        </div>
                        <div className="h2" style={{ margin: 0, color: '#10b981' }}>{stats.applications}</div>
                    </div>
                    <div className="card" style={{ borderLeft: '4px solid #f59e0b' }}>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-muted">Avg Applications/Job</span>
                            <Users size={24} style={{ color: '#f59e0b' }} />
                        </div>
                        <div className="h2" style={{ margin: 0, color: '#f59e0b' }}>
                            {stats.total > 0 ? Math.round(stats.applications / stats.total) : 0}
                        </div>
                    </div>
                </div>

                {/* Jobs List */}
                <div className="card">
                    <h3 className="h3 mb-4">All Job Listings ({jobs.length})</h3>

                    {jobs.length === 0 ? (
                        <div className="text-center py-8 text-muted">
                            <Briefcase size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                            <p>No job postings yet</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {jobs.map((job) => (
                                <div
                                    key={job._id}
                                    className="card"
                                    style={{
                                        background: 'var(--bg-subtle)',
                                        border: '1px solid var(--border-light)'
                                    }}
                                >
                                    <div className="flex items-start justify-between">
                                        <div style={{ flex: 1 }}>
                                            <div className="flex items-start gap-3 mb-3">
                                                <div style={{
                                                    width: '48px',
                                                    height: '48px',
                                                    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                                                    borderRadius: 'var(--radius)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: 'white',
                                                    fontWeight: 'bold'
                                                }}>
                                                    <Building size={24} />
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <h4 className="h4" style={{ margin: '0 0 0.25rem 0' }}>
                                                        {job.title}
                                                    </h4>
                                                    <div className="flex items-center gap-3 text-sm text-muted mb-2">
                                                        <span className="flex items-center gap-1">
                                                            <Building size={14} />
                                                            {job.company}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <MapPin size={14} />
                                                            {job.location}
                                                        </span>
                                                        {job.salary && (
                                                            <span className="flex items-center gap-1">
                                                                <DollarSign size={14} />
                                                                {job.salary}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="badge">{job.type}</span>
                                                        <span className="badge badge-primary">
                                                            {job.applicants?.length || 0} Applicants
                                                        </span>
                                                    </div>
                                                    <p className="text-sm" style={{
                                                        margin: '0.5rem 0',
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: 'vertical',
                                                        overflow: 'hidden'
                                                    }}>
                                                        {job.description}
                                                    </p>
                                                    <div className="flex items-center gap-2 text-sm text-muted">
                                                        <Calendar size={14} />
                                                        Posted by <strong>{job.postedBy?.name || 'Alumni'}</strong>
                                                        {job.createdAt && (
                                                            <> on {new Date(job.createdAt).toLocaleDateString()}</>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2">
                                            {job.applicants?.length > 0 && (
                                                <button
                                                    onClick={() => viewApplicants(job)}
                                                    className="btn btn-primary"
                                                    style={{ padding: '0.5rem 1rem' }}
                                                >
                                                    <Eye size={16} /> View Applicants
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDelete(job._id)}
                                                className="btn"
                                                style={{
                                                    padding: '0.5rem 1rem',
                                                    background: 'var(--danger)',
                                                    color: 'white'
                                                }}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Applicants Modal */}
            {selectedJob && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                        padding: '2rem'
                    }}
                    onClick={() => setSelectedJob(null)}
                >
                    <div
                        className="card"
                        style={{ maxWidth: '600px', width: '100%', maxHeight: '80vh', overflow: 'auto' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="h3" style={{ margin: 0 }}>
                                Applicants for {selectedJob.title}
                            </h3>
                            <button
                                onClick={() => setSelectedJob(null)}
                                className="btn btn-outline"
                                style={{ padding: '0.5rem 1rem' }}
                            >
                                Close
                            </button>
                        </div>

                        <div className="flex flex-col gap-3">
                            {selectedJob.applicants?.length > 0 ? (
                                selectedJob.applicants.map((applicant, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center justify-between p-3"
                                        style={{
                                            background: 'var(--bg-subtle)',
                                            borderRadius: 'var(--radius)'
                                        }}
                                    >
                                        <div>
                                            <div style={{ fontWeight: 600 }}>{applicant.name}</div>
                                            <div className="text-sm text-muted">{applicant.email}</div>
                                            {applicant.appliedAt && (
                                                <div className="text-sm text-muted">
                                                    Applied: {new Date(applicant.appliedAt).toLocaleDateString()}
                                                </div>
                                            )}
                                        </div>
                                        <span className="badge badge-primary">Applied</span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-muted text-center py-4">No applicants yet</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
