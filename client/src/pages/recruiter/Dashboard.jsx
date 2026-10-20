
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

const Dashboard = () => {
    const { user } = useAuth();

    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const results = await Promise.allSettled([
                    api.get("/recruiters/dashboard"),
                    api.get("/applications/recruiter")
                ]);

                if (results[0].status === "fulfilled") {
                    setJobs(results[0].value.data.jobs || []);
                }

                if (results[1].status === "fulfilled") {
                    setApplications(
                        Array.isArray(results[1].value.data)
                            ? results[1].value.data
                            : []
                    );
                }

                if (
                    results[0].status === "rejected" &&
                    results[1].status === "rejected"
                ) {
                    setError("Failed to load dashboard. Please try again.");
                }
            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    "Failed to load dashboard"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    if (loading) {
        return (
            <div className="recruiter-dashboard recruiter-dashboard-page">
                <p>Loading your dashboard...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="recruiter-dashboard recruiter-dashboard-page">
                <h2>Dashboard unavailable</h2>
                <p>{error}</p>
            </div>
        );
    }

    const shortlistedCount = applications.filter(
        (application) => application.status === "Shortlisted"
    ).length;

    const pendingCount = applications.filter(
        (application) =>
            application.status === "Applied" ||
            application.status === "Under Review"
    ).length;

    const selectedCount = applications.filter(
        (application) => application.status === "Selected"
    ).length;

    return (
        <div className="recruiter-dashboard recruiter-dashboard-page">

            <header className="recruiter-dashboard-header">
                <div>
                    <p className="recruiter-dashboard-eyebrow">
                        RECRUITER PORTAL
                    </p>

                    <h1>
                        Welcome back, {user?.name || "Recruiter"} 👋
                    </h1>

                    <p>
                        Manage your job postings and discover great candidates.
                    </p>
                </div>

                <Link
                    to="/recruiter/jobs"
                    className="recruiter-dashboard-primary-button"
                >
                    + Manage Jobs
                </Link>
            </header>

            <section className="recruiter-dashboard-stats">
                <div className="recruiter-dashboard-stat">
                    <span>Total Jobs Posted</span>
                    <strong>{jobs.length}</strong>
                    <small>Your active job listings</small>
                </div>

                <div className="recruiter-dashboard-stat">
                    <span>Total Applications</span>
                    <strong>{applications.length}</strong>
                    <small>Applications received</small>
                </div>

                <div className="recruiter-dashboard-stat">
                    <span>Pending Review</span>
                    <strong>{pendingCount}</strong>
                    <small>Applied or under review</small>
                </div>

                <div className="recruiter-dashboard-stat">
                    <span>Shortlisted</span>
                    <strong>{shortlistedCount}</strong>
                    <small>Potential candidates</small>
                </div>
            </section>

            <section className="recruiter-dashboard-content-grid">

                <div className="recruiter-dashboard-panel">
                    <div className="recruiter-dashboard-section-heading">
                        <div>
                            <h2>Recent Job Postings</h2>
                            <p>Your latest job listings.</p>
                        </div>

                        <Link to="/recruiter/jobs">View all →</Link>
                    </div>

                    {jobs.length === 0 ? (
                        <div className="recruiter-dashboard-empty">
                            <h3>Start hiring today</h3>
                            <p>
                                You haven't posted any jobs yet.
                            </p>

                            <Link
                                to="/recruiter/jobs"
                                className="recruiter-dashboard-primary-button"
                            >
                                Create a Job
                            </Link>
                        </div>
                    ) : (
                        <div className="recruiter-dashboard-job-list">
                            {jobs.slice(0, 5).map((job) => (
                                <div
                                    className="recruiter-dashboard-job"
                                    key={job._id}
                                >
                                    <div className="recruiter-dashboard-job-main">
                                        <h3>{job.title}</h3>
                                        <p>{job.company || "Company not specified"}</p>

                                        <div className="recruiter-dashboard-job-meta">
                                            <span>{job.location || "Location not specified"}</span>
                                            <span>{job.workMode || "Work mode not specified"}</span>
                                            <span>{job.jobType || "Job type not specified"}</span>
                                        </div>
                                    </div>

                                    <Link
                                        to="/recruiter/jobs"
                                        className="recruiter-dashboard-view-link"
                                    >
                                        Manage →
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="recruiter-dashboard-panel">
                    <h2>Hiring Overview</h2>
                    <p className="recruiter-dashboard-panel-description">
                        A quick look at your recruitment progress.
                    </p>

                    <div className="recruiter-dashboard-overview-item">
                        <span>Pending review</span>
                        <strong>{pendingCount}</strong>
                    </div>

                    <div className="recruiter-dashboard-overview-item">
                        <span>Shortlisted</span>
                        <strong>{shortlistedCount}</strong>
                    </div>

                    <div className="recruiter-dashboard-overview-item">
                        <span>Selected</span>
                        <strong>{selectedCount}</strong>
                    </div>

                    <Link
                        to="/recruiter/applications"
                        className="recruiter-dashboard-primary-button recruiter-dashboard-full-button"
                    >
                        Review Applications
                    </Link>

                    <Link
                        to="/recruiter/profile"
                        className="recruiter-dashboard-secondary-link"
                    >
                        Update Company Profile →
                    </Link>
                </div>

            </section>

        </div>
    );
};

export default Dashboard;
