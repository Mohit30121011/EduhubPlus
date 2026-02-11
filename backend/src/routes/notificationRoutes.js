const express = require('express');
const router = express.Router();
const {
    createNotification,
    getMyNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification
} = require('../controllers/notificationController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Admin: create notification (send to all/role/user)
router.post('/', protect, authorize('ADMIN', 'SUPER_ADMIN'), createNotification);

// User: get own notifications
router.get('/my', protect, getMyNotifications);

// User: unread count (for bell badge)
router.get('/unread-count', protect, getUnreadCount);

// User: mark all as read
router.put('/read-all', protect, markAllAsRead);

// User: mark single as read
router.put('/:id/read', protect, markAsRead);

// User: delete notification
router.delete('/:id', protect, deleteNotification);

module.exports = router;
