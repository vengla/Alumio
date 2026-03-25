'use client';
import { useState } from 'react';
import { Heart, DollarSign, CreditCard, FileText, Award, TrendingUp } from 'lucide-react';

const donationCategories = [
    { id: 'scholarship', name: 'Student Scholarships', desc: 'Support deserving students', raised: 1250000, goal: 2000000 },
    { id: 'infrastructure', name: 'Infrastructure Development', desc: 'Build better facilities', raised: 890000, goal: 1500000 },
    { id: 'events', name: 'Events & Activities', desc: 'Fund cultural and tech events', raised: 340000, goal: 500000 },
    { id: 'research', name: 'Research Grants', desc: 'Support innovative research', raised: 760000, goal: 1000000 },
];

export default function DonationsPage() {
    const [selectedCategory, setSelectedCategory] = useState('scholarship');
    const [amount, setAmount] = useState('');

    const handleDonate = (e) => {
        e.preventDefault();

        const donationAmount = parseInt(amount);
        if (!donationAmount || donationAmount < 100) {
            alert('Please enter a valid amount (minimum ₹100)');
            return;
        }

        // Get current total from localStorage
        const currentTotal = parseInt(localStorage.getItem('totalDonations') || '0');
        const newTotal = currentTotal + donationAmount;

        // Save new total
        localStorage.setItem('totalDonations', newTotal.toString());

        // Save donation record
        const donations = JSON.parse(localStorage.getItem('donationHistory') || '[]');
        donations.push({
            amount: donationAmount,
            category: selectedCategory,
            categoryName: donationCategories.find(c => c.id === selectedCategory)?.name,
            date: new Date().toISOString(),
            id: Date.now().toString()
        });
        localStorage.setItem('donationHistory', JSON.stringify(donations));

        alert(`✓ Payment Successful!\n\n₹${donationAmount.toLocaleString()} donated to ${donationCategories.find(c => c.id === selectedCategory)?.name}\n\nNew Total Donations: ₹${newTotal.toLocaleString()}\n\nThank you for your contribution!`);

        // Reset form
        setAmount('');
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-body)' }}>
            <header className="glass" style={{ borderBottom: '1px solid var(--border-light)', padding: '1rem 0' }}>
                <div className="container flex items-center justify-between">
                    <h1 className="h2" style={{ margin: 0 }}>Donation & Philanthropy</h1>
                    <a href="/dashboard" className="btn btn-outline">← Dashboard</a>
                </div>
            </header>

            <main className="container py-8">
                {/* Hero */}
                <div className="card mb-8" style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)', color: 'white', textAlign: 'center', padding: '3rem' }}>
                    <Heart size={48} color="white" style={{ margin: '0 auto 1rem' }} />
                    <h1 className="h1" style={{ color: 'white', marginBottom: '1rem' }}>Give Back to Your Alma Mater</h1>
                    <p className="text-lg" style={{ marginBottom: '1.5rem', opacity: 0.9 }}>
                        Your contribution makes a lasting impact on future generations
                    </p>
                    <div className="flex gap-8 justify-center">
                        <div>
                            <div className="h2" style={{ color: 'white' }}>₹2.5 Cr</div>
                            <div style={{ opacity: 0.9 }}>Total Raised</div>
                        </div>
                        <div>
                            <div className="h2" style={{ color: 'white' }}>3,450</div>
                            <div style={{ opacity: 0.9 }}>Donors</div>
                        </div>
                        <div>
                            <div className="h2" style={{ color: 'white' }}>12+</div>
                            <div style={{ opacity: 0.9 }}>Active Campaigns</div>
                        </div>
                    </div>
                </div>

                {/* Donation Categories */}
                <h2 className="h2 mb-4">Donation Categories</h2>
                <div className="grid grid-cols-2 mb-8">
                    {donationCategories.map(cat => {
                        const progress = (cat.raised / cat.goal) * 100;
                        return (
                            <div key={cat.id} className="card" style={{ cursor: 'pointer' }}>
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="h3" style={{ margin: 0 }}>{cat.name}</h3>
                                    <Heart size={24} color={selectedCategory === cat.id ? 'var(--danger)' : 'var(--text-muted)'} />
                                </div>
                                <p className="text-sm text-muted mb-4">{cat.desc}</p>

                                {/* Progress Bar */}
                                <div className="mb-3">
                                    <div style={{
                                        width: '100%',
                                        height: '8px',
                                        background: 'var(--bg-subtle)',
                                        borderRadius: '999px',
                                        overflow: 'hidden'
                                    }}>
                                        <div style={{
                                            width: `${progress}%`,
                                            height: '100%',
                                            background: 'linear-gradient(90deg, var(--success), var(--primary))',
                                            transition: 'width 0.3s'
                                        }} />
                                    </div>
                                    <div className="flex justify-between items-center mt-2 text-sm">
                                        <span className="text-muted">₹{(cat.raised / 100000).toFixed(1)}L raised</span>
                                        <span style={{ fontWeight: 600 }}>₹{(cat.goal / 100000).toFixed(1)}L goal</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={selectedCategory === cat.id ? 'btn btn-primary' : 'btn btn-outline'}
                                    style={{ width: '100%' }}
                                >
                                    {selectedCategory === cat.id ? '✓ Selected' : 'Select & Donate'}
                                </button>
                            </div>
                        );
                    })}
                </div>

                {/* Donation Form */}
                <div className="grid grid-cols-2">
                    <div className="card">
                        <h3 className="h3 mb-4">Make a Donation</h3>
                        <form onSubmit={handleDonate}>
                            <div className="mb-4">
                                <label className="text-sm" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
                                    Donation Category
                                </label>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        border: '1px solid var(--border-light)',
                                        borderRadius: 'var(--radius)'
                                    }}
                                >
                                    {donationCategories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="text-sm" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
                                    Amount (₹)
                                </label>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="Enter amount"
                                    required
                                    min="100"
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        border: '1px solid var(--border-light)',
                                        borderRadius: 'var(--radius)'
                                    }}
                                />
                                <div className="flex gap-2 mt-2">
                                    {[500, 1000, 5000, 10000].map(preset => (
                                        <button
                                            key={preset}
                                            type="button"
                                            onClick={() => setAmount(preset.toString())}
                                            className="btn btn-outline"
                                            style={{ flex: 1, padding: '0.5rem', fontSize: '0.875rem' }}
                                        >
                                            ₹{preset}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="flex items-center gap-2 text-sm">
                                    <input type="checkbox" defaultChecked />
                                    I want to receive a tax-exempt donation receipt
                                </label>
                            </div>

                            <button type="submit" className="btn btn-primary" style={{ width: '100%', fontSize: '1.125rem' }}>
                                <CreditCard size={20} /> Proceed to Payment
                            </button>

                            <div className="mt-4 p-3" style={{ background: 'var(--bg-subtle)', borderRadius: 'var(--radius)' }}>
                                <p className="text-sm text-muted" style={{ margin: 0 }}>
                                    💳 <strong>Demo Mode:</strong> Using Razorpay Sandbox (Test Gateway)
                                </p>
                            </div>
                        </form>
                    </div>

                    {/* Transparency Dashboard */}
                    <div className="card">
                        <h3 className="h3 mb-4">
                            <TrendingUp size={24} style={{ display: 'inline', marginRight: '0.5rem' }} />
                            Fund Utilization
                        </h3>
                        <p className="text-sm text-muted mb-4">See how your donations are making an impact</p>

                        <div className="flex flex-col gap-3">
                            {[
                                { category: 'Scholarships Awarded', amount: '₹12.5L', students: '25 students' },
                                { category: 'Lab Equipment Purchased', amount: '₹8.9L', detail: 'New CS Lab' },
                                { category: 'Events Funded', amount: '₹3.4L', detail: '8 events' },
                                { category: 'Research Grants', amount: '₹7.6L', detail: '5 projects' },
                            ].map((item, i) => (
                                <div key={i} className="flex justify-between items-center p-3" style={{ background: 'var(--bg-subtle)', borderRadius: 'var(--radius)' }}>
                                    <div>
                                        <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{item.category}</div>
                                        <div className="text-sm text-muted">{item.students || item.detail}</div>
                                    </div>
                                    <div className="h3" style={{ color: 'var(--success)', margin: 0 }}>{item.amount}</div>
                                </div>
                            ))}
                        </div>

                        <button className="btn btn-outline mt-4" style={{ width: '100%' }}>
                            <FileText size={18} /> View Detailed Report
                        </button>
                    </div>
                </div>

                {/* Top Donors */}
                <div className="card mt-8">
                    <h3 className="h3 mb-4">
                        <Award size={24} style={{ display: 'inline', marginRight: '0.5rem' }} />
                        Hall of Donors
                    </h3>
                    <div className="grid grid-cols-4">
                        {[
                            { name: 'Rajesh Kumar', batch: '2015', amount: '₹50,000' },
                            { name: 'Priya Sharma', batch: '2017', amount: '₹35,000' },
                            { name: 'Amit Patel', batch: '2014', amount: '₹1,00,000' },
                            { name: 'Sneha Reddy', batch: '2018', amount: '₹20,000' },
                        ].map((donor, i) => (
                            <div key={i} className="card" style={{ textAlign: 'center' }}>
                                <div style={{
                                    width: '64px',
                                    height: '64px',
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, var(--accent), var(--accent-hover))',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.5rem',
                                    fontWeight: 'bold',
                                    color: '#000',
                                    margin: '0 auto 1rem'
                                }}>
                                    {i + 1}
                                </div>
                                <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{donor.name}</div>
                                <div className="text-sm text-muted mb-2">Batch {donor.batch}</div>
                                <div className="h3" style={{ color: 'var(--success)', margin: 0 }}>{donor.amount}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
