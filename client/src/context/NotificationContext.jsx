import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import api from "../services/api";
import { useAuth } from "./AuthContext";

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
    const { user } = useAuth();
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchUnreadCount = async () => {
        if (!user) {
            setUnreadCount(0);
            return;
        }

        try {
            const response = await api.get("/notifications");

            const unread = response.data.filter(
                (notification) => !notification.isRead
            );

            setUnreadCount(unread.length);
        } catch (error) {
            console.error(
                "Failed to fetch notification count:",
                error
            );
        }
    };

    useEffect(() => {
        fetchUnreadCount();
    }, [user]);

    return (
        <NotificationContext.Provider
            value={{
                unreadCount,
                fetchUnreadCount,
                setUnreadCount
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);

    if (!context) {
        throw new Error(
            "useNotifications must be used inside NotificationProvider"
        );
    }

    return context;
};