import { useEffect, useState } from "react";
import api from "../../services/api";

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get(
                    "/admin/users"
                );

                setUsers(response.data);
            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    "Failed to load users"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleDeleteUser = async (userId) => {
    const confirmDelete = window.confirm(
        "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) {
        return;
    }

    try {
        setError("");

        await api.delete(`/admin/users/${userId}`);

        setUsers((prevUsers) =>
            prevUsers.filter(
                (user) => user._id !== userId
            )
        );
    } catch (error) {
        setError(
            error.response?.data?.message ||
            "Failed to delete user"
        );
    }
};
    if (loading) {
        return <h2>Loading users...</h2>;
    }

    if (error) {
        return <h2>{error}</h2>;
    }

    return (
        <div className="admin-users-page">

            <div className="admin-users-header">
                <h1>User Management</h1>

                <p>
                    View all registered users on
                    SmartIntern.
                </p>
            </div>

            {users.length === 0 ? (
                <div className="empty-state">
                    <h2>No users found</h2>

                    <p>
                        There are no registered users.
                    </p>
                </div>
            ) : (
                <div className="admin-users-table-wrapper">

                    <table className="admin-users-table">

                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Registered</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>

                            {users.map((user) => (
                                <tr key={user._id}>
                                    <td>
                                        {user.name}
                                    </td>

                                    <td>
                                        {user.email}
                                    </td>

                                    <td>
                                        <span
                                            className={`role-badge ${user.role}`}
                                        >
                                            {user.role}
                                        </span>
                                    </td>

                                    <td>
                                        {user.createdAt
                                            ? new Date(
                                                user.createdAt
                                            ).toLocaleDateString()
                                            : "N/A"}
                                    </td>
                                                                     <td>
                                        {user.role !== "admin" && (
                                            <button
                                                type="button"
                                                className="delete-item-button"
                                                onClick={() =>
                                                    handleDeleteUser(user._id)
                                                }
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </td>

                                </tr>
                            ))}

                        </tbody>

                    </table>

                </div>
            )}

        </div>
    );
};

export default Users;