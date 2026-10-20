import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

const Applications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await api.get("/applications/my");

                setApplications(response.data);
            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    "Failed to load applications"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, []);

    if (loading) {
        return <h2>Loading applications...</h2>;
    }

    if (error) {
        return <h2>{error}</h2>;
    }

    return (
        <div className="applications-page">

            <div className="applications-header">
                <h1>My Applications</h1>

                <p>
                    Track the jobs you have applied for
                    and their current status.
                </p>
            </div>

            {applications.length === 0 ? (
                <div className="empty-state">
                    <h2>No applications yet</h2>

                    <p>
                        Apply for a job to see your
                        application here.
                    </p>
                </div>
            ) : (
                <div className="applications-grid">

                    {applications.map((application) => (
                        <div
                            className="application-card"
                            key={application._id}
                        >

                            <h2>
                                {application.job?.title}
                            </h2>

                            <h3>
                                {application.job?.company}
                            </h3>

                            <div className="application-info">

                                <p>
                                    <strong>
                                        Location:
                                    </strong>{" "}
                                    {application.job?.location}
                                </p>

                                <p>
                                    <strong>
                                        Job Type:
                                    </strong>{" "}
                                    {application.job?.jobType}
                                </p>

                                <p>
                                    <strong>
                                        Work Mode:
                                    </strong>{" "}
                                    {application.job?.workMode}
                                </p>

                                <p>
                                    <strong>
                                        Stipend:
                                    </strong>{" "}
                                    ₹{application.job?.stipend}
                                </p>

                            </div>

                            <div className="application-status">

                                <strong>Status:</strong>{" "}

                                <span
                                    className={`status ${
                                        application.status
                                            .toLowerCase()
                                            .replace(" ", "-")
                                    }`}
                                >
                                    {application.status}
                                </span>

                            </div>

                             <div className="mini-tracker">

                {[
                    "Applied",
                    "Under Review",
                    "Shortlisted",
                    "Selected"
                ].map((stage, index) => {

                    const stages = [
                        "Applied",
                        "Under Review",
                        "Shortlisted",
                        "Selected"
                    ];

                    const currentIndex =
                        stages.indexOf(application.status);

                    return (
                        <div
                            key={stage}
                            className={
                                index <= currentIndex
                                    ? "mini-tracker-step active"
                                    : "mini-tracker-step"
                            }
                        >
                            <span></span>
                            <small>{stage}</small>
                        </div>
                    );
                })}

            </div>
                            <div style={{ marginTop: "15px" }}>
    <Link
        to={`/student/applications/${application._id}`}
        className="job-details-button"
    >
        View Application
    </Link>
</div>

                        </div>
                    ))}

                </div>
            )}

        </div>
    );
};

export default Applications;