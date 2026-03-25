import Event from '../models/Event.js';

// @desc    Get all events
// @route   GET /api/events
// @access  Public
export const getEvents = async (req, res) => {
    try {
        const { type, isOnline } = req.query;

        const query = { status: 'published' };
        if (type) query.type = type;
        if (isOnline === 'true') query.isOnline = true;

        // Sort by date ascending (upcoming first)
        const events = await Event.find(query).sort({ startDate: 1 });

        res.status(200).json({
            success: true,
            count: events.length,
            data: events
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching events',
            error: error.message
        });
    }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
export const getEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id)
            .populate('organizer', 'firstName lastName')
            .populate('attendees.userId', 'firstName lastName email department');

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        res.status(200).json({
            success: true,
            data: event
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching event',
            error: error.message
        });
    }
};

// @desc    Register for event
// @route   POST /api/events/register
// @access  Private
export const registerEvent = async (req, res) => {
    try {
        const { eventId, action } = req.body;
        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        // Initialize attendees array
        if (!event.attendees) event.attendees = [];

        const isRegistered = event.attendees.some(a => a.userId.toString() === req.user.id);

        if (action === 'register') {
            if (isRegistered) {
                return res.status(400).json({
                    success: false,
                    message: 'You are already registered for this event'
                });
            }

            // Check capacity
            if (event.capacity && event.attendees.length >= event.capacity) {
                return res.status(400).json({
                    success: false,
                    message: 'Event is fully booked'
                });
            }

            event.attendees.push({
                userId: req.user.id,
                name: `${req.user.firstName} ${req.user.lastName}`,
                email: req.user.email,
                department: req.user.department,
                registeredAt: new Date()
            });

        } else if (action === 'cancel') {
            if (!isRegistered) {
                return res.status(400).json({
                    success: false,
                    message: 'You are not registered for this event'
                });
            }
            event.attendees = event.attendees.filter(a => a.userId.toString() !== req.user.id);
        }

        await event.save();

        res.status(200).json({
            success: true,
            data: event
        });
    } catch (error) {
        console.error('Event registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Error processing registration',
            error: error.message
        });
    }
};
// @desc    Create new event
// @route   POST /api/events
// @access  Private (Admin)
export const createEvent = async (req, res) => {
    try {
        req.body.organizer = req.user.id;

        // Basic validation for dates
        if (!req.body.endDate) {
            // Default duration 1 hour
            const start = new Date(req.body.startDate);
            req.body.endDate = new Date(start.getTime() + 60 * 60 * 1000);
        }

        if (req.body.endDate && new Date(req.body.endDate) < new Date(req.body.startDate)) {
            return res.status(400).json({
                success: false,
                message: 'End date cannot be before start date'
            });
        }

        // Ensure venue is present (required by schema)
        if (!req.body.venue) {
            req.body.venue = req.body.location?.address || 'TBD';
        }

        const event = await Event.create(req.body);

        res.status(201).json({
            success: true,
            data: event
        });
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating event',
            error: error.message
        });
    }
};

export default {
    getEvents,
    getEvent,
    registerEvent,
    createEvent
};
