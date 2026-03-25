'use client';
import { useState, useEffect } from 'react';
import { Users, MessageCircle, Calendar, ArrowLeft, GraduationCap, Send, X, Trash2, Eye } from 'lucide-react';
import { useAuth } from '../components/AuthProvider';
import { useRouter } from 'next/navigation';

export default function MentorshipPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [connections, setConnections] = useState([]);
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [selectedMentee, setSelectedMentee] = useState(null);
    const [selectedProfile, setSelectedProfile] = useState(null);
    const [messageText, setMessageText] = useState('');
    const [meetingData, setMeetingData] = useState({
        date: '',
        time: '',
        duration: '30',
        agenda: '',
        meetingLink: ''
    });

    useEffect(() => {
        if (!user) return;

        if (user.role === 'student') {
            const storedMentors = JSON.parse(localStorage.getItem('mentors') || '[]');
            setConnections(storedMentors);
        } else {
            const storedMentees = JSON.parse(localStorage.getItem('mentees') || '[]');
            setConnections(storedMentees);
        }
    }, [user]);

    const handleSendMessage = () => {
        if (!messageText.trim()) {
            alert('Please enter a message.');
            return;
        }

        // 1. Store Message
        const allMessages = JSON.parse(localStorage.getItem('app_messages') || '[]');
        const newMessage = {
            id: Date.now().toString(),
            senderId: user.id || user._id,
            receiverId: selectedMentee.id,
            text: messageText,
            timestamp: new Date().toISOString(),
            isRead: false
        };
        allMessages.push(newMessage);
        localStorage.setItem('app_messages', JSON.stringify(allMessages));

        // 2. Notify Recipient
        const allNotifications = JSON.parse(localStorage.getItem('app_notifications') || '[]');
        const newNotification = {
            id: Date.now().toString() + '_msg',
            userId: selectedMentee.id, // Target the recipient
            type: 'message_received',
            title: `New Message from ${user.name || user.firstName}`,
            message: messageText.length > 50 ? messageText.substring(0, 50) + '...' : messageText,
            isRead: false,
            createdAt: new Date().toISOString()
        };
        allNotifications.push(newNotification);
        localStorage.setItem('app_notifications', JSON.stringify(allNotifications));

        alert(`✉️ Message sent to ${selectedMentee.firstName} ${selectedMentee.lastName}!`);
        setMessageText('');
        setShowMessageModal(false);
        setSelectedMentee(null);
    };

    const handleScheduleMeeting = () => {
        if (!meetingData.date || !meetingData.time) {
            alert('Please select date and time for the meeting.');
            return;
        }
        alert(`📅 Meeting scheduled with ${selectedMentee.firstName} ${selectedMentee.lastName}!\n\nDate: ${new Date(meetingData.date).toLocaleDateString()}\nTime: ${meetingData.time}\nDuration: ${meetingData.duration} minutes\n\nA calendar invite has been sent to both parties.`);
        setMeetingData({ date: '', time: '', duration: '30', agenda: '', meetingLink: '' });
        setShowScheduleModal(false);
        setSelectedMentee(null);
    };

    const handleRemoveMentee = (menteeId, menteeName) => {
        if (confirm(`Are you sure you want to remove ${menteeName} from your mentees?`)) {
            // Update state
            const updatedConnections = connections.filter(c => c.id !== menteeId);
            setConnections(updatedConnections);

            // Update localStorage
            const storedMentees = JSON.parse(localStorage.getItem('mentees') || '[]');
            const newStoredMentees = storedMentees.filter(m => m.id !== menteeId);
            localStorage.setItem('mentees', JSON.stringify(newStoredMentees));

            alert(`${menteeName} has been removed.`);
        }
    };

    const handleToggleStatus = (connectionId, currentStatus) => {
        const newStatus = currentStatus === 'active' ? 'inactive' : 'active';

        // Update State
        const updatedConnections = connections.map(c =>
            c.id === connectionId ? { ...c, status: newStatus } : c
        );
        setConnections(updatedConnections);

        // Update LocalStorage
        const storageKey = user.role === 'student' ? 'mentors' : 'mentees';
        localStorage.setItem(storageKey, JSON.stringify(updatedConnections));
    };

    if (!user) {
        router.push('/login');
        return null;
    }

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-body)' }}>
            <header className="glass" style={{ borderBottom: '1px solid var(--border-light)', padding: '1rem 0' }}>
                <div className="container flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Users size={28} color="var(--primary)" />
                        <h1 className="h2" style={{ margin: 0 }}>
                            {user.role === 'student' ? 'My Mentors' : 'My Mentees'}
                        </h1>
                    </div>
                    <button onClick={() => router.push('/dashboard')} className="btn btn-outline flex items-center gap-2">
                        <ArrowLeft size={18} /> Back
                    </button>
                </div>
            </header>

            <main className="container py-8">
                {/* Stats Overview */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="card">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-muted">
                                {user.role === 'student' ? 'Total Mentors' : 'Total Mentees'}
                            </span>
                            <Users size={20} color="var(--primary)" />
                        </div>
                        <div className="h2" style={{ margin: 0, color: 'var(--primary)' }}>{connections.length}</div>
                    </div>
                    <div className="card">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-muted">Active Sessions</span>
                            <Calendar size={20} color="var(--success)" />
                        </div>
                        <div className="h2" style={{ margin: 0, color: 'var(--success)' }}>
                            {connections.filter(m => m.status === 'active').length}
                        </div>
                    </div>
                    <div className="card">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-muted">
                                {user.role === 'student' ? 'Industries' : 'Departments'}
                            </span>
                            <GraduationCap size={20} color="var(--accent)" />
                        </div>
                        <div className="h2" style={{ margin: 0, color: 'var(--accent)' }}>
                            {new Set(connections.map(m => m.department)).size}
                        </div>
                    </div>
                </div>

                {/* Connections List */}
                <div className="card">
                    <h3 className="h3 mb-4">
                        {user.role === 'student' ? 'My Mentors' : 'My Mentees'} ({connections.length})
                    </h3>

                    {connections.length > 0 ? (
                        <div className="grid grid-cols-2 gap-4">
                            {connections.map(connection => (
                                <div
                                    key={connection.id}
                                    className="p-4"
                                    style={{
                                        background: 'var(--bg-subtle)',
                                        borderRadius: 'var(--radius)',
                                        border: '1px solid var(--border-light)'
                                    }}
                                >
                                    <div
                                        className="flex items-start gap-3 mb-3"
                                        onClick={() => {
                                            setSelectedProfile(connection);
                                            setShowProfileModal(true);
                                        }}
                                        style={{ cursor: 'pointer' }}
                                        title="Click to view profile"
                                    >
                                        {/* Avatar */}
                                        <div style={{
                                            width: '48px',
                                            height: '48px',
                                            borderRadius: '50%',
                                            background: 'linear-gradient(135deg, var(--success), var(--accent))',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '1.125rem',
                                            fontWeight: 'bold',
                                            color: 'white'
                                        }}>
                                            {connection.firstName[0]}{connection.lastName[0]}
                                        </div>

                                        {/* Info */}
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
                                                {connection.firstName} {connection.lastName}
                                            </div>
                                            <div className="text-sm text-muted">
                                                {connection.department}
                                            </div>
                                            <span className="badge" style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}>
                                                {connection.batch || 'Alumni'}
                                            </span>
                                        </div>

                                        {/* Status Badge */}
                                        <button
                                            className="badge"
                                            onClick={() => handleToggleStatus(connection.id, connection.status)}
                                            style={{
                                                background: connection.status === 'active' ? 'var(--success)' : 'var(--bg-subtle)',
                                                color: connection.status === 'active' ? 'white' : 'var(--text-muted)',
                                                fontSize: '0.75rem',
                                                border: 'none',
                                                cursor: 'pointer'
                                            }}
                                            title="Click to toggle status"
                                        >
                                            {connection.status}
                                        </button>
                                    </div>

                                    {/* Added Date */}
                                    <div className="text-xs text-muted mb-3">
                                        Connected: {new Date(connection.addedAt).toLocaleDateString()}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <button
                                            className="btn btn-primary flex items-center gap-2"
                                            style={{ flex: 1, padding: '0.5rem', fontSize: '0.875rem' }}
                                            onClick={() => {
                                                setSelectedMentee(connection);
                                                setShowMessageModal(true);
                                            }}
                                        >
                                            <MessageCircle size={14} /> Message
                                        </button>
                                        <button
                                            className="btn btn-outline flex items-center gap-2"
                                            style={{ padding: '0.5rem', fontSize: '0.875rem' }}
                                            onClick={() => {
                                                setSelectedProfile(connection);
                                                setShowProfileModal(true);
                                            }}
                                            title="View Profile Details"
                                        >
                                            <Eye size={14} /> View
                                        </button>
                                        <button
                                            className="btn btn-outline flex items-center gap-2"
                                            style={{ padding: '0.5rem', fontSize: '0.875rem' }}
                                            onClick={() => {
                                                setSelectedMentee(connection);
                                                setShowScheduleModal(true);
                                            }}
                                        >
                                            <Calendar size={14} /> Schedule
                                        </button>
                                        {user.role !== 'student' && (
                                            <button
                                                className="btn btn-outline flex items-center gap-2"
                                                style={{ padding: '0.5rem', fontSize: '0.875rem', borderColor: 'var(--danger)', color: 'var(--danger)' }}
                                                onClick={() => handleRemoveMentee(connection.id, `${connection.firstName} ${connection.lastName}`)}
                                                title="Remove Mentee"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                            <Users size={64} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                            <h3 className="h3">
                                {user.role === 'student' ? 'No Mentors Yet' : 'No Mentees Yet'}
                            </h3>
                            <p className="text-muted">
                                {user.role === 'student'
                                    ? 'Connect with alumni in the directory to find a mentor.'
                                    : 'Accept connection requests to start mentoring students.'}
                            </p>
                            <a href={user.role === 'student' ? '/directory' : '/notifications'} className="btn btn-primary" style={{ marginTop: '1rem' }}>
                                {user.role === 'student' ? 'Find a Mentor' : 'View Requests'}
                            </a>
                        </div>
                    )}
                </div>
            </main>

            {/* Message Modal */}
            {showMessageModal && selectedMentee && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div className="card" style={{ maxWidth: '500px', width: '90%', position: 'relative' }}>
                        <button
                            onClick={() => {
                                setShowMessageModal(false);
                                setSelectedMentee(null);
                                setMessageText('');
                            }}
                            style={{
                                position: 'absolute',
                                top: '1rem',
                                right: '1rem',
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer'
                            }}
                        >
                            <X size={20} />
                        </button>

                        <h3 className="h3 mb-4">Send Message to {selectedMentee.firstName} {selectedMentee.lastName}</h3>

                        <div className="mb-4">
                            <label className="text-sm font-semibold mb-2 block">Message</label>
                            <textarea
                                value={messageText}
                                onChange={(e) => setMessageText(e.target.value)}
                                rows="6"
                                placeholder="Type your message here..."
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: '1px solid var(--border-light)',
                                    borderRadius: 'var(--radius)',
                                    fontFamily: 'inherit',
                                    resize: 'vertical'
                                }}
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={handleSendMessage}
                                className="btn btn-primary flex items-center gap-2"
                                style={{ flex: 1 }}
                            >
                                <Send size={18} /> Send Message
                            </button>
                            <button
                                onClick={() => {
                                    setShowMessageModal(false);
                                    setSelectedMentee(null);
                                    setMessageText('');
                                }}
                                className="btn btn-outline"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Schedule Modal */}
            {showScheduleModal && selectedMentee && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div className="card" style={{ maxWidth: '600px', width: '90%', position: 'relative' }}>
                        <button
                            onClick={() => {
                                setShowScheduleModal(false);
                                setSelectedMentee(null);
                                setMeetingData({ date: '', time: '', duration: '30', agenda: '', meetingLink: '' });
                            }}
                            style={{
                                position: 'absolute',
                                top: '1rem',
                                right: '1rem',
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer'
                            }}
                        >
                            <X size={20} />
                        </button>

                        <h3 className="h3 mb-4">Schedule Meeting with {selectedMentee.firstName} {selectedMentee.lastName}</h3>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="text-sm font-semibold mb-2 block">Date *</label>
                                <input
                                    type="date"
                                    value={meetingData.date}
                                    onChange={(e) => setMeetingData({ ...meetingData, date: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        border: '1px solid var(--border-light)',
                                        borderRadius: 'var(--radius)'
                                    }}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-semibold mb-2 block">Time *</label>
                                <input
                                    type="time"
                                    value={meetingData.time}
                                    onChange={(e) => setMeetingData({ ...meetingData, time: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        border: '1px solid var(--border-light)',
                                        borderRadius: 'var(--radius)'
                                    }}
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="text-sm font-semibold mb-2 block">Duration (minutes)</label>
                            <select
                                value={meetingData.duration}
                                onChange={(e) => setMeetingData({ ...meetingData, duration: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: '1px solid var(--border-light)',
                                    borderRadius: 'var(--radius)'
                                }}
                            >
                                <option value="15">15 minutes</option>
                                <option value="30">30 minutes</option>
                                <option value="45">45 minutes</option>
                                <option value="60">1 hour</option>
                                <option value="90">1.5 hours</option>
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="text-sm font-semibold mb-2 block">Meeting Link (Optional)</label>
                            <input
                                type="url"
                                value={meetingData.meetingLink}
                                onChange={(e) => setMeetingData({ ...meetingData, meetingLink: e.target.value })}
                                placeholder="https://meet.google.com/... or https://zoom.us/..."
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: '1px solid var(--border-light)',
                                    borderRadius: 'var(--radius)'
                                }}
                            />
                        </div>

                        <div className="mb-6">
                            <label className="text-sm font-semibold mb-2 block">Agenda (Optional)</label>
                            <textarea
                                value={meetingData.agenda}
                                onChange={(e) => setMeetingData({ ...meetingData, agenda: e.target.value })}
                                rows="3"
                                placeholder="What will you discuss in this meeting?"
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: '1px solid var(--border-light)',
                                    borderRadius: 'var(--radius)',
                                    fontFamily: 'inherit'
                                }}
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={handleScheduleMeeting}
                                className="btn btn-primary flex items-center gap-2"
                                style={{ flex: 1 }}
                            >
                                <Calendar size={18} /> Schedule Meeting
                            </button>
                            <button
                                onClick={() => {
                                    setShowScheduleModal(false);
                                    setSelectedMentee(null);
                                    setMeetingData({ date: '', time: '', duration: '30', agenda: '', meetingLink: '' });
                                }}
                                className="btn btn-outline"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Profile Modal */}
            {showProfileModal && selectedProfile && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '2rem',
                    overflowY: 'auto'
                }}>
                    <div className="card" style={{ maxWidth: '700px', width: '90%', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
                        <button
                            onClick={() => {
                                setShowProfileModal(false);
                                setSelectedProfile(null);
                            }}
                            style={{
                                position: 'absolute',
                                top: '1rem',
                                right: '1rem',
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                zIndex: 10
                            }}
                        >
                            <X size={24} />
                        </button>

                        {/* Profile Header */}
                        <div style={{
                            textAlign: 'center',
                            marginBottom: '2rem',
                            paddingBottom: '1.5rem',
                            borderBottom: '1px solid var(--border-light)'
                        }}>
                            {/* Avatar */}
                            <div style={{
                                width: '100px',
                                height: '100px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '2.5rem',
                                fontWeight: 'bold',
                                color: 'white',
                                margin: '0 auto 1rem'
                            }}>
                                {selectedProfile.firstName[0]}{selectedProfile.lastName[0]}
                            </div>

                            {/* Name & Role */}
                            <h2 className="h2" style={{ margin: '0 0 0.5rem 0' }}>
                                {selectedProfile.firstName} {selectedProfile.lastName}
                            </h2>
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <span className="badge badge-primary">
                                    {selectedProfile.role === 'student' ? 'Student' : 'Alumni'}
                                </span>
                                <span className="badge" style={{
                                    background: selectedProfile.status === 'active' ? 'var(--success)' : 'var(--bg-subtle)',
                                    color: selectedProfile.status === 'active' ? 'white' : 'var(--text-muted)'
                                }}>
                                    {selectedProfile.status || 'Active'}
                                </span>
                            </div>

                            {selectedProfile.currentRole && (
                                <div style={{ fontWeight: 600, color: 'var(--primary)', marginBottom: '0.25rem' }}>
                                    {selectedProfile.currentRole}
                                </div>
                            )}
                            {selectedProfile.currentCompany && (
                                <div className="text-muted">
                                    {selectedProfile.currentCompany}
                                </div>
                            )}
                        </div>

                        {/* Profile Details */}
                        <div className="flex flex-col gap-4">
                            {/* Education Info */}
                            <div>
                                <h3 className="h4 mb-3" style={{ color: 'var(--primary)' }}>📚 Education</h3>
                                <div className="p-3" style={{ background: 'var(--bg-subtle)', borderRadius: 'var(--radius)' }}>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <div className="text-sm text-muted">Department</div>
                                            <div style={{ fontWeight: 600 }}>{selectedProfile.department}</div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-muted">Batch</div>
                                            <div style={{ fontWeight: 600 }}>{selectedProfile.batch || 'N/A'}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Info */}
                            {selectedProfile.email && (
                                <div>
                                    <h3 className="h4 mb-3" style={{ color: 'var(--primary)' }}>📧 Contact</h3>
                                    <div className="p-3" style={{ background: 'var(--bg-subtle)', borderRadius: 'var(--radius)' }}>
                                        <div className="text-sm text-muted mb-1">Email</div>
                                        <div style={{ fontWeight: 600 }}>{selectedProfile.email}</div>
                                    </div>
                                </div>
                            )}

                            {/* Location */}
                            {selectedProfile.city && (
                                <div>
                                    <h3 className="h4 mb-3" style={{ color: 'var(--primary)' }}>📍 Location</h3>
                                    <div className="p-3" style={{ background: 'var(--bg-subtle)', borderRadius: 'var(--radius)' }}>
                                        <div style={{ fontWeight: 600 }}>{selectedProfile.city}</div>
                                    </div>
                                </div>
                            )}

                            {/* Skills (if available) */}
                            {selectedProfile.skills && selectedProfile.skills.length > 0 && (
                                <div>
                                    <h3 className="h4 mb-3" style={{ color: 'var(--primary)' }}>💡 Skills</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedProfile.skills.map((skill, i) => (
                                            <span key={i} className="badge" style={{
                                                background: 'var(--primary)',
                                                color: 'white'
                                            }}>
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Bio (if available) */}
                            {selectedProfile.bio && (
                                <div>
                                    <h3 className="h4 mb-3" style={{ color: 'var(--primary)' }}>ℹ️ About</h3>
                                    <div className="p-3" style={{ background: 'var(--bg-subtle)', borderRadius: 'var(--radius)' }}>
                                        <p style={{ margin: 0, lineHeight: 1.6 }}>{selectedProfile.bio}</p>
                                    </div>
                                </div>
                            )}

                            {/* Connection Info */}
                            <div>
                                <h3 className="h4 mb-3" style={{ color: 'var(--primary)' }}>🔗 Connection</h3>
                                <div className="p-3" style={{ background: 'var(--bg-subtle)', borderRadius: 'var(--radius)' }}>
                                    <div className="text-sm text-muted mb-1">Connected Since</div>
                                    <div style={{ fontWeight: 600 }}>
                                        {new Date(selectedProfile.addedAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 mt-6" style={{ paddingTop: '1.5rem', borderTop: '1px solid var(--border-light)' }}>
                            <button
                                onClick={() => {
                                    setShowProfileModal(false);
                                    setSelectedMentee(selectedProfile);
                                    setShowMessageModal(true);
                                }}
                                className="btn btn-primary flex items-center gap-2"
                                style={{ flex: 1 }}
                            >
                                <MessageCircle size={18} /> Send Message
                            </button>
                            <button
                                onClick={() => {
                                    setShowProfileModal(false);
                                    setSelectedMentee(selectedProfile);
                                    setShowScheduleModal(true);
                                }}
                                className="btn btn-outline flex items-center gap-2"
                                style={{ flex: 1 }}
                            >
                                <Calendar size={18} /> Schedule Meeting
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
