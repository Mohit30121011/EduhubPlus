const { Notification, User } = require('../models');
const { Op } = require('sequelize');

// @desc    Create notification (admin sends announcement)
// @route   POST /api/notifications
// @access  Private/Admin
const createNotification = async (req, res) => {
    try {
        const { title, message, type, targetRole, targetUserId } = req.body;

        if (!title || !message) {
            return res.status(400).json({ message: 'Title and message are required' });
        }

        const notifications = [];

        if (targetUserId) {
            // Send to specific user
            notifications.push({ userId: targetUserId, title, message, type: type || 'INFO' });
        } else if (targetRole) {
            // Send to all users with a specific role
            const users = await User.findAll({ where: { role: targetRole, isActive: true }, attributes: ['id'] });
            users.forEach(u => {
                notifications.push({ userId: u.id, title, message, type: type || 'INFO' });
            });
        } else {
            // Send to all active users
            const users = await User.findAll({ where: { isActive: true }, attributes: ['id'] });
            users.forEach(u => {
                notifications.push({ userId: u.id, title, message, type: type || 'INFO' });
            });
        }

        if (notifications.length === 0) {
            return res.status(400).json({ message: 'No recipients found' });
        }

        await Notification.bulkCreate(notifications);

        res.status(201).json({
            message: `Notification sent to ${notifications.length} user(s)`,
            count: notifications.length
        });
    } catch (error) {
        console.error('Create Notification Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get my notifications (paginated)
// @route   GET /api/notifications/my?page=1&limit=20
// @access  Private
const getMyNotifications = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;

        const { count, rows } = await Notification.findAndCountAll({
            where: { userId: req.user.id },
            order: [['createdAt', 'DESC']],
            limit,
            offset
        });

        res.json({
            notifications: rows,
            total: count,
            page,
            pages: Math.ceil(count / limit)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get unread count
// @route   GET /api/notifications/unread-count
// @access  Private
const getUnreadCount = async (req, res) => {
    try {
        const count = await Notification.count({
            where: { userId: req.user.id, isRead: false }
        });
        res.json({ count });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Mark single notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findOne({
            where: { id: req.params.id, userId: req.user.id }
        });

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        await notification.update({ isRead: true });
        res.json({ message: 'Marked as read' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Mark all as read
// @route   PUT /api/notifications/read-all
// @access  Private
const markAllAsRead = async (req, res) => {
    try {
        await Notification.update(
            { isRead: true },
            { where: { userId: req.user.id, isRead: false } }
        );
        res.json({ message: 'All notifications marked as read' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
const deleteNotification = async (req, res) => {
    try {
        const notification = await Notification.findOne({
            where: { id: req.params.id, userId: req.user.id }
        });

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        await notification.destroy();
        res.json({ message: 'Notification deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createNotification,
    getMyNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification
};
