'use client';
import { useState } from 'react';
import { Briefcase, Save, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CreateJobPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: '',
        company: '',
        location: '',
        type: 'full-time',
        category: 'software',
        description: '',
        requirements: '',
        skills: '',
        salaryMin: '',
        salaryMax: '',
        applicationDeadline: '',
        isRemote: false
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Job posting functionality will be connected to the backend in the next phase.');
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-body)' }}>
            <header className="glass" style={{ borderBottom: '1px solid var(--border-light)', padding: '1rem 0' }}>
                <div className="container flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Briefcase size={28} color="var(--primary)" />
                        <h1 className="h2" style={{ margin: 0 }}>Post a Job</h1>
                    </div>
                    <button onClick={() => router.push('/jobs')} className="btn btn-outline flex items-center gap-2">
                        <ArrowLeft size={18} /> Back
                    </button>
                </div>
            </header>

            <main className="container py-8">
                <div className="card" style={{ maxWidth: '900px', margin: '0 auto' }}>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="text-sm font-semibold mb-2 block">Job Title *</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                placeholder="e.g., Senior Software Engineer"
                                style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-light)', borderRadius: 'var(--radius)' }}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="text-sm font-semibold mb-2 block">Company *</label>
                                <input
                                    type="text"
                                    name="company"
                                    value={formData.company}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g., Google"
                                    style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-light)', borderRadius: 'var(--radius)' }}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-semibold mb-2 block">Location *</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g., Bangalore, India"
                                    style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-light)', borderRadius: 'var(--radius)' }}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="text-sm font-semibold mb-2 block">Job Type *</label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-light)', borderRadius: 'var(--radius)' }}
                                >
                                    <option value="full-time">Full-time</option>
                                    <option value="part-time">Part-time</option>
                                    <option value="internship">Internship</option>
                                    <option value="contract">Contract</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-semibold mb-2 block">Category *</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-light)', borderRadius: 'var(--radius)' }}
                                >
                                    <option value="software">Software</option>
                                    <option value="data-science">Data Science</option>
                                    <option value="design">Design</option>
                                    <option value="marketing">Marketing</option>
                                    <option value="finance">Finance</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="text-sm font-semibold mb-2 block">Job Description *</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                rows="5"
                                placeholder="Describe the role, responsibilities, and what makes this opportunity great..."
                                style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-light)', borderRadius: 'var(--radius)', fontFamily: 'inherit' }}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="text-sm font-semibold mb-2 block">Requirements</label>
                            <textarea
                                name="requirements"
                                value={formData.requirements}
                                onChange={handleChange}
                                rows="3"
                                placeholder="List the key requirements (one per line)"
                                style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-light)', borderRadius: 'var(--radius)', fontFamily: 'inherit' }}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="text-sm font-semibold mb-2 block">Skills</label>
                            <input
                                type="text"
                                name="skills"
                                value={formData.skills}
                                onChange={handleChange}
                                placeholder="e.g., React, Node.js, MongoDB (comma separated)"
                                style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-light)', borderRadius: 'var(--radius)' }}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="text-sm font-semibold mb-2 block">Salary Range (LPA)</label>
                                <div className="flex gap-2 items-center">
                                    <input
                                        type="number"
                                        name="salaryMin"
                                        value={formData.salaryMin}
                                        onChange={handleChange}
                                        placeholder="Min"
                                        style={{ flex: 1, padding: '0.75rem', border: '1px solid var(--border-light)', borderRadius: 'var(--radius)' }}
                                    />
                                    <span>-</span>
                                    <input
                                        type="number"
                                        name="salaryMax"
                                        value={formData.salaryMax}
                                        onChange={handleChange}
                                        placeholder="Max"
                                        style={{ flex: 1, padding: '0.75rem', border: '1px solid var(--border-light)', borderRadius: 'var(--radius)' }}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-semibold mb-2 block">Application Deadline *</label>
                                <input
                                    type="date"
                                    name="applicationDeadline"
                                    value={formData.applicationDeadline}
                                    onChange={handleChange}
                                    required
                                    style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-light)', borderRadius: 'var(--radius)' }}
                                />
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    name="isRemote"
                                    checked={formData.isRemote}
                                    onChange={handleChange}
                                />
                                <span className="text-sm">Remote Position</span>
                            </label>
                        </div>

                        <div className="flex gap-3">
                            <button type="submit" className="btn btn-primary flex items-center gap-2">
                                <Save size={18} /> Post Job
                            </button>
                            <button type="button" onClick={() => router.push('/jobs')} className="btn btn-outline">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}
