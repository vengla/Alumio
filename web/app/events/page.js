'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthProvider';
import { Calendar, MapPin, Users, Clock, Plus, Loader2, X, Eye, FileText, CheckCircle } from 'lucide-react';
import { api } from '../lib/api';

export default function EventsPage() {
    const { user } = useAuth();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    // Modal States
    const [registrantsModal, setRegistrantsModal] = useState({ open: false, event: null });
    const [profileModal, setProfileModal] = useState({ open: false, user: null });
    const [detailsModal, setDetailsModal] = useState(null); // New Details Modal

    const [registerModal, setRegisterModal] = useState({ open: false, event: null, success: false, loading: false });
    const [createModal, setCreateModal] = useState(false);
    const [newEvent, setNewEvent] = useState({
        title: '',
        type: 'Workshop',
        startDate: '',
        location: '',
        description: '',
        department: 'General',
        capacity: 50
    });

    const handleCreate = async () => {
        if (!newEvent.title || !newEvent.startDate) {
            alert('Please fill in at least the Title and Date.');
            return;
        }
        try {
            // Assumes /events endpoint accepts POST
            await api.post('/events', newEvent);
            setCreateModal(false);
            fetchEvents();
            alert('Event created successfully!');
            setNewEvent({ title: '', type: 'Workshop', startDate: '', location: '', description: '', department: 'General', capacity: 50 });
        } catch (error) {
            console.error(error);
            alert('Failed to create event.');
        }
    };

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const query = filter === 'all' ? '' : `?type=${filter}`;
            const data = await api.get(`/events${query}`);
            let fetchedEvents = data.data || [];

            // Sort logic: Department priority for students
            if (user?.role === 'student' && user?.department) {
                fetchedEvents.sort((a, b) => {
                    // Current department comes first
                    const aIsDept = a.department === user.department;
                    const bIsDept = b.department === user.department;
                    if (aIsDept && !bIsDept) return -1;
                    if (!aIsDept && bIsDept) return 1;
                    // Then by date
                    return new Date(a.startDate) - new Date(b.startDate);
                });
            } else {
                // Default sort by date
                fetchedEvents.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
            }

            setEvents(fetchedEvents);
        } catch (error) {
            console.error('Failed to fetch events:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) fetchEvents();
    }, [filter, user]);

    const handleRegistration = async (eventId, isRegistered) => {
        const action = isRegistered ? 'cancel' : 'register';
        try {
            const res = await api.post('/events/register', { eventId, action });
            if (res.success) {
                // Refresh local state without full reload for speed
                setEvents(prev => prev.map(e => {
                    if (e._id === eventId) {
                        if (detailsModal && detailsModal._id === eventId) {
                            setDetailsModal(res.data);
                        }
                        return res.data;
                    }
                    return e;
                }));
                return true;
            }
        } catch (error) {
            alert('Action failed: ' + error.message);
            return false;
        }
    };

    const openRegisterModal = (event) => {
        setRegisterModal({ open: true, event, success: false, loading: false });
    };

    const confirmRegister = async () => {
        if (!registerModal.event) return;
        setRegisterModal(prev => ({ ...prev, loading: true }));

        const success = await handleRegistration(registerModal.event._id, false);

        if (success) {
            setRegisterModal(prev => ({ ...prev, loading: false, success: true }));
        } else {
            setRegisterModal(prev => ({ ...prev, loading: false }));
        }
    };

    if (!user) return <div className="p-10 text-center">Loading user profile...</div>;

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-body)' }}>
            <header className="glass" style={{ borderBottom: '1px solid var(--border-light)', padding: '1rem 0' }}>
                <div className="container flex items-center justify-between">
                    <div>
                        <h1 className="h2" style={{ margin: 0 }}>Events & Workshops</h1>
                        {user.role === 'student' && <span className="text-sm text-muted">Prioritized for {user.department} Department</span>}
                    </div>

                    <div className="flex gap-3">
                        {user.role === 'admin' && (
                            <button className="btn btn-primary" onClick={() => setCreateModal(true)}>
                                <Plus size={18} /> Create Event
                            </button>
                        )}
                        <a href="/dashboard" className="btn btn-outline">← Dashboard</a>
                    </div>
                </div>
            </header>

            <main className="container py-8">
                {/* Filters */}
                <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
                    {['all', 'Reunion', 'Workshop', 'Networking', 'Sports'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={filter === f ? 'btn btn-primary' : 'btn btn-outline'}
                        >
                            {f === 'all' ? 'All Events' : f}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '100px 0' }}>
                        <Loader2 className="animate-spin" size={48} color="var(--primary)" />
                    </div>
                ) : (
                    <div className="flex flex-col gap-6">
                        {events.length > 0 ? (
                            events.map(event => {
                                const isRegistered = event.attendees?.some(a => a.userId === user.id);
                                const isDepartmentMatch = user.role === 'student' && event.department === user.department;

                                return (
                                    <div key={event._id} className="card relative" style={{
                                        borderLeft: isDepartmentMatch ? '4px solid var(--primary)' : 'none',
                                        background: isDepartmentMatch ? 'linear-gradient(to right, rgba(37, 99, 235, 0.05), transparent)' : 'white'
                                    }}>
                                        {isDepartmentMatch && (
                                            <span className="badge badge-primary absolute top-4 right-4">
                                                Recommended for You
                                            </span>
                                        )}

                                        <div className="flex justify-between items-start md:flex-row flex-col gap-6">
                                            <div style={{ flex: 1 }}>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="h3" style={{ margin: 0 }}>{event.title}</h3>
                                                    <span className="badge">{event.type}</span>
                                                </div>

                                                <p className="text-muted mb-4">{event.description}</p>

                                                <div className="flex flex-wrap gap-6 mb-3">
                                                    <div className="flex items-center gap-2 text-sm text-muted">
                                                        <Calendar size={16} />
                                                        <span>{new Date(event.startDate).toLocaleDateString()}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-muted">
                                                        <Clock size={16} />
                                                        <span>{new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-muted">
                                                        <MapPin size={16} />
                                                        <span>{event.venue || event.address || 'Online'}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-muted">
                                                        <Users size={16} />
                                                        <span>{event.attendees?.length || 0} / {event.capacity} registered</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-3" style={{ minWidth: '200px' }}>
                                                {/* ADMIN CONTROLS */}
                                                {user.role === 'admin' ? (
                                                    <button
                                                        className="btn btn-outline flex justify-center items-center gap-2"
                                                        onClick={() => setRegistrantsModal({ open: true, event })}
                                                    >
                                                        <Users size={18} /> View Registrants
                                                    </button>
                                                ) : (
                                                    /* STUDENT/ALUMNI CONTROLS */
                                                    <>
                                                        {isRegistered ? (
                                                            <button
                                                                className="btn"
                                                                style={{
                                                                    background: '#fee2e2',
                                                                    color: '#ef4444',
                                                                    border: '1px solid #ef4444'
                                                                }}
                                                                onClick={() => handleRegistration(event._id, true)}
                                                            >
                                                                Cancel Registration
                                                            </button>
                                                        ) : (
                                                            <button
                                                                className="btn btn-primary"
                                                                onClick={() => openRegisterModal(event)}
                                                            >
                                                                Register Now
                                                            </button>
                                                        )}
                                                        <button
                                                            className="btn btn-outline"
                                                            style={{ marginTop: '0.5rem' }}
                                                            onClick={() => setDetailsModal(event)}
                                                        >
                                                            View Details
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-center py-20 card">
                                <h3 className="h3">No events found</h3>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* --- DETAILS MODAL --- */}
            {detailsModal && (
                <div style={modalOverlayStyle}>
                    <div className="card" style={{ width: '600px', maxHeight: '80vh', overflowY: 'auto' }}>
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h2 className="h2" style={{ margin: 0 }}>{detailsModal.title}</h2>
                                <span className="badge badge-primary mt-2">{detailsModal.type}</span>
                            </div>
                            <button onClick={() => setDetailsModal(null)} className="btn-icon">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="flex items-center gap-2 text-muted">
                                <Calendar size={18} />
                                <span>{new Date(detailsModal.startDate).toDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted">
                                <Clock size={18} />
                                <span>{new Date(detailsModal.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted">
                                <MapPin size={18} />
                                <span>{detailsModal.venue || detailsModal.address || 'Online'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted">
                                <Users size={18} />
                                <span>{detailsModal.attendees?.length || 0} Attendees</span>
                            </div>
                        </div>

                        <div className="mb-6">
                            <h4 className="h4 mb-2">About Event</h4>
                            <p className="text-muted" style={{ lineHeight: 1.6 }}>{detailsModal.description}</p>
                            <p className="text-muted mt-2">
                                Join us for this exciting event organized by the <strong>{detailsModal.department}</strong> department.
                                It's a great opportunity to network and learn.
                            </p>
                        </div>

                        <div className="flex justify-end gap-3 mt-4 pt-4 border-t">
                            <button className="btn btn-outline" onClick={() => setDetailsModal(null)}>Close</button>
                            {user.role !== 'admin' && (
                                detailsModal.attendees?.some(a => a.userId === user.id) ? (
                                    <button
                                        className="btn"
                                        style={{ background: '#fee2e2', color: '#ef4444', border: '1px solid #ef4444' }}
                                        onClick={() => handleRegistration(detailsModal._id, true)}
                                    >
                                        Cancel Registration
                                    </button>
                                ) : (
                                    <button className="btn btn-primary" onClick={() => {
                                        setDetailsModal(null);
                                        openRegisterModal(detailsModal);
                                    }}>Register Now</button>
                                )
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* --- REGISTRANTS MODAL (ADMIN ONLY) --- */}
            {registrantsModal.open && (
                <div style={modalOverlayStyle}>
                    <div className="card" style={{ width: '600px', maxHeight: '80vh', overflowY: 'auto' }}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="h3" style={{ margin: 0 }}>
                                Registrants: {registrantsModal.event.title}
                            </h3>
                            <button onClick={() => setRegistrantsModal({ open: false, event: null })} className="btn-icon">
                                <X size={20} />
                            </button>
                        </div>

                        {registrantsModal.event.attendees?.length > 0 ? (
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ background: 'var(--bg-subtle)', textAlign: 'left' }}>
                                        <th className="p-3 text-sm">Name</th>
                                        <th className="p-3 text-sm">Email</th>
                                        <th className="p-3 text-sm">Dept</th>
                                        <th className="p-3 text-sm">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {registrantsModal.event.attendees.map((attendee, idx) => (
                                        <tr key={idx} style={{ borderBottom: '1px solid var(--border-light)' }}>
                                            <td className="p-3 font-medium">{attendee.name}</td>
                                            <td className="p-3 text-sm text-muted">{attendee.email}</td>
                                            <td className="p-3 text-sm">{attendee.department}</td>
                                            <td className="p-3">
                                                <button
                                                    className="text-primary hover:underline text-sm flex items-center gap-1"
                                                    onClick={() => setProfileModal({ open: true, user: attendee })}
                                                >
                                                    <FileText size={14} /> View Profile
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="text-muted text-center py-6">No registrations yet.</p>
                        )}
                    </div>
                </div>
            )}

            {/* --- USER PROFILE MODAL (ADMIN ONLY) --- */}
            {profileModal.open && (
                <div style={{ ...modalOverlayStyle, zIndex: 1001 }}>
                    <div className="card" style={{ width: '400px' }}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="h3" style={{ margin: 0 }}>Full Profile</h3>
                            <button onClick={() => setProfileModal({ open: false, user: null })} className="btn-icon">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex flex-col items-center mb-6">
                            <div style={{
                                width: '80px', height: '80px',
                                background: 'var(--primary)',
                                borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: 'white', fontSize: '2rem', fontWeight: 'bold'
                            }}>
                                {profileModal.user.name.charAt(0)}
                            </div>
                            <h2 className="h3 mt-3">{profileModal.user.name}</h2>
                            <span className="badge badge-primary">{profileModal.user.department}</span>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between p-3 bg-gray-50 rounded">
                                <span className="text-muted text-sm">Email</span>
                                <span className="font-medium text-sm">{profileModal.user.email}</span>
                            </div>
                            <div className="flex justify-between p-3 bg-gray-50 rounded">
                                <span className="text-muted text-sm">Registered At</span>
                                <span className="font-medium text-sm">
                                    {new Date().toLocaleDateString()}
                                </span>
                            </div>
                            <div className="flex justify-between p-3 bg-gray-50 rounded">
                                <span className="text-muted text-sm">Status</span>
                                <span className="text-green-600 font-medium text-sm">Active & Verified</span>
                            </div>
                        </div>

                        <button
                            className="btn btn-outline w-full mt-6"
                            onClick={() => setProfileModal({ open: false, user: null })}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* --- REGISTER MODAL --- */}
            {registerModal.open && (
                <div style={modalOverlayStyle}>
                    <div className="card" style={{ width: '500px', maxWidth: '90vw' }}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="h3" style={{ margin: 0 }}>
                                {registerModal.success ? 'Registration Successful' : 'Register for Event'}
                            </h3>
                            {!registerModal.success && (
                                <button onClick={() => setRegisterModal({ ...registerModal, open: false })} className="btn-icon">
                                    <X size={20} />
                                </button>
                            )}
                        </div>

                        {registerModal.success ? (
                            <div className="text-center py-6">
                                <div className="flex justify-center mb-4">
                                    <div style={{ background: '#dcfce7', padding: '1rem', borderRadius: '50%' }}>
                                        <CheckCircle size={48} color="#16a34a" />
                                    </div>
                                </div>
                                <h4 className="h4 mb-2">You're All Set!</h4>
                                <p className="text-muted mb-6">You have successfully registered for <strong>{registerModal.event?.title}</strong>. We've sent a confirmation email.</p>
                                <button
                                    className="btn btn-primary w-full"
                                    onClick={() => setRegisterModal({ ...registerModal, open: false })}
                                >
                                    Done
                                </button>
                            </div>
                        ) : (
                            <div>
                                <div className="mb-6 p-4" style={{ background: 'var(--bg-subtle)', borderRadius: '8px' }}>
                                    <h4 className="font-bold mb-1">{registerModal.event?.title}</h4>
                                    <div className="flex items-center gap-2 text-sm text-muted mt-1">
                                        <Calendar size={14} />
                                        {registerModal.event?.startDate && new Date(registerModal.event.startDate).toLocaleDateString()}
                                    </div>
                                </div>
                                <p className="text-muted mb-6">
                                    Are you sure you want to register for this event? Your attendance will be confirmed immediately.
                                </p>
                                <div className="flex gap-3 justify-end">
                                    <button
                                        className="btn btn-outline"
                                        onClick={() => setRegisterModal({ ...registerModal, open: false })}
                                        disabled={registerModal.loading}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="btn btn-primary"
                                        onClick={confirmRegister}
                                        disabled={registerModal.loading}
                                    >
                                        {registerModal.loading ? (
                                            <>
                                                <Loader2 className="animate-spin" size={16} /> Registering...
                                            </>
                                        ) : (
                                            'Confirm Registration'
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* --- CREATE EVENT MODAL (ADMIN ONLY) --- */}
            {createModal && (
                <div style={modalOverlayStyle}>
                    <div className="card" style={{ width: '600px', maxHeight: '90vw' }}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="h3" style={{ margin: 0 }}>Create New Event</h3>
                            <button onClick={() => setCreateModal(false)} className="btn-icon">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="text-sm font-semibold mb-2 block">Event Title *</label>
                                <input
                                    type="text"
                                    value={newEvent.title}
                                    onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
                                    className="w-full p-2 border rounded"
                                    placeholder="Ex: Alumni Meet 2026"
                                    style={{ border: '1px solid var(--border-light)', borderRadius: 'var(--radius)', padding: '0.75rem', width: '100%' }}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-semibold mb-2 block">Event Type</label>
                                <select
                                    value={newEvent.type}
                                    onChange={e => setNewEvent({ ...newEvent, type: e.target.value })}
                                    style={{ border: '1px solid var(--border-light)', borderRadius: 'var(--radius)', padding: '0.75rem', width: '100%' }}
                                >
                                    <option>Workshop</option>
                                    <option>Reunion</option>
                                    <option>Networking</option>
                                    <option>Sports</option>
                                    <option>Seminar</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="text-sm font-semibold mb-2 block">Date & Time *</label>
                                <input
                                    type="datetime-local"
                                    value={newEvent.startDate}
                                    onChange={e => setNewEvent({ ...newEvent, startDate: e.target.value })}
                                    style={{ border: '1px solid var(--border-light)', borderRadius: 'var(--radius)', padding: '0.75rem', width: '100%' }}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-semibold mb-2 block">Department</label>
                                <select
                                    value={newEvent.department}
                                    onChange={e => setNewEvent({ ...newEvent, department: e.target.value })}
                                    style={{ border: '1px solid var(--border-light)', borderRadius: 'var(--radius)', padding: '0.75rem', width: '100%' }}
                                >
                                    <option>General</option>
                                    <option>Agricultural Engineering</option>
                                    <option>Artificial Intelligence and Data Science</option>
                                    <option>CIVIL</option>
                                    <option>CSE</option>
                                    <option>Cyber Security</option>
                                    <option>ECE</option>
                                    <option>EEE</option>
                                    <option>Information Technology</option>
                                    <option>MECH</option>
                                    <option>Medical Electronics</option>
                                </select>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="text-sm font-semibold mb-2 block">Location</label>
                            <input
                                type="text"
                                value={newEvent.location}
                                onChange={e => setNewEvent({ ...newEvent, location: e.target.value })}
                                placeholder="Ex: Auditorium or Zoom Link"
                                style={{ border: '1px solid var(--border-light)', borderRadius: 'var(--radius)', padding: '0.75rem', width: '100%' }}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="text-sm font-semibold mb-2 block">Capacity</label>
                            <input
                                type="number"
                                value={newEvent.capacity}
                                onChange={e => setNewEvent({ ...newEvent, capacity: e.target.value })}
                                style={{ border: '1px solid var(--border-light)', borderRadius: 'var(--radius)', padding: '0.75rem', width: '100%' }}
                            />
                        </div>

                        <div className="mb-6">
                            <label className="text-sm font-semibold mb-2 block">Description</label>
                            <textarea
                                rows="3"
                                value={newEvent.description}
                                onChange={e => setNewEvent({ ...newEvent, description: e.target.value })}
                                placeholder="Describe the event..."
                                style={{ border: '1px solid var(--border-light)', borderRadius: 'var(--radius)', padding: '0.75rem', width: '100%', fontFamily: 'inherit' }}
                            />
                        </div>

                        <div className="flex justify-end gap-3">
                            <button className="btn btn-outline" onClick={() => setCreateModal(false)}>Cancel</button>
                            <button className="btn btn-primary" onClick={handleCreate}>Create Event</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
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
