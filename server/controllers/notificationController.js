const Notification = require("../models/Notification");

// Get notifications for logged-in user
const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({
            user: req.user.id
        })
            .sort({ createdAt: -1 })
            .limit(50);

        res.status(200).json(notifications);

    } catch (error) {
        console.error(
            "Get notifications error:",
            error
        );

        res.status(500).json({
            message: "Failed to load notifications"
        });
    }
};


// Mark notification as read
const markAsRead = async (req, res) => {
    try {
        const notification =
            await Notification.findOne({
                _id: req.params.id,
                user: req.user.id
            });

        if (!notification) {
            return res.status(404).json({
                message: "Notification not found"
            });
        }

        notification.isRead = true;

        await notification.save();

        res.status(200).json({
            message: "Notification marked as read",
            notification
        });

    } catch (error) {
        console.error(
            "Mark notification error:",
            error
        );

        res.status(500).json({
            message: "Failed to update notification"
        });
    }
};


// Mark all notifications as read
const markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            {
                user: req.user.id,
                isRead: false
            },
            {
                $set: {
                    isRead: true
                }
            }
        );

        res.status(200).json({
            message: "All notifications marked as read"
        });

    } catch (error) {
        console.error(
            "Mark all notifications error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to update notifications"
        });
    }
};


module.exports = {
    getNotifications,
    markAsRead,
    markAllAsRead
};