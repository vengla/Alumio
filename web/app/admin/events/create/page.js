'use client';
import { Calendar, Save } from 'lucide-react';
import { useState } from 'react';

export default function CreateEventPage() {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: 'workshop',
        startDate: '',
        endDate: '',
        venue: '',
        capacity: '',
        isFree: true
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
        alert('Event creation functionality will be connected to the backend in the next phase.');
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-body)' }}>
            <header className="glass" style={{ borderBottom: '1px solid var(--border-light)', padding: '1rem 0' }}>
                <div className="container flex items-center justify-between">
                    <h1 className="h2" style={{ margin: 0 }}>Create New Event</h1>
                    <a href="/admin" className="btn btn-outline">← Back to Admin</a>
                </div>
            </header>

            <main className="container py-8">
                <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="text-sm font-semibold mb-2 block">Event Title</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                placeholder="e.g., Annual Alumni Meet 2026"
                                style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-light)', borderRadius: 'var(--radius)' }}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="text-sm font-semibold mb-2 block">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                rows="4"
                                placeholder="Describe the event..."
                                style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-light)', borderRadius: 'var(--radius)', fontFamily: 'inherit' }}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="text-sm font-semibold mb-2 block">Event Type</label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-light)', borderRadius: 'var(--radius)' }}
                                >
                                    <option value="reunion">Reunion</option>
                                    <option value="workshop">Workshop</option>
                                    <option value="seminar">Seminar</option>
                                    <option value="networking">Networking</option>
                                    <option value="sports">Sports</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-semibold mb-2 block">Venue</label>
                                <input
                                    type="text"
                                    name="venue"
                                    value={formData.venue}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g., University Auditorium"
                                    style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-light)', borderRadius: 'var(--radius)' }}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="text-sm font-semibold mb-2 block">Start Date</label>
                                <input
                                    type="datetime-local"
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={handleChange}
                                    required
                                    style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-light)', borderRadius: 'var(--radius)' }}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-semibold mb-2 block">End Date</label>
                                <input
                                    type="datetime-local"
                                    name="endDate"
                                    value={formData.endDate}
                                    onChange={handleChange}
                                    required
                                    style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-light)', borderRadius: 'var(--radius)' }}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="text-sm font-semibold mb-2 block">Capacity</label>
                                <input
                                    type="number"
                                    name="capacity"
                                    value={formData.capacity}
                                    onChange={handleChange}
                                    placeholder="0 = Unlimited"
                                    style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-light)', borderRadius: 'var(--radius)' }}
                                />
                            </div>
                            <div className="flex items-center">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        name="isFree"
                                        checked={formData.isFree}
                                        onChange={handleChange}
                                    />
                                    <span className="text-sm">Free Event</span>
                                </label>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button type="submit" className="btn btn-primary flex items-center gap-2">
                                <Save size={18} /> Create Event
                            </button>
                            <a href="/admin" className="btn btn-outline">Cancel</a>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}
