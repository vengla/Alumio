'use client';
import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Briefcase, GraduationCap, Save, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../components/AuthProvider';

export default function ProfilePage() {
    const router = useRouter();
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        mobile: '',
        currentPosition: '',
        currentCompany: '',
        location: '',
        bio: '',
        linkedIn: '',
        github: '',
        // Student specific
        department: '',
        graduationYear: '',
        skills: '',
        interests: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || user.name?.split(' ')[0] || '',
                lastName: user.lastName || user.name?.split(' ')[1] || '',
                email: user.email || '',
                mobile: user.mobile || '',
                currentPosition: user.currentPosition || '',
                currentCompany: user.currentCompany || '',
                location: user.location || '',
                bio: user.bio || '',
                linkedIn: user.linkedIn || '',
                github: user.github || '',
                department: user.department || '',
                graduationYear: user.graduationYear || user.batch || '',
                skills: user.skills ? user.skills.join(', ') : '',
                interests: user.interests ? user.interests.join(', ') : ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // convert skills/interests back to array
        const updatedData = {
            ...formData,
            skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
            interests: formData.interests.split(',').map(s => s.trim()).filter(Boolean)
        };

        // Simulate Update
        const updatedUser = { ...user, ...updatedData, name: `${formData.firstName} ${formData.lastName}` };
        localStorage.setItem('user', JSON.stringify(updatedUser)); // Update session

        // Update in mock DB if possible (optional for now as session is key)
        try {
            // Try to assume we are just updating the session for this demo
        } catch (e) { }

        alert('Profile updated successfully!');
        window.location.reload();
    };

    if (!user) {
        return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;
    }

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-body)' }}>
            <header className="glass" style={{ borderBottom: '1px solid var(--border-light)', padding: '1rem 0' }}>
                <div className="container flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <User size={28} color="var(--primary)" />
                        <h1 className="h2" style={{ margin: 0 }}>My Profile</h1>
                    </div>
                    <button onClick={() => router.push('/dashboard')} className="btn btn-outline flex items-center gap-2">
                        <ArrowLeft size={18} /> Back
                    </button>
                </div>
            </header>

            <main className="container py-8">
                <div className="card" style={{ maxWidth: '900px', margin: '0 auto' }}>
                    {/* Profile Header */}
                    <div className="flex items-center gap-4 mb-6 pb-6" style={{ borderBottom: '1px solid var(--border-light)' }}>
                        <div style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '2rem',
                            fontWeight: 600
                        }}>
                            {formData.firstName?.[0]}{formData.lastName?.[0]}
                        </div>
                        <div>
                            <h2 className="h3" style={{ marginBottom: '0.25rem' }}>{formData.firstName} {formData.lastName}</h2>
                            <p className="text-muted">{user.role?.toUpperCase()} • {formData.department || 'General'}</p>
                            <span className="badge" style={{ marginTop: '0.5rem' }}>{formData.graduationYear || 'Batch N/A'}</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <h3 className="h4 mb-4">Personal Information</h3>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="text-sm font-semibold mb-2 block">First Name *</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                    style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-light)', borderRadius: 'var(--radius)' }}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-semibold mb-2 block">Last Name *</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                    style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-light)', borderRadius: 'var(--radius)' }}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="text-sm font-semibold mb-2 block flex items-center gap-2">
                                    <Mail size={16} /> Email *
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    disabled
                                    style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-light)', borderRadius: 'var(--radius)', background: 'var(--bg-subtle)' }}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-semibold mb-2 block flex items-center gap-2">
                                    <Phone size={16} /> Mobile
                                </label>
                                <input
                                    type="tel"
                                    name="mobile"
                                    value={formData.mobile}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-light)', borderRadius: 'var(--radius)' }}
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="text-sm font-semibold mb-2 block flex items-center gap-2">
                                <MapPin size={16} /> Location
                            </label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="e.g., Bangalore, India"
                                style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-light)', borderRadius: 'var(--radius)' }}
                            />
                        </div>

                        {user.role === 'student' ? (
                            <>
                                <h3 className="h4 mb-4 mt-6">Academic Information</h3>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="text-sm font-semibold mb-2 block">Department</label>
                                        <select
                                            name="department"
                                            value={formData.department}
                                            onChange={handleChange}
                                            style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-light)', borderRadius: 'var(--radius)' }}
                                        >
                                            <option value="">Select Department</option>
                                            <option>Computer Science</option>
                                            <option>Electrical Engineering</option>
                                            <option>Mechanical Engineering</option>
                                            <option>Civil Engineering</option>
                                            <option>Electronics & Communication</option>
                                            <option>Agricultural Engineering</option>
                                            <option>Artificial Intelligence and Data Science</option>
                                            <option>Cyber Security</option>
                                            <option>Information Technology</option>
                                            <option>Medical Electronics</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-sm font-semibold mb-2 block">Graduation Year</label>
                                        <input
                                            type="text"
                                            name="graduationYear"
                                            value={formData.graduationYear}
                                            onChange={handleChange}
                                            placeholder="e.g., 2026"
                                            style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-light)', borderRadius: 'var(--radius)' }}
                                        />
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="text-sm font-semibold mb-2 block">Skills (comma separated)</label>
                                    <input
                                        type="text"
                                        name="skills"
                                        value={formData.skills}
                                        onChange={handleChange}
                                        placeholder="React, Python, Node.js"
                                        style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-light)', borderRadius: 'var(--radius)' }}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="text-sm font-semibold mb-2 block">Interests (comma separated)</label>
                                    <input
                                        type="text"
                                        name="interests"
                                        value={formData.interests}
                                        onChange={handleChange}
                                        placeholder="AI, Web Dev, Robotics"
                                        style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-light)', borderRadius: 'var(--radius)' }}
                                    />
                                </div>
                            </>
                        ) : (
                            <>
                                <h3 className="h4 mb-4 mt-6">Professional Information</h3>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="text-sm font-semibold mb-2 block flex items-center gap-2">
                                            <Briefcase size={16} /> Current Position
                                        </label>
                                        <input
                                            type="text"
                                            name="currentPosition"
                                            value={formData.currentPosition}
                                            onChange={handleChange}
                                            placeholder="e.g., Senior Software Engineer"
                                            style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-light)', borderRadius: 'var(--radius)' }}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-semibold mb-2 block flex items-center gap-2">
                                            <GraduationCap size={16} /> Current Company
                                        </label>
                                        <input
                                            type="text"
                                            name="currentCompany"
                                            value={formData.currentCompany}
                                            onChange={handleChange}
                                            placeholder="e.g., Google"
                                            style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-light)', borderRadius: 'var(--radius)' }}
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        <div className="mb-4">
                            <label className="text-sm font-semibold mb-2 block">Bio</label>
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                rows="4"
                                placeholder="Tell others about yourself..."
                                style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-light)', borderRadius: 'var(--radius)', fontFamily: 'inherit' }}
                            />
                        </div>

                        <h3 className="h4 mb-4 mt-6">Social Links</h3>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className="text-sm font-semibold mb-2 block">LinkedIn</label>
                                <input
                                    type="url"
                                    name="linkedIn"
                                    value={formData.linkedIn}
                                    onChange={handleChange}
                                    placeholder="https://linkedin.com/in/username"
                                    style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-light)', borderRadius: 'var(--radius)' }}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-semibold mb-2 block">GitHub</label>
                                <input
                                    type="url"
                                    name="github"
                                    value={formData.github}
                                    onChange={handleChange}
                                    placeholder="https://github.com/username"
                                    style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-light)', borderRadius: 'var(--radius)' }}
                                />
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button type="submit" className="btn btn-primary flex items-center gap-2">
                                <Save size={18} /> Save Changes
                            </button>
                            <button type="button" onClick={() => router.push('/dashboard')} className="btn btn-outline">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}
