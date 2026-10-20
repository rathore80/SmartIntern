import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../services/api";

const CandidateProfile = () => {
    const { id } = useParams();

    const [candidate, setCandidate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchCandidate = async () => {
            try {
                const response = await api.get(
                    `/students/candidate/${id}`
                );

                setCandidate(response.data);
            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    "Failed to load candidate"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchCandidate();
    }, [id]);

    if (loading) {
        return <h2>Loading candidate...</h2>;
    }

    if (error) {
        return <h2>{error}</h2>;
    }

    if (!candidate) {
        return <h2>Candidate not found</h2>;
    }

    return (
        <div className="profile-page">

            <div className="profile-header">
                <div>
                    <h1>
                        {candidate.user?.name}
                    </h1>

                    <p>
                        {candidate.user?.email}
                    </p>
                </div>
            </div>

            <div className="profile-card">

                <h2>About Candidate</h2>

                <p>
                    {candidate.bio ||
                        "No bio provided."}
                </p>

            </div>

            <div className="profile-card">

                <h2>Contact</h2>

                <div className="profile-info">

                    <p>
                        <strong>Phone:</strong>{" "}
                        {candidate.phone ||
                            "Not provided"}
                    </p>

                </div>

            </div>

            <div className="profile-card">

                <h2>Skills</h2>

                {candidate.skills?.length > 0 ? (
                    <div className="skills-list">

                        {candidate.skills.map(
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
                    <p>No skills provided.</p>
                )}

            </div>

            <div className="profile-card">

                <h2>Education</h2>

                {candidate.education?.length > 0 ? (
                    candidate.education.map(
                        (education, index) => (
                            <div
                                className="profile-info"
                                key={index}
                            >
                                <h3>
                                    {education.degree}
                                </h3>

                                <p>
                                    <strong>
                                        Institution:
                                    </strong>{" "}
                                    {education.institution}
                                </p>

                                <p>
                                    <strong>
                                        Field:
                                    </strong>{" "}
                                    {education.field}
                                </p>

                                <p>
                                    <strong>
                                        Duration:
                                    </strong>{" "}
                                    {education.startYear} -{" "}
                                    {education.endYear}
                                </p>
                            </div>
                        )
                    )
                ) : (
                    <p>No education details provided.</p>
                )}

            </div>

            <div className="profile-card">

                <h2>Projects</h2>

                {candidate.projects?.length > 0 ? (
                    candidate.projects.map(
                        (project, index) => (
                            <div
                                className="profile-info"
                                key={index}
                            >
                                <h3>
                                    {project.title}
                                </h3>

                                <p>
                                    {project.description}
                                </p>

                                {project.technologies?.length > 0 && (
                                    <p>
                                        <strong>
                                            Technologies:
                                        </strong>{" "}
                                        {project.technologies.join(
                                            ", "
                                        )}
                                    </p>
                                )}

                                {project.link && (
                                    <a
                                        href={project.link}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        View Project
                                    </a>
                                )}
                            </div>
                        )
                    )
                ) : (
                    <p>No projects provided.</p>
                )}

            </div>

            <div className="profile-card">

                <h2>Experience</h2>

                {candidate.experience?.length > 0 ? (
                    candidate.experience.map(
                        (experience, index) => (
                            <div
                                className="profile-info"
                                key={index}
                            >
                                <h3>
                                    {experience.role}
                                </h3>

                                <p>
                                    <strong>
                                        Company:
                                    </strong>{" "}
                                    {experience.company}
                                </p>

                                <p>
                                    {experience.description}
                                </p>
                            </div>
                        )
                    )
                ) : (
                    <p>No experience provided.</p>
                )}

            </div>

            <div className="profile-card">

                <h2>Resume</h2>

                {candidate.resume?.url ? (
                    <a
                        href={`http://127.0.0.1:5000${candidate.resume.url}`}
                        target="_blank"
                        rel="noreferrer"
                    >
                        View Resume
                    </a>
                ) : (
                    <p>No resume uploaded.</p>
                )}

            </div>

            <div className="profile-card">

                <h2>Professional Links</h2>

                <div className="profile-info">

                    {candidate.github && (
                        <p>
                            <strong>GitHub:</strong>{" "}
                            <a
                                href={candidate.github}
                                target="_blank"
                                rel="noreferrer"
                            >
                                View GitHub
                            </a>
                        </p>
                    )}

                    {candidate.linkedin && (
                        <p>
                            <strong>LinkedIn:</strong>{" "}
                            <a
                                href={candidate.linkedin}
                                target="_blank"
                                rel="noreferrer"
                            >
                                View LinkedIn
                            </a>
                        </p>
                    )}

                    {candidate.portfolio && (
                        <p>
                            <strong>Portfolio:</strong>{" "}
                            <a
                                href={candidate.portfolio}
                                target="_blank"
                                rel="noreferrer"
                            >
                                View Portfolio
                            </a>
                        </p>
                    )}

                </div>

            </div>

            <Link
                to="/recruiter/applications"
                className="job-details-button"
            >
                Back to Applications
            </Link>

        </div>
    );
};

export default CandidateProfile;
