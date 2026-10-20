import { useEffect, useState } from "react";
import api from "../../services/api";

const Jobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [editingJob, setEditingJob] = useState(null);

    const [formData, setFormData] = useState({
        title: "",
        company: "",
        description: "",
        skillsRequired: "",
        location: "",
        jobType: "Internship",
        workMode: "Remote",
        stipend: "",
        applicationDeadline: "",
        companyWebsite: ""
    });

    // Fetch recruiter jobs
    const fetchJobs = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/recruiters/jobs");

            setJobs(response.data.jobs || []);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to load jobs"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    // Handle input changes
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Open create form
    const handleCreate = () => {
        setEditingJob(null);

        setFormData({
            title: "",
            company: "",
            description: "",
            skillsRequired: "",
            location: "",
            jobType: "Internship",
            workMode: "Remote",
            stipend: "",
            applicationDeadline: "",
            companyWebsite: ""
        });

        setShowForm(true);
    };

    // Open edit form
    const handleEdit = (job) => {
        setEditingJob(job);

        setFormData({
            title: job.title || "",
            company: job.company || "",
            description: job.description || "",
            skillsRequired: job.skillsRequired?.join(", ") || "",
            location: job.location || "",
            jobType: job.jobType || "Internship",
            workMode: job.workMode || "Remote",
            stipend: job.stipend || "",
            applicationDeadline: job.applicationDeadline
                ? job.applicationDeadline.split("T")[0]
                : "",
            companyWebsite: job.companyWebsite || ""
        });

        setShowForm(true);
    };

    // Create or update job
    const handleSubmit = async (e) => {
        e.preventDefault();


        if (!formData.title.trim()) {
    setError("Job title is required.");
    return;
}

if (!formData.company.trim()) {
    setError("Company name is required.");
    return;
}

if (!formData.description.trim()) {
    setError("Job description is required.");
    return;
}

if (!formData.skillsRequired.trim()) {
    setError("At least one required skill is needed.");
    return;
}

if (!formData.location.trim()) {
    setError("Location is required.");
    return;
}

if (!formData.applicationDeadline) {
    setError("Application deadline is required.");
    return;
}

const today = new Date();
today.setHours(0, 0, 0, 0);

const deadline = new Date(
    formData.applicationDeadline
);

if (deadline < today) {
    setError(
        "Application deadline cannot be in the past."
    );
    return;
}

if (
    formData.stipend !== "" &&
    Number(formData.stipend) < 0
) {
    setError("Stipend cannot be negative.");
    return;
}
setSuccess("");
        
try {
            setError("");

            const jobData = {
                ...formData,
                skillsRequired: formData.skillsRequired
                    .split(",")
                    .map((skill) => skill.trim())
                    .filter((skill) => skill !== ""),
                stipend: formData.stipend === ""
                    ? 0
    :           Number(formData.stipend)
            };

            if (editingJob) {
                await api.put(
                    `/jobs/${editingJob._id}`,
                    jobData
                );
            } else {
                await api.post("/jobs", jobData);
            }

            setShowForm(false);
            setEditingJob(null);

            await fetchJobs();

            setSuccess(
                    editingJob
                     ? "Job updated successfully."
                    : "Job posted successfully."
            );

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to save job"
            );
        }
    };

    // Delete job
    const handleDelete = async (jobId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this job?"
        );

        if (!confirmed) return;

        try {
            setError("");

            await api.delete(`/jobs/${jobId}`);

            await fetchJobs();

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to delete job"
            );
        }
    };

    if (loading) {
        return <h2>Loading jobs...</h2>;
    }

    return (
        <div className="recruiter-jobs-page">

            <div className="recruiter-jobs-header">
                <div>
                    <h1>Manage Jobs</h1>
                    <p>
                        Create, update and manage your
                        posted jobs.
                    </p>
                </div>

                <button
                    className="create-job-button"
                    onClick={handleCreate}
                >
                    + Post New Job
                </button>
            </div>

            {error && (
                <p className="auth-error">
                    {error}
                </p>
            )}

            {success && (
    <p className="auth-success">
        {success}
    </p>
)}

            {/* Job Form */}
            {showForm && (
                <div className="job-form-card">

                    <h2>
                        {editingJob
                            ? "Edit Job"
                            : "Post New Job"}
                    </h2>

                    <form onSubmit={handleSubmit}>

                        <div className="form-group">
                            <label>Job Title</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g. React Developer Intern"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Company</label>
                            <input
                                type="text"
                                name="company"
                                value={formData.company}
                                onChange={handleChange}
                                placeholder="Company name"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Describe the job"
                                rows="5"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                Required Skills
                            </label>

                            <input
                                type="text"
                                name="skillsRequired"
                                value={formData.skillsRequired}
                                onChange={handleChange}
                                placeholder="React, JavaScript, Node.js"
                                required
                            />

                            <small>
                                Separate skills with commas.
                            </small>
                        </div>

                        <div className="form-group">
                            <label>Location</label>

                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="Bhopal"
                                required
                            />
                        </div>

                        <div className="form-row">

                            <div className="form-group">
                                <label>Job Type</label>

                                <select
                                    name="jobType"
                                    value={formData.jobType}
                                    onChange={handleChange}
                                >
                                    <option value="Internship">
                                        Internship
                                    </option>

                                    <option value="Full-time">
                                        Full-time
                                    </option>

                                    <option value="Part-time">
                                        Part-time
                                    </option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Work Mode</label>

                                <select
                                    name="workMode"
                                    value={formData.workMode}
                                    onChange={handleChange}
                                >
                                    <option value="Remote">
                                        Remote
                                    </option>

                                    <option value="On-site">
                                        On-site
                                    </option>

                                    <option value="Hybrid">
                                        Hybrid
                                    </option>
                                </select>
                            </div>

                        </div>

                        <div className="form-row">

                            <div className="form-group">
                                <label>Stipend</label>

                                <input
                                    type="number"
                                    name="stipend"
                                    value={formData.stipend}
                                    onChange={handleChange}
                                    placeholder="25000"

                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    Application Deadline
                                </label>

                                <input
                                    type="date"
                                    name="applicationDeadline"
                                    value={
                                        formData.applicationDeadline
                                    }
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                        </div>

                        <div className="form-group">
                            <label>
                                Company Website
                            </label>

                            <input
                                type="url"
                                name="companyWebsite"
                                value={formData.companyWebsite}
                                onChange={handleChange}
                                placeholder="https://example.com"
                            />
                        </div>

                        <div className="job-form-actions">

                            <button
                                type="submit"
                                className="auth-button"
                            >
                                {editingJob
                                    ? "Update Job"
                                    : "Post Job"}
                            </button>

                            <button
                                type="button"
                                className="cancel-button"
                                onClick={() =>
                                    setShowForm(false)
                                }
                            >
                                Cancel
                            </button>

                        </div>

                    </form>
                </div>
            )}

            {/* Jobs */}
            {!showForm && jobs.length === 0 ? (
                <div className="empty-state">
                    <h2>No jobs posted yet</h2>

                    <p>
                        Post your first job to start
                        receiving applications.
                    </p>
                </div>
            ) : (
                <div className="recruiter-jobs-grid">

                    {jobs.map((job) => (
                        <div
                            className="recruiter-management-card"
                            key={job._id}
                        >
                            <h2>{job.title}</h2>

                            <h3>{job.company}</h3>

                            <div className="job-management-info">

                                <p>
                                    <strong>
                                        Location:
                                    </strong>{" "}
                                    {job.location}
                                </p>

                                <p>
                                    <strong>
                                        Job Type:
                                    </strong>{" "}
                                    {job.jobType}
                                </p>

                                <p>
                                    <strong>
                                        Work Mode:
                                    </strong>{" "}
                                    {job.workMode}
                                </p>

                                <p>
                                    <strong>
                                        Stipend:
                                    </strong>{" "}
                                    ₹{job.stipend}
                                </p>

                            </div>

                            <div className="job-management-actions">

                                <button
                                    className="edit-job-button"
                                    onClick={() =>
                                        handleEdit(job)
                                    }
                                >
                                    Edit
                                </button>

                                <button
                                    className="delete-job-button"
                                    onClick={() =>
                                        handleDelete(job._id)
                                    }
                                >
                                    Delete
                                </button>

                            </div>
                        </div>
                    ))}

                </div>
            )}

        </div>
    );
};

export default Jobs;