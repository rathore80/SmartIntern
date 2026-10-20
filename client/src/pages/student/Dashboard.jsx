
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

function Dashboard() {
    const { user } = useAuth();

    const [profile, setProfile] = useState(null);
    const [applications, setApplications] = useState([]);
    const [recommendedJobs, setRecommendedJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const results = await Promise.allSettled([
                    api.get("/students/profile"),
                    api.get("/applications/my"),
                    api.get("/recommendations")
                ]);

                if (results[0].status === "fulfilled") {
                    setProfile(results[0].value.data);
                }

                if (results[1].status === "fulfilled") {
                    setApplications(results[1].value.data);
                }

                if (results[2].status === "fulfilled") {
                    const data = results[2].value.data;
                    setRecommendedJobs(
                        Array.isArray(data)
                            ? data.slice(0, 3)
                            : data.recommendations?.slice(0, 3) || []
                    );
                }
            } catch (error) {
                console.error("Dashboard error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const calculateCompletion = () => {
        if (!profile) return 0;

        let completion = 0;

        if (profile.phone && profile.bio) completion += 15;
        if (profile.skills?.length > 0) completion += 15;
        if (profile.education?.length > 0) completion += 15;
        if (profile.projects?.length > 0) completion += 15;
        if (profile.experience?.length > 0) completion += 15;

        if (
            profile.github &&
            profile.linkedin &&
            profile.portfolio
        ) {
            completion += 15;
        }

        if (profile.resume?.url) completion += 10;

        return completion;
    };

    const getMissingSections = () => {
        if (!profile) return ["Basic Information", "Skills", "Education", "Projects", "Resume"];

        const missing = [];

        if (!profile.phone || !profile.bio) missing.push("Basic Information");
        if (!profile.skills?.length) missing.push("Skills");
        if (!profile.education?.length) missing.push("Education");
        if (!profile.projects?.length) missing.push("Projects");
        if (!profile.experience?.length) missing.push("Experience");

        if (
            !profile.github ||
            !profile.linkedin ||
            !profile.portfolio
        ) {
            missing.push("Social Links");
        }

        if (!profile.resume?.url) missing.push("Resume");

        return missing;
    };

    if (loading) {
        return (
            <div className="dashboard-page">
                <p>Loading your dashboard...</p>
            </div>
        );
    }

    const completion = calculateCompletion();
    const missingSections = getMissingSections();
    const unreadApplications = applications.filter(
        (application) => application.status === "Applied"
    ).length;

    return (
        <div className="dashboard-page student-dashboard">

            <header className="dashboard-header">
                <div>
                    <p className="dashboard-eyebrow">STUDENT PORTAL</p>
                    <h1>Welcome back, {user?.name || profile?.user?.name || "Student"} 👋</h1>
                    <p>Track your applications and discover your next opportunity.</p>
                </div>

                <Link to="/student/jobs" className="dashboard-primary-button">
                    Explore Jobs
                </Link>
            </header>

            <section className="dashboard-stats-grid">
                <div className="dashboard-stat-card">
                    <span className="dashboard-stat-label">Applications</span>
                    <strong>{applications.length}</strong>
                    <span className="dashboard-stat-caption">Jobs you've applied for</span>
                </div>

                <div className="dashboard-stat-card">
                    <span className="dashboard-stat-label">Under Review</span>
                    <strong>
                        {applications.filter(
                            (application) => application.status === "Under Review"
                        ).length}
                    </strong>
                    <span className="dashboard-stat-caption">Applications being reviewed</span>
                </div>

                <div className="dashboard-stat-card">
                    <span className="dashboard-stat-label">Shortlisted</span>
                    <strong>
                        {applications.filter(
                            (application) => application.status === "Shortlisted"
                        ).length}
                    </strong>
                    <span className="dashboard-stat-caption">Potential opportunities</span>
                </div>

                <div className="dashboard-stat-card">
                    <span className="dashboard-stat-label">Profile Completion</span>
                    <strong>{completion}%</strong>
                    <span className="dashboard-stat-caption">Make your profile stand out</span>
                </div>
            </section>

            <section className="dashboard-main-grid">

                <div className="dashboard-card profile-progress-card">
                    <div className="dashboard-section-heading">
                        <div>
                            <h2>Your Profile</h2>
                            <p>Help recruiters understand your strengths.</p>
                        </div>

                        <Link to="/student/profile">Edit profile →</Link>
                    </div>

                    <div className="profile-progress-summary">
                        <strong>{completion}%</strong>
                        <span>completed</span>
                    </div>

                    <div className="progress-container">
                        <div
                            className="progress-bar"
                            style={{ width: `${completion}%` }}
                        />
                    </div>

                    {missingSections.length === 0 ? (
                        <p className="dashboard-success-message">
                            Your profile is complete. Great work!
                        </p>
                    ) : (
                        <>
                            <p className="dashboard-muted-text">
                                Complete these sections to strengthen your profile:
                            </p>

                            <ul className="dashboard-missing-list">
                                {missingSections.map((section) => (
                                    <li key={section}>{section}</li>
                                ))}
                            </ul>
                        </>
                    )}
                </div>

                <div className="dashboard-card dashboard-quick-actions">
                    <h2>Quick Actions</h2>
                    <p>Keep your job search moving.</p>

                    <Link to="/student/jobs" className="dashboard-action-link">
                        <span>Browse jobs</span>
                        <span>→</span>
                    </Link>

                    <Link to="/student/recommendations" className="dashboard-action-link">
                        <span>Recommended for you</span>
                        <span>→</span>
                    </Link>

                    <Link to="/student/applications" className="dashboard-action-link">
                        <span>Track applications ({unreadApplications} newly applied)</span>
                        <span>→</span>
                    </Link>

                    <Link to="/notifications" className="dashboard-action-link">
                        <span>View notifications</span>
                        <span>→</span>
                    </Link>
                </div>

            </section>

            <section className="dashboard-card dashboard-applications-section">
                <div className="dashboard-section-heading">
                    <div>
                        <h2>Recent Applications</h2>
                        <p>Keep an eye on your latest applications.</p>
                    </div>

                    <Link to="/student/applications">View all →</Link>
                </div>

                {applications.length === 0 ? (
                    <div className="dashboard-empty-state">
                        <h3>Your journey starts here</h3>
                        <p>You haven't applied for any jobs yet.</p>
                        <Link to="/student/jobs" className="dashboard-primary-button">
                            Find your first job
                        </Link>
                    </div>
                ) : (
                    <div className="dashboard-recent-list">
                        {applications.slice(0, 5).map((application) => (
                            <div
                                className="dashboard-recent-item"
                                key={application._id}
                            >
                                <div>
                                    <h3>{application.job?.title || "Job application"}</h3>
                                    <p>{application.job?.company || "Company not available"}</p>
                                    <span>
                                        Applied {application.createdAt
                                            ? new Date(application.createdAt).toLocaleDateString()
                                            : "recently"}
                                    </span>
                                </div>

                                <div className="dashboard-application-status">
                                    <span className={`application-status-badge ${String(application.status || "Applied").toLowerCase().replace(/\s+/g, "-")}`}>
                                        {application.status || "Applied"}
                                    </span>

                                    <Link to={`/student/applications/${application._id}`}>
                                        Details →
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <section className="dashboard-card">
                <div className="dashboard-section-heading">
                    <div>
                        <h2>Recommended Jobs</h2>
                        <p>Explore opportunities matched to your profile.</p>
                    </div>

                    <Link to="/student/recommendations">View all →</Link>
                </div>

                {recommendedJobs.length === 0 ? (
                    <p className="dashboard-muted-text">
                        No recommendations available yet. Add skills to your profile and check again.
                    </p>
                ) : (
                    <div className="dashboard-recommended-grid">
                        {recommendedJobs.map((job) => (
                            <div className="dashboard-recommended-card" key={job._id}>
                                <h3>{job.title}</h3>
                                <p>{job.company}</p>
                                <span>{job.location || "Location not specified"}</span>

                                <Link to={`/student/jobs/${job._id}`}>
                                    View job →
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {profile && (
                <section className="dashboard-card">
                    <div className="dashboard-section-heading">
                        <div>
                            <h2>About You</h2>
                            <p>Your profile summary.</p>
                        </div>

                        <Link to="/student/profile">Edit profile →</Link>
                    </div>

                    <p>{profile.bio || "No bio added yet."}</p>

                    <h3 className="dashboard-skills-heading">Skills</h3>

                    {profile.skills?.length > 0 ? (
                        <div className="skills-container">
                            {profile.skills.map((skill, index) => (
                                <span className="skill-tag" key={`${skill}-${index}`}>
                                    {skill}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <p className="dashboard-muted-text">
                            Add your skills to help recruiters discover you.
                        </p>
                    )}
                </section>
            )}

        </div>
    );
}

export default Dashboard;
