import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";

const JobDetails = () => {

    const { id } = useParams();

    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [applying, setApplying] = useState(false);
    const [message, setMessage] = useState("");
    const [applied, setApplied] = useState(false);

    const handleApply = async () => {
        try {
                setApplying(true);
                setMessage("");
                setError("");

            const response = await api.post("/applications", {jobId: id});

            setMessage(response.data.message);
            setApplied(true);
        } 
        catch (error) {
            setError(
                error.response?.data?.message || "Failed to apply for job");
        } 
        finally {
            setApplying(false);
        }
};
    
    useEffect(() => {
        const fetchJob = async () => {
            try {
                const response = await api.get(`/jobs/${id}`);

                setJob(response.data);
            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    "Failed to load job"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchJob();
    }, [id]);


    if (loading) {
        return <h2>Loading job...</h2>;
    }

    if (error) {
        return <h2>{error}</h2>;
    }

    if (!job) {
        return <h2>Job not found</h2>;
    }


    return (
        <div className="job-details-page">

            <div className="job-details-card">

                {/* Header */}
                <div className="job-details-header">

                    <h1>{job.title}</h1>

                    <h2>{job.company}</h2>

                </div>


                {/* Job Information */}
                <div className="job-details-info">

                    <div>
                        <strong>Location</strong>
                        <p>{job.location}</p>
                    </div>

                    <div>
                        <strong>Job Type</strong>
                        <p>{job.jobType}</p>
                    </div>

                    <div>
                        <strong>Work Mode</strong>
                        <p>{job.workMode}</p>
                    </div>

                    <div>
                        <strong>Stipend</strong>
                        <p>₹{job.stipend}</p>
                    </div>

                </div>


                {/* Description */}
                <div className="job-section">

                    <h3>Description</h3>

                    <p>{job.description}</p>

                </div>


                {/* Skills */}
                <div className="job-section">

                    <h3>Required Skills</h3>

                    <div className="skills-container">

                        {job.skillsRequired?.map(
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

                </div>


                {/* Deadline */}
                <div className="job-section">

                    <h3>Application Deadline</h3>

                    <p>
                        {job.applicationDeadline
                            ? new Date(
                                job.applicationDeadline
                            ).toLocaleDateString()
                            : "Not specified"}
                    </p>

                </div>


                {/* Company Website */}
                {job.companyWebsite && (
                    <div className="job-section">

                        <h3>Company Website</h3>

                        <a
                            href={job.companyWebsite}
                            target="_blank"
                            rel="noreferrer"
                        >
                            Visit Website
                        </a>

                    </div>
                )}


                {/* Application */}
                <div className="apply-section">

                    <button
                        className="apply-button"
                        onClick={handleApply}
                        disabled={applying || applied}
                    >
                        {applying
                            ? "Applying..."
                            : applied
                            ? "Application Submitted"
                            : "Apply for this Job"}
                    </button>

                        {message && (
                            <p className="success-message">
                                {message}
                            </p>
                        )}

                        {error && (
                            <p className="auth-error">
                                {error}
                            </p>
                        )}

                </div>

            </div>

        </div>
    );
};

export default JobDetails;