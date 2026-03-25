'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthProvider';
import { Briefcase, MapPin, DollarSign, Clock, Building, Plus, Loader2, X, Check, CheckCircle } from 'lucide-react';
import { api } from '../lib/api';

const formatSalary = (salary) => {
    if (!salary) return 'Competitive';
    if (typeof salary === 'string') return salary;
    if (typeof salary === 'object') {
        const { min, max, currency, period } = salary;
        const curr = currency || '$';
        const p = period ? ` / ${period}` : '';
        if (min && max) return `${curr}${min.toLocaleString()} - ${curr}${max.toLocaleString()}${p}`;
        if (min) return `From ${curr}${min.toLocaleString()}${p}`;
        if (max) return `Up to ${curr}${max.toLocaleString()}${p}`;
    }
    return 'Competitive';
};

export default function JobsPage() {
    const { user } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [modalJob, setModalJob] = useState(null); // For View Details

    const [applicantsModal, setApplicantsModal] = useState({ open: false, job: null });
    const [applyModal, setApplyModal] = useState({ open: false, job: null, success: false, loading: false });

    const fetchJobs = async () => {
        setLoading(true);
        try {
            const query = filter === 'all' ? '' : `?type=${filter}`;
            const data = await api.get(`/jobs${query}`);
            setJobs(data.data);
        } catch (error) {
            console.error('Failed to fetch jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) fetchJobs();
    }, [filter, user]);

    const handleApply = async (jobId, isApplied) => {
        const action = isApplied ? 'cancel' : 'apply';
        try {
            const res = await api.post('/jobs/apply', { jobId, action });
            if (res.success) {
                setJobs(prev => prev.map(j => {
                    if (j._id === jobId) return res.data;
                    return j;
                }));
                return true; // Return success status
            }
        } catch (error) {
            alert('Action failed: ' + error.message);
            return false;
        }
    };

    const openApplyModal = (job) => {
        setApplyModal({ open: true, job, success: false, loading: false });
    };

    const confirmApply = async () => {
        if (!applyModal.job) return;
        setApplyModal(prev => ({ ...prev, loading: true }));

        const success = await handleApply(applyModal.job._id, false);

        if (success) {
            setApplyModal(prev => ({ ...prev, loading: false, success: true }));
        } else {
            setApplyModal(prev => ({ ...prev, loading: false }));
        }
    };

    if (!user) return <div className="p-10 text-center">Loading...</div>;

    const canPostJob = user.role === 'alumni' || user.role === 'admin';

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-body)' }}>
            <header className="glass" style={{ borderBottom: '1px solid var(--border-light)', padding: '1rem 0' }}>
                <div className="container flex items-center justify-between">
                    <h1 className="h2" style={{ margin: 0 }}>Job & Internship Portal</h1>
                    <div className="flex gap-3">
                        {canPostJob && (
                            <a href="/jobs/create" className="btn btn-primary">
                                <Plus size={18} /> Post a Job
                            </a>
                        )}
                        <a href="/dashboard" className="btn btn-outline">← Dashboard</a>
                    </div>
                </div>
            </header>

            <main className="container py-8">
                {/* Filters */}
                <div className="flex gap-3 mb-6">
                    {['all', 'full-time', 'internship', 'remote'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={filter === f ? 'btn btn-primary' : 'btn btn-outline'}
                            style={{ textTransform: 'capitalize' }}
                        >
                            {f === 'all' ? 'All Jobs' : f}
                        </button>
                    ))}
                </div>

                {/* Job Listings */}
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '100px 0' }}>
                        <Loader2 className="animate-spin" size={48} color="var(--primary)" />
                        <p className="mt-4 text-muted">Loading job listings...</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {jobs.length > 0 ? (
                            jobs.map(job => {
                                const isApplied = job.applicants?.some(a => a.userId === user.id);
                                return (
                                    <div key={job._id} className="card" style={{ cursor: 'pointer' }}>
                                        <div className="flex justify-between items-start">
                                            <div style={{ flex: 1 }}>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="h3" style={{ margin: 0 }}>{job.title}</h3>
                                                    {isApplied && <span className="badge badge-success flex items-center gap-1"><CheckCircle size={12} /> Applied</span>}
                                                </div>

                                                <div className="flex items-center gap-4 mb-3">
                                                    <div className="flex items-center gap-2 text-muted">
                                                        <Building size={16} />
                                                        <span>{job.company}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-muted">
                                                        <MapPin size={16} />
                                                        <span>{job.location}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-muted">
                                                        <DollarSign size={16} />
                                                        <span>{formatSalary(job.salary)}</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <span className="badge badge-primary">{job.type}</span>
                                                    <span className="text-sm text-muted">Posted by <strong>{job.postedBy?.name || 'Alumni'}</strong></span>
                                                    {user.role === 'admin' && <span className="text-sm text-muted">{job.applicants?.length || 0} applicants</span>}
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-2" style={{ minWidth: '150px' }}>
                                                {user.role === 'admin' ? (
                                                    <button
                                                        className="btn btn-outline"
                                                        onClick={() => setApplicantsModal({ open: true, job })}
                                                    >
                                                        View Applicants
                                                    </button>
                                                ) : (
                                                    isApplied ? (
                                                        <button
                                                            className="btn"
                                                            style={{ background: '#fee2e2', color: '#ef4444', border: '1px solid #ef4444' }}
                                                            onClick={() => handleApply(job._id, true)}
                                                        >
                                                            Cancel Application
                                                        </button>
                                                    ) : (
                                                        <button
                                                            className="btn btn-primary"
                                                            onClick={() => openApplyModal(job)}
                                                        >
                                                            Apply Now
                                                        </button>
                                                    )
                                                )}
                                                <button
                                                    className="btn btn-outline"
                                                    onClick={() => setModalJob(job)}
                                                >
                                                    View Details
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-center py-20 card">
                                <h3 className="h3">No jobs found</h3>
                                <p className="text-muted">Try adjusting your filters or search terms.</p>
                            </div>
                        )}
                    </div>
                )
                }
            </main >

            {/* DETAILS MODAL */}
            {
                modalJob && (
                    <div style={modalOverlayStyle}>
                        <div className="card" style={{ width: '600px', maxHeight: '85vh', overflowY: 'auto' }}>
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h2 className="h2">{modalJob.title}</h2>
                                    <p className="h3 text-muted" style={{ fontSize: '1.1rem' }}>{modalJob.company}</p>
                                </div>
                                <button onClick={() => setModalJob(null)} className="btn-icon">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="flex gap-4 mb-6 text-sm text-muted">
                                <span className="flex items-center gap-1"><MapPin size={16} /> {modalJob.location}</span>
                                <span className="flex items-center gap-1"><Briefcase size={16} /> {modalJob.type}</span>
                                <span className="flex items-center gap-1"><DollarSign size={16} /> {formatSalary(modalJob.salary)}</span>
                            </div>

                            <div className="mb-6">
                                <h4 className="h4 mb-2">Description</h4>
                                <p className="text-muted" style={{ lineHeight: 1.6 }}>{modalJob.description}</p>
                            </div>

                            <div className="mb-6">
                                <h4 className="h4 mb-2">Requirements</h4>
                                <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem' }} className="text-muted">
                                    <li>Bachelor's degree in related field</li>
                                    <li>2+ years of experience</li>
                                    <li>Strong communication skills</li>
                                </ul>
                            </div>

                            <div className="flex justify-end gap-3 mt-4 pt-4 border-t">
                                <button className="btn btn-outline" onClick={() => setModalJob(null)}>Close</button>
                                {user.role !== 'admin' && !modalJob.applicants?.some(a => a.userId === user.id) && (
                                    <button className="btn btn-primary" onClick={() => {
                                        setModalJob(null);
                                        openApplyModal(modalJob);
                                    }}>Apply Now</button>
                                )}
                            </div>
                        </div>
                    </div>
                )
            }

            {/* APPLICANTS MODAL (ADMIN ONLY) */}
            {
                applicantsModal.open && (
                    <div style={modalOverlayStyle}>
                        <div className="card" style={{ width: '600px', maxHeight: '80vh', overflowY: 'auto' }}>
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="h3" style={{ margin: 0 }}>
                                    Applicants: {applicantsModal.job.title}
                                </h3>
                                <button onClick={() => setApplicantsModal({ open: false, job: null })} className="btn-icon">
                                    <X size={20} />
                                </button>
                            </div>

                            {applicantsModal.job.applicants?.length > 0 ? (
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ background: 'var(--bg-subtle)', textAlign: 'left' }}>
                                            <th className="p-3 text-sm">Name</th>
                                            <th className="p-3 text-sm">Email</th>
                                            <th className="p-3 text-sm">Applied At</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {applicantsModal.job.applicants.map((app, idx) => (
                                            <tr key={idx} style={{ borderBottom: '1px solid var(--border-light)' }}>
                                                <td className="p-3 font-medium">{app.name}</td>
                                                <td className="p-3 text-sm text-muted">{app.email}</td>
                                                <td className="p-3 text-sm text-muted">
                                                    {new Date(app.appliedAt).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p className="text-muted text-center py-6">No applicants yet.</p>
                            )}
                        </div>
                    </div>
                )
            }
            {/* APPLY MODAL */}
            {
                applyModal.open && (
                    <div style={modalOverlayStyle}>
                        <div className="card" style={{ width: '500px', maxWidth: '90vw' }}>
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="h3" style={{ margin: 0 }}>
                                    {applyModal.success ? 'Application Sent' : 'Apply for Job'}
                                </h3>
                                {!applyModal.success && (
                                    <button onClick={() => setApplyModal({ ...applyModal, open: false })} className="btn-icon">
                                        <X size={20} />
                                    </button>
                                )}
                            </div>

                            {applyModal.success ? (
                                <div className="text-center py-6">
                                    <div className="flex justify-center mb-4">
                                        <div style={{ background: '#dcfce7', padding: '1rem', borderRadius: '50%' }}>
                                            <CheckCircle size={48} color="#16a34a" />
                                        </div>
                                    </div>
                                    <h4 className="h4 mb-2">Success!</h4>
                                    <p className="text-muted mb-6">You have successfully applied for <strong>{applyModal.job?.title}</strong> using your profile details.</p>
                                    <button
                                        className="btn btn-primary w-full"
                                        onClick={() => setApplyModal({ ...applyModal, open: false })}
                                    >
                                        Done
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <div className="mb-6 p-4" style={{ background: 'var(--bg-subtle)', borderRadius: '8px' }}>
                                        <h4 className="font-bold mb-1">{applyModal.job?.title}</h4>
                                        <p className="text-sm text-muted">{applyModal.job?.company}</p>
                                    </div>
                                    <p className="text-muted mb-6">
                                        Your full profile (resume, contact info, and experience) will be shared with the recruiter. Are you sure you want to apply?
                                    </p>
                                    <div className="flex gap-3 justify-end">
                                        <button
                                            className="btn btn-outline"
                                            onClick={() => setApplyModal({ ...applyModal, open: false })}
                                            disabled={applyModal.loading}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            className="btn btn-primary"
                                            onClick={confirmApply}
                                            disabled={applyModal.loading}
                                        >
                                            {applyModal.loading ? (
                                                <>
                                                    <Loader2 className="animate-spin" size={16} /> Sending...
                                                </>
                                            ) : (
                                                'Confirm Application'
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )
            }
        </div >
    );
}

const modalOverlayStyle = {
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
    backdropFilter: 'blur(4px)'
};

