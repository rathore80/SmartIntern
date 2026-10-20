import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

const Jobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [jobType, setJobType] = useState("");
    const [workMode, setWorkMode] = useState("");
    const [location, setLocation] = useState("");
    const [minStipend, setMinStipend] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const jobsPerPage = 6;
    useEffect(() => {
    setCurrentPage(1);
}, [search, jobType, workMode, location, minStipend]);
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await api.get("/jobs");

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

        fetchJobs();
    }, []);

    if (loading) {
        return <h2>Loading jobs...</h2>;
    }

    if (error) {
        return <h2>{error}</h2>;
    }

  const filteredJobs = jobs.filter((job) => {
    const searchText = search.trim().toLowerCase();

    const title = job.title?.toLowerCase() || "";
    const company = job.company?.toLowerCase() || "";
    const jobLocation = job.location?.toLowerCase() || "";
    const jobTypeText = job.jobType?.toLowerCase() || "";
    const workModeText = job.workMode?.toLowerCase() || "";

    const skills = Array.isArray(job.skillsRequired)
        ? job.skillsRequired.join(" ").toLowerCase()
        : "";

    const matchesSearch =
        title.includes(searchText) ||
        company.includes(searchText) ||
        jobLocation.includes(searchText) ||
        jobTypeText.includes(searchText) ||
        workModeText.includes(searchText) ||
        skills.includes(searchText);

    const matchesJobType =
        jobType === "" || job.jobType === jobType;

    const matchesWorkMode =
        workMode === "" || job.workMode === workMode;

    const matchesLocation =
        location.trim() === "" ||
        jobLocation.includes(location.trim().toLowerCase());

    const matchesMinStipend =
        minStipend === "" ||
        Number(job.stipend || 0) >= Number(minStipend);

    return (
        matchesSearch &&
        matchesJobType &&
        matchesWorkMode &&
        matchesLocation &&
        matchesMinStipend
    );
});

const totalPages = Math.ceil(
    filteredJobs.length / jobsPerPage
);

const startIndex =
    (currentPage - 1) * jobsPerPage;

const paginatedJobs = filteredJobs.slice(
    startIndex,
    startIndex + jobsPerPage
);

    return (
        <div className="jobs-page">

            <div className="jobs-header">
                <h1>Available Jobs</h1>

                <p>
                    Find internships and jobs that match your
                    skills and interests.
                </p>
                <div className="job-search">
                 <input
                    type="text"
                    placeholder="Search by job title, company, or skill..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="job-filters">

    <select
        value={jobType}
        onChange={(e) => setJobType(e.target.value)}
    >
        <option value="">All Job Types</option>
        <option value="Internship">Internship</option>
        <option value="Full-time">Full-time</option>
        <option value="Part-time">Part-time</option>
    </select>

    <select
        value={workMode}
        onChange={(e) => setWorkMode(e.target.value)}
    >
        <option value="">All Work Modes</option>
        <option value="Remote">Remote</option>
        <option value="On-site">On-site</option>
        <option value="Hybrid">Hybrid</option>
    </select>

    <input
        type="text"
        placeholder="Filter by location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
    />

    <input
        type="number"
        placeholder="Minimum stipend"
        value={minStipend}
        onChange={(e) => setMinStipend(e.target.value)}
    />

</div>
            </div>
              {filteredJobs.length === 0 ? (
                <div className="empty-state">
    <h2>
        {search
            ? "No matching jobs found"
            : "No jobs available"}
    </h2>

    <p>
        {search
            ? "Try searching for a different job title, company, or skill."
            : "Check back later for new opportunities."}
    </p>
</div>   ) : (
                <div className="jobs-grid">

                    {paginatedJobs.map((job) => (

                        <div
                            className="job-card"
                            key={job._id}
                        >

                            <h2>{job.title}</h2>

                            <h3>{job.company}</h3>


                            <div className="job-info">

                                <p>
                                    <strong>Location:</strong>{" "}
                                    {job.location}
                                </p>

                                <p>
                                    <strong>Job Type:</strong>{" "}
                                    {job.jobType}
                                </p>

                                <p>
                                    <strong>Work Mode:</strong>{" "}
                                    {job.workMode}
                                </p>

                                <p>
                                    <strong>Stipend:</strong>{" "}
                                    ₹{job.stipend}
                                </p>

                            </div>
                            {totalPages > 1 && (
    <div className="pagination">

        <button
            onClick={() =>
                setCurrentPage((prev) => prev - 1)
            }
            disabled={currentPage === 1}
        >
            Previous
        </button>

        {Array.from(
            { length: totalPages },
            (_, index) => index + 1
        ).map((page) => (
            <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={
                    currentPage === page
                        ? "active-page"
                        : ""
                }
            >
                {page}
            </button>
        ))}

        <button
            onClick={() =>
                setCurrentPage((prev) => prev + 1)
            }
            disabled={currentPage === totalPages}
        >
            Next
        </button>

    </div>
)}

                            <Link
                                to={`/student/jobs/${job._id}`}
                                className="job-details-button"
                            >
                                View Details
                            </Link>

                        </div>

                    ))}

                </div>
            )}

        </div>
    );
};

export default Jobs;