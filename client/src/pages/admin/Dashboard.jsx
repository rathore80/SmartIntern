
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

const Dashboard = () => {
    const { user } = useAuth();

    const [stats, setStats] = useState({
        totalUsers: 0,
        totalStudents: 0,
        totalRecruiters: 0,
        totalJobs: 0,
        totalApplications: 0
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                setError("");

                const response = await api.get("/admin/dashboard");

                setStats((currentStats) => ({
                    ...currentStats,
                    ...response.data
                }));
            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    "Failed to load admin dashboard"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    if (loading) {
        return <h2>Loading admin dashboard...</h2>;
    }

    return (
        <div className="admin-dashboard">
            <div className="admin-dashboard-header">
                <h1>Admin Dashboard</h1>
                <p>
                    Welcome, <strong>{user?.name || "Admin"}</strong> 👋
                </p>
                <p>Monitor and manage the SmartIntern platform.</p>
            </div>

            {error && (
                <div className="auth-error">
                    {error}
                </div>
            )}

            <div className="admin-stats-grid">
                <div className="admin-stat-card">
                    <h3>Total Users</h3>
                    <p>{stats.totalUsers}</p>
                </div>

                <div className="admin-stat-card">
                    <h3>Students</h3>
                    <p>{stats.totalStudents}</p>
                </div>

                <div className="admin-stat-card">
                    <h3>Recruiters</h3>
                    <p>{stats.totalRecruiters}</p>
                </div>

                <div className="admin-stat-card">
                    <h3>Total Jobs</h3>
                    <p>{stats.totalJobs}</p>
                </div>

                <div className="admin-stat-card">
                    <h3>Applications</h3>
                    <p>{stats.totalApplications}</p>
                </div>
            </div>

            <div className="admin-dashboard-card">
                <h2>Platform Overview</h2>
                <p>
                    SmartIntern connects students with recruiters
                    through job opportunities and applications.
                </p>

                <div className="admin-overview-list">
                    <div>
                        <span>User accounts</span>
                        <strong>{stats.totalUsers}</strong>
                    </div>

                    <div>
                        <span>Job opportunities</span>
                        <strong>{stats.totalJobs}</strong>
                    </div>

                    <div>
                        <span>Applications submitted</span>
                        <strong>{stats.totalApplications}</strong>
                    </div>
                </div>
            </div>

            <div className="admin-dashboard-card">
                <h2>Quick Actions</h2>
                <p>Choose an area to manage.</p>

                <div className="admin-quick-actions">
                    <Link
                        to="/admin/users"
                        className="admin-action-link"
                    >
                        <h3>Manage Users</h3>
                        <p>View user accounts and remove users when necessary.</p>
                    </Link>

                    <Link
                        to="/admin/jobs"
                        className="admin-action-link"
                    >
                        <h3>Manage Jobs</h3>
                        <p>Review posted jobs and remove inappropriate listings.</p>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
