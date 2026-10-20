import { useEffect, useState } from "react";
import api from "../../services/api";

const Jobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchJobs = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/admin/jobs");

            setJobs(response.data);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to load jobs"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteJob = async (jobId) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this job?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            setError("");

            await api.delete(`/admin/jobs/${jobId}`);

            setJobs((prevJobs) =>
                prevJobs.filter(
                    (job) => job._id !== jobId
                )
            );

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to delete job"
            );
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    if (loading) {
        return (
            <div className="admin-jobs-page">
                <h1>Job Management</h1>
                <p>Loading jobs...</p>
            </div>
        );
    }

    return (
        <div className="admin-jobs-page">

            <div className="admin-jobs-header">
                <h1>Job Management</h1>
                <p>
                    View and manage all jobs posted on SmartIntern.
                </p>
            </div>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {jobs.length === 0 ? (
                <div className="empty-state">
                    <h3>No jobs found</h3>
                    <p>
                        There are currently no jobs posted.
                    </p>
                </div>
            ) : (
                <div className="admin-jobs-table-wrapper">
                    <table className="admin-jobs-table">

                        <thead>
                            <tr>
                                <th>Job</th>
                                <th>Company</th>
                                <th>Recruiter</th>
                                <th>Location</th>
                                <th>Type</th>
                                <th>Work Mode</th>
                                <th>Deadline</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {jobs.map((job) => (
                                <tr key={job._id}>

                                    <td>
                                        <div className="admin-job-title">
                                            <strong>
                                                {job.title}
                                            </strong>

                                            <span>
                                                ₹{job.stipend || 0} stipend
                                            </span>
                                        </div>
                                    </td>

                                    <td>
                                        <span className="admin-company-name">
                                            {job.company}
                                        </span>
                                    </td>

                                    <td>
                                        <div className="admin-recruiter-info">
                                            <strong>
                                                {job.recruiter?.name || "N/A"}
                                            </strong>

                                            <span>
                                                {job.recruiter?.email || ""}
                                            </span>
                                        </div>
                                    </td>

                                    <td>
                                        <span className="admin-location">
                                            {job.location || "N/A"}
                                        </span>
                                    </td>

                                    <td>
                                        <span className="job-type-badge">
                                            {job.jobType || "N/A"}
                                        </span>
                                    </td>

                                    <td>
                                        <span className="work-mode-badge">
                                            {job.workMode || "N/A"}
                                        </span>
                                    </td>

                                    <td>
                                        <span className="admin-deadline">
                                            {job.applicationDeadline
                                                ? new Date(
                                                    job.applicationDeadline
                                                ).toLocaleDateString()
                                                : "N/A"}
                                        </span>
                                    </td>

                                    <td>
                                        <button
                                            type="button"
                                            className="admin-delete-button"
                                            onClick={() =>
                                                handleDeleteJob(job._id)
                                            }
                                        >
                                            Delete
                                        </button>
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

export default Jobs;