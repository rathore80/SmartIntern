import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useNotifications } from "../context/NotificationContext";

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { fetchUnreadCount } = useNotifications();
    const fetchNotifications = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/notifications");

            setNotifications(response.data);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to load notifications"
            );
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        try {
            await api.put(`/notifications/${id}/read`);

            setNotifications((prevNotifications) =>
                prevNotifications.map((notification) =>
                    notification._id === id
                        ? {
                            ...notification,
                            isRead: true
                        }
                        : notification
                )
            );
            await fetchUnreadCount();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to update notification"
            );
        }
        
    };

    const markAllAsRead = async () => {
        try {
            await api.put("/notifications/read-all");

            setNotifications((prevNotifications) =>
                prevNotifications.map((notification) => ({
                    ...notification,
                    isRead: true
                }))
            );
            await fetchUnreadCount();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to update notifications"
            );
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    if (loading) {
        return (
            <div className="notifications-page">
                <h1>Notifications</h1>
                <p>Loading notifications...</p>
            </div>
        );
    }

    return (
        <div className="notifications-page">

            <div className="notifications-header">
                <div>
                    <h1>Notifications</h1>
                    <p>
                        Stay updated with your SmartIntern activity.
                    </p>
                </div>

                {notifications.some(
                    (notification) => !notification.isRead
                ) && (
                    <button
                        className="mark-all-read-button"
                        onClick={markAllAsRead}
                    >
                        Mark all as read
                    </button>
                )}
            </div>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {notifications.length === 0 ? (
                <div className="empty-state">
                    <h3>No notifications</h3>
                    <p>
                        You're all caught up.
                    </p>
                </div>
            ) : (
                <div className="notifications-list">

                    {notifications.map((notification) => (
                        <div
                            key={notification._id}
                            className={`notification-card ${
                                notification.isRead
                                    ? "read"
                                    : "unread"
                            }`}
                        >
                            <div className="notification-content">

                                <div className="notification-icon">
                                    🔔
                                </div>

                                <div>
                                    <p>
                                        {notification.message}
                                    </p>

                                    <small>
                                        {new Date(
                                            notification.createdAt
                                        ).toLocaleString()}
                                    </small>
                                </div>

                            </div>

                            {!notification.isRead && (
                                <button
                                    className="mark-read-button"
                                    onClick={() =>
                                        markAsRead(
                                            notification._id
                                        )
                                    }
                                >
                                    Mark as read
                                </button>
                            )}
                        </div>
                    ))}

                </div>
            )}

            <Link
                to="/"
                className="back-home-button"
            >
                Back to Home
            </Link>

        </div>
    );
};

export default Notifications;