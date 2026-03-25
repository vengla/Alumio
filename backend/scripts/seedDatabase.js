import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/database.js';
import User from '../models/User.js';
import Job from '../models/Job.js';
import Event from '../models/Event.js';
import Donation from '../models/Donation.js';

dotenv.config();

const seedDatabase = async () => {
    try {
        // Only connect if not already connected
        if (mongoose.connection.readyState === 0) {
            await connectDB();
        }

        console.log('🗑️  Clearing existing data...');
        await User.deleteMany();
        await Job.deleteMany();
        await Event.deleteMany();
        await Donation.deleteMany();

        console.log('👥 Creating users...');

        // Create Admin
        const admin = await User.create({
            email: 'admin@alumni.edu',
            password: 'admin123',
            mobile: '9876543210',
            firstName: 'Admin',
            lastName: 'User',
            role: 'admin',
            department: 'Administration',
            batch: '2010-2014',
            graduationYear: 2014,
            degree: 'B.Tech',
            isApproved: true,
            isVerified: true
        });

        // Create Alumni
        const alumni = await User.create([
            {
                email: 'john.doe@gmail.com',
                password: 'password123',
                mobile: '9876543211',
                firstName: 'John',
                lastName: 'Doe',
                role: 'alumni',
                enrollmentNumber: 'ALU001',
                department: 'Computer Science',
                batch: '2015-2019',
                graduationYear: 2019,
                degree: 'B.Tech',
                currentCompany: 'Google',
                currentPosition: 'Senior Software Engineer',
                industry: 'Technology',
                experience: 5,
                skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
                city: 'Bangalore',
                state: 'Karnataka',
                isMentorAvailable: true,
                mentorshipAreas: ['Web Development', 'Career Guidance'],
                isApproved: true,
                isVerified: true,
                bio: 'Passionate software engineer with 5+ years of experience in full-stack development.'
            },
            {
                email: 'sarah.smith@gmail.com',
                password: 'password123',
                mobile: '9876543212',
                firstName: 'Sarah',
                lastName: 'Smith',
                role: 'alumni',
                enrollmentNumber: 'ALU002',
                department: 'Electronics',
                batch: '2016-2020',
                graduationYear: 2020,
                degree: 'B.Tech',
                currentCompany: 'Microsoft',
                currentPosition: 'Product Manager',
                industry: 'Technology',
                experience: 4,
                skills: ['Product Management', 'Agile', 'Leadership'],
                city: 'Hyderabad',
                state: 'Telangana',
                isMentorAvailable: true,
                mentorshipAreas: ['Product Management', 'Leadership'],
                isApproved: true,
                isVerified: true,
                bio: 'Product manager helping build innovative solutions at Microsoft.'
            },
            {
                email: 'raj.kumar@gmail.com',
                password: 'password123',
                mobile: '9876543213',
                firstName: 'Raj',
                lastName: 'Kumar',
                role: 'alumni',
                enrollmentNumber: 'ALU003',
                department: 'Mechanical',
                batch: '2014-2018',
                graduationYear: 2018,
                degree: 'B.Tech',
                currentCompany: 'Tesla',
                currentPosition: 'Design Engineer',
                industry: 'Automotive',
                experience: 6,
                skills: ['CAD', 'Design', 'Manufacturing'],
                city: 'Pune',
                state: 'Maharashtra',
                isMentorAvailable: false,
                isApproved: true,
                isVerified: true,
                bio: 'Design engineer working on next-gen electric vehicles.'
            }
        ]);

        // Create Students
        const students = await User.create([
            {
                email: 'student1@college.edu',
                password: 'password123',
                mobile: '9876543214',
                firstName: 'Priya',
                lastName: 'Sharma',
                role: 'student',
                enrollmentNumber: 'STU001',
                department: 'Computer Science',
                batch: '2022-2026',
                graduationYear: 2026,
                degree: 'B.Tech',
                skills: ['Python', 'Java', 'C++'],
                city: 'Delhi',
                state: 'Delhi',
                isApproved: true,
                isVerified: true,
                bio: 'Third-year CS student interested in AI/ML.'
            },
            {
                email: 'student2@college.edu',
                password: 'password123',
                mobile: '9876543215',
                firstName: 'Amit',
                lastName: 'Patel',
                role: 'student',
                enrollmentNumber: 'STU002',
                department: 'Electronics',
                batch: '2023-2027',
                graduationYear: 2027,
                degree: 'B.Tech',
                skills: ['Circuit Design', 'Embedded Systems'],
                city: 'Mumbai',
                state: 'Maharashtra',
                isApproved: true,
                isVerified: true,
                bio: 'Second-year ECE student passionate about IoT.'
            }
        ]);

        console.log('💼 Creating jobs...');
        const jobs = await Job.create([
            {
                title: 'Software Engineer - Backend',
                company: 'Google',
                description: 'We are looking for a talented backend engineer to join our team. You will work on scalable systems serving millions of users.',
                type: 'full-time',
                category: 'software',
                location: 'Bangalore, Karnataka',
                isRemote: false,
                requirements: ['3+ years experience', 'Strong in Java/Python', 'Experience with microservices'],
                skills: ['Java', 'Python', 'Docker', 'Kubernetes'],
                experience: { min: 3, max: 5 },
                salary: { min: 2000000, max: 3500000, currency: 'INR', period: 'yearly' },
                postedBy: alumni[0]._id,
                isReferralAvailable: true,
                applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                applicationEmail: 'careers@google.com',
                isApproved: true
            },
            {
                title: 'Product Management Intern',
                company: 'Microsoft',
                description: 'Summer internship opportunity for aspiring product managers. You will work closely with senior PMs on real products.',
                type: 'internship',
                category: 'other',
                location: 'Hyderabad, Telangana',
                isRemote: true,
                requirements: ['Currently pursuing degree', 'Strong analytical skills', 'Good communication'],
                skills: ['Product Management', 'Analytics', 'Communication'],
                experience: { min: 0, max: 1 },
                salary: { min: 50000, max: 80000, currency: 'INR', period: 'monthly' },
                postedBy: alumni[1]._id,
                isReferralAvailable: true,
                applicationDeadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
                applicationEmail: 'internships@microsoft.com',
                isApproved: true
            }
        ]);

        console.log('📅 Creating events...');
        const events = await Event.create([
            {
                title: 'Annual Alumni Meet 2026',
                description: 'Join us for the annual alumni gathering. Network with fellow alumni, share experiences, and enjoy great food!',
                type: 'reunion',
                startDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
                endDate: new Date(Date.now() + 61 * 24 * 60 * 60 * 1000),
                venue: 'College Auditorium',
                address: 'Main Campus, College Road',
                city: 'Delhi',
                state: 'Delhi',
                isOnline: false,
                registrationRequired: true,
                registrationDeadline: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000),
                capacity: 200,
                isFree: true,
                organizer: admin._id,
                status: 'published',
                tags: ['reunion', 'networking']
            },
            {
                title: 'Web Development Workshop',
                description: 'Learn modern web development with React and Node.js. Hands-on workshop conducted by industry experts.',
                type: 'workshop',
                startDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
                endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
                venue: 'Online',
                isOnline: true,
                meetingLink: 'https://meet.google.com/demo',
                registrationRequired: true,
                registrationDeadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
                capacity: 100,
                isFree: false,
                fees: 500,
                organizer: alumni[0]._id,
                status: 'published',
                tags: ['workshop', 'web-development', 'react']
            }
        ]);

        console.log('❤️  Creating donations...');
        const donationData = [
            {
                donor: alumni[0]._id,
                amount: 50000,
                category: 'scholarship',
                purpose: 'Support underprivileged students',
                paymentMethod: 'razorpay',
                paymentId: 'pay_demo123456',
                status: 'completed',
                receiptNumber: `REC-${new Date().getFullYear()}-000001`,
                receiptIssued: true,
                receiptIssuedAt: new Date(),
                acknowledged: true,
                acknowledgedAt: new Date(),
                acknowledgedBy: admin._id
            },
            {
                donor: alumni[1]._id,
                amount: 100000,
                category: 'infrastructure',
                purpose: 'New library construction',
                paymentMethod: 'razorpay',
                paymentId: 'pay_demo789012',
                status: 'completed',
                receiptNumber: `REC-${new Date().getFullYear()}-000002`,
                receiptIssued: true,
                receiptIssuedAt: new Date()
            }
        ];

        const donations = [];
        for (const data of donationData) {
            const donation = await Donation.create(data);
            donations.push(donation);
        }

        console.log('✅ Database seeded successfully!');
        console.log('\n📊 Summary:');
        console.log(`   Users: ${1 + alumni.length + students.length}`);
        console.log(`   Jobs: ${jobs.length}`);
        console.log(`   Events: ${events.length}`);
        console.log(`   Donations: ${donations.length}`);

        console.log('   Admin: admin@alumni.edu / admin123');
        console.log('   Alumni: john.doe@gmail.com / password123');
        console.log('   Student: student1@college.edu / password123');

        return true;
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        return false;
    }
};

export default seedDatabase;
