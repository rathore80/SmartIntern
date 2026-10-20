import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../services/api";

const ApplicationDetails = () => {
    const { id } = useParams();

    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchApplication = async () => {
            try {
                const response = await api.get(
                    `/applications/${id}`
                );

                setApplication(response.data);
            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    "Failed to load application"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchApplication();
    }, [id]);

    if (loading) {
        return <h2>Loading application...</h2>;
    }

    if (error) {
        return <h2>{error}</h2>;
    }

    if (!application) {
        return <h2>Application not found</h2>;
    }

    const job = application.job;

    return (
        <div className="application-details-page">

            <div className="application-details-header">
                <h1>Application Details</h1>

                <p>
                    Details of your job application.
                </p>
            </div>

            <div className="application-details-card">

                <h2>{job?.title}</h2>

                <h3>{job?.company}</h3>

                <div className="application-info">

                    <p>
                        <strong>Location:</strong>{" "}
                        {job?.location}
                    </p>

                    <p>
                        <strong>Job Type:</strong>{" "}
                        {job?.jobType}
                    </p>

                    <p>
                        <strong>Work Mode:</strong>{" "}
                        {job?.workMode}
                    </p>

                    <p>
                        <strong>Stipend:</strong>{" "}
                        ₹{job?.stipend}
                    </p>

                </div>

                <div className="application-status">
                    <strong>Application Status:</strong>{" "}

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

                <div className="application-tracker">

    <div
        className={`tracker-step ${
            ["Applied", "Under Review", "Shortlisted", "Selected"]
                .includes(application.status)
                ? "completed"
                : ""
        }`}
    >
        <span>1</span>
        <p>Applied</p>
    </div>

            <div
                className={`tracker-step ${
                    ["Under Review", "Shortlisted", "Selected"]
                        .includes(application.status)
                        ? "completed"
                        : ""
                }`}
            >
                <span>2</span>
                <p>Under Review</p>
            </div>

            <div
                className={`tracker-step ${
                    ["Shortlisted", "Selected"]
                        .includes(application.status)
                        ? "completed"
                        : ""
                }`}
            >
                <span>3</span>
                <p>Shortlisted</p>
            </div>

            <div
                className={`tracker-step ${
                    application.status === "Selected"
                        ? "completed"
                        : ""
                }`}
            >
                <span>4</span>
                <p>Selected</p>
            </div>

        </div>

                <div className="application-section">

                    <h3>Job Description</h3>

                    <p>
                        {job?.description ||
                            "No description available."}
                    </p>

                </div>

                <div className="application-section">

                    <h3>Required Skills</h3>

                    {job?.skillsRequired?.length > 0 ? (
                        <div className="skills-list">

                            {job.skillsRequired.map(
                                (skill, index) => (
                                    <span
                                        className="skill-tag"
                                        key={index}
                                    >
                                        {skill}
                                    </span>
                                )
                            )}

                        </div>
                    ) : (
                        <p>
                            No specific skills listed.
                        </p>
                    )}

                </div>

                <div className="application-section">

                    <h3>Application Information</h3>

                    <p>
                        <strong>Applied On:</strong>{" "}
                        {application.createdAt
                            ? new Date(
                                application.createdAt
                            ).toLocaleDateString()
                            : "Not available"}
                    </p>

                    <p>
                        <strong>Resume:</strong>{" "}
                        {application.resume
                            ? application.resume
                            : "No resume attached"}
                    </p>

                </div>

                <Link
                    to="/student/applications"
                    className="job-details-button"
                >
                    Back to Applications
                </Link>

            </div>

        </div>
    );
};

export default ApplicationDetails;