import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

const Applications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchApplications = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(
                "/applications/recruiter"
            );

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

    useEffect(() => {
        fetchApplications();
    }, []);

    const handleStatusChange = async (
        applicationId,
        newStatus
    ) => {
        try {
            await api.put(
                `/applications/${applicationId}/status`,
                {
                    status: newStatus
                }
            );

            await fetchApplications();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to update application status"
            );
        }
    };

    if (loading) {
        return <h2>Loading applications...</h2>;
    }

    return (
        <div className="recruiter-applications-page">

            <div className="recruiter-applications-header">
                <h1>Applications</h1>

                <p>
                    Review applications submitted
                    for your jobs.
                </p>
            </div>

            {error && (
                <p className="auth-error">
                    {error}
                </p>
            )}

            {applications.length === 0 ? (
                <div className="empty-state">
                    <h2>No applications yet</h2>

                    <p>
                        Applications from students will
                        appear here.
                    </p>
                </div>
            ) : (
                <div className="recruiter-applications-grid">

                    {applications.map((application) => (
                        <div
                            className="recruiter-application-card"
                            key={application._id}
                        >

                            <div className="application-card-header">
                                <div>
                                    <h2>
                                        {application.student?.name}
                                    </h2>

                                    <p>
                                        {application.student?.email}
                                    </p>
                                </div>

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

                            <div className="recruiter-application-info">

                                <p>
                                    <strong>Job:</strong>{" "}
                                    {application.job?.title}
                                </p>

                                <p>
                                    <strong>Company:</strong>{" "}
                                    {application.job?.company}
                                </p>

                                <p>
                                    <strong>Applied:</strong>{" "}
                                    {new Date(
                                        application.createdAt
                                    ).toLocaleDateString()}
                                </p>

                            </div>

                            <div className="application-status-control">

                                <label>
                                    Update Status
                                </label>

                                <select
                                    value={application.status}
                                    onChange={(e) =>
                                        handleStatusChange(
                                            application._id,
                                            e.target.value
                                        )
                                    }
                                >
                                    <option value="Applied">
                                        Applied
                                    </option>

                                    <option value="Under Review">
                                        Under Review
                                    </option>

                                    <option value="Shortlisted">
                                        Shortlisted
                                    </option>

                                    <option value="Rejected">
                                        Rejected
                                    </option>

                                    <option value="Selected">
                                        Selected
                                    </option>
                                </select>

                            </div>


                            <div style={{ marginTop: "15px" }}>
    <Link
    to={`/recruiter/candidates/${application.student?._id}`}
    className="job-details-button"
>
    View Candidate
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