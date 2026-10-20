import { useEffect, useState } from "react";
import api from "../services/api";

function Profile() {

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState("");
     const [resumeFile, setResumeFile] = useState(null);
    const [uploadingResume, setUploadingResume] = useState(false);
    const [formData, setFormData] = useState({
        phone: "",
        location: "",
        workMode: "Remote",
        bio: "",
        skills: "",
        education: [],
        projects: [],
        experience: [],
        github: "",
        linkedin: "",
        portfolio: ""
    });

    const fetchProfile = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(
                "/students/profile"
            );

            setProfile(response.data);

            setFormData({
                phone: response.data.phone || "",
                location: response.data.location || "",
                workMode: response.data.workMode || "Remote",
                bio: response.data.bio || "",

                skills:
                    response.data.skills?.join(", ") || "",

                education:
                    response.data.education || [],

                projects:
                    response.data.projects || [],

                experience:
                    response.data.experience || [],

                github: response.data.github || "",
                linkedin: response.data.linkedin || "",
                portfolio: response.data.portfolio || ""
            });

        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to load profile"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleEducationChange = (
        index,
        field,
        value
    ) => {
        const updatedEducation = [...formData.education];

        updatedEducation[index] = {
            ...updatedEducation[index],
            [field]: value
        };

        setFormData({
            ...formData,
            education: updatedEducation
        });
    };

    const addEducation = () => {
        setFormData({
            ...formData,
            education: [
                ...formData.education,
                {
                    degree: "",
                    institution: "",
                    field: "",
                    startYear: "",
                    endYear: ""
                }
            ]
        });
    };

    const removeEducation = (index) => {
        const updatedEducation =
            formData.education.filter(
                (_, i) => i !== index
            );

        setFormData({
            ...formData,
            education: updatedEducation
        });
    };

    const handleProjectChange = (
        index,
        field,
        value
    ) => {
        const updatedProjects = [...formData.projects];

        updatedProjects[index] = {
            ...updatedProjects[index],
            [field]: value
        };

        setFormData({
            ...formData,
            projects: updatedProjects
        });
    };

    const addProject = () => {
        setFormData({
            ...formData,
            projects: [
                ...formData.projects,
                {
                    title: "",
                    description: "",
                    technologies: [],
                    link: ""
                }
            ]
        });
    };

    const removeProject = (index) => {
        const updatedProjects =
            formData.projects.filter(
                (_, i) => i !== index
            );

        setFormData({
            ...formData,
            projects: updatedProjects
        });
    };

    const handleExperienceChange = (
        index,
        field,
        value
    ) => {
        const updatedExperience = [
            ...formData.experience
        ];

        updatedExperience[index] = {
            ...updatedExperience[index],
            [field]: value
        };

        setFormData({
            ...formData,
            experience: updatedExperience
        });
    };

    const addExperience = () => {
        setFormData({
            ...formData,
            experience: [
                ...formData.experience,
                {
                    company: "",
                    role: "",
                    startDate: "",
                    endDate: "",
                    description: ""
                }
            ]
        });
    };

    const removeExperience = (index) => {
        const updatedExperience =
            formData.experience.filter(
                (_, i) => i !== index
            );

        setFormData({
            ...formData,
            experience: updatedExperience
        });
    };

    const handleSave = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);
            setError("");
            setSuccess("");

            const dataToSend = {
                ...formData,

                skills: formData.skills
                    .split(",")
                    .map((skill) => skill.trim())
                    .filter((skill) => skill !== "")
            };

            await api.put(
                "/students/profile",
                dataToSend
            );

            await fetchProfile();

            setEditing(false);
            setSuccess(
                "Profile updated successfully."
            );

        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to update profile"
            );
        } finally {
            setSaving(false);
        }
    };

    const handleResumeUpload = async (e) => {
    e.preventDefault();

    if (!resumeFile) {
        setError("Please select a PDF resume.");
        return;
    }

    try {
        setUploadingResume(true);
        setError("");
        setSuccess("");

        const formData = new FormData();

        formData.append("resume", resumeFile);

        await api.post(
            "/students/resume",
            formData
        );

        await fetchProfile();

        setResumeFile(null);

        setSuccess(
            "Resume uploaded successfully."
        );

    } catch (error) {
        console.error(error);

        setError(
            error.response?.data?.message ||
            "Failed to upload resume"
        );

    } finally {
        setUploadingResume(false);
    }
};

const handleResumeDelete = async () => {
    const confirmDelete = window.confirm(
        "Are you sure you want to delete your resume?"
    );

    if (!confirmDelete) {
        return;
    }

    try {
        setError("");
        setSuccess("");

        await api.delete("/students/resume");

        await fetchProfile();

        setSuccess("Resume deleted successfully.");

    } catch (error) {
        console.error(error);

        setError(
            error.response?.data?.message ||
            "Failed to delete resume"
        );
    }
};

    if (loading) {
        return <h2>Loading profile...</h2>;
    }

    if (error && !profile) {
        return <h2>{error}</h2>;
    }

    if (!profile) {
        return <h2>No profile found</h2>;
    }

    return (
        <div className="profile-page">

            <div className="profile-header">

                <div>
                    <h1>Student Profile</h1>

                    <p>
                        Your profile information
                    </p>
                </div>

                {!editing && (
                    <button
                        className="edit-profile-button"
                        onClick={() => {
                            setSuccess("");
                            setEditing(true);
                        }}
                    >
                        Edit Profile
                    </button>
                )}

            </div>

            {success && (
                <p className="auth-success">
                    {success}
                </p>
            )}

            {error && (
                <p className="auth-error">
                    {error}
                </p>
            )}

            {editing ? (

                <form onSubmit={handleSave}>

                    {/* Basic Information */}

                    <div className="profile-card">

                        <h2>Basic Information</h2>

                        <div className="form-group">
                            <label>Name</label>

                            <input
                                type="text"
                                value={
                                    profile.user?.name || ""
                                }
                                disabled
                            />
                        </div>

                        <div className="form-group">
                            <label>Email</label>

                            <input
                                type="email"
                                value={
                                    profile.user?.email || ""
                                }
                                disabled
                            />
                        </div>

                        <div className="form-group">
                            <label>Phone</label>

                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Enter phone number"
                            />
                        </div>

                        <div className="form-group">
                            <label>Location</label>

                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="Enter your location"
                            />
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

                        <div className="form-group">
                            <label>Bio</label>

                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                rows="5"
                                placeholder="Tell recruiters about yourself"
                            />
                        </div>

                    </div>


                    {/* Skills */}

                    <div className="profile-card">

                        <h2>Skills</h2>

                        <div className="form-group">

                            <label>
                                Skills
                            </label>

                            <input
                                type="text"
                                name="skills"
                                value={formData.skills}
                                onChange={handleChange}
                                placeholder="React, JavaScript, Node.js"
                            />

                            <small>
                                Separate skills with commas.
                            </small>

                        </div>

                    </div>


                    {/* Education */}

                    <div className="profile-card">

                        <div className="edit-section-header">

                            <h2>Education</h2>

                            <button
                                type="button"
                                className="secondary-button"
                                onClick={addEducation}
                            >
                                + Add Education
                            </button>

                        </div>

                        {formData.education.map(
                            (edu, index) => (

                                <div
                                    className="edit-item"
                                    key={index}
                                >

                                    <div className="form-row">

                                        <div className="form-group">
                                            <label>
                                                Degree
                                            </label>

                                            <input
                                                type="text"
                                                value={
                                                    edu.degree || ""
                                                }
                                                onChange={(e) =>
                                                    handleEducationChange(
                                                        index,
                                                        "degree",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>
                                                Institution
                                            </label>

                                            <input
                                                type="text"
                                                value={
                                                    edu.institution || ""
                                                }
                                                onChange={(e) =>
                                                    handleEducationChange(
                                                        index,
                                                        "institution",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>

                                    </div>

                                    <div className="form-row">

                                        <div className="form-group">
                                            <label>
                                                Field
                                            </label>

                                            <input
                                                type="text"
                                                value={
                                                    edu.field || ""
                                                }
                                                onChange={(e) =>
                                                    handleEducationChange(
                                                        index,
                                                        "field",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>
                                                Start Year
                                            </label>

                                            <input
                                                type="number"
                                                value={
                                                    edu.startYear || ""
                                                }
                                                onChange={(e) =>
                                                    handleEducationChange(
                                                        index,
                                                        "startYear",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>

                                    </div>

                                    <div className="form-group">
                                        <label>
                                            End Year
                                        </label>

                                        <input
                                            type="number"
                                            value={
                                                edu.endYear || ""
                                            }
                                            onChange={(e) =>
                                                handleEducationChange(
                                                    index,
                                                    "endYear",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>

                                    <button
                                        type="button"
                                        className="delete-item-button"
                                        onClick={() =>
                                            removeEducation(
                                                index
                                            )
                                        }
                                    >
                                        Remove Education
                                    </button>

                                </div>

                            )
                        )}

                    </div>


                    {/* Projects */}

                    <div className="profile-card">

                        <div className="edit-section-header">

                            <h2>Projects</h2>

                            <button
                                type="button"
                                className="secondary-button"
                                onClick={addProject}
                            >
                                + Add Project
                            </button>

                        </div>

                        {formData.projects.map(
                            (project, index) => (

                                <div
                                    className="edit-item"
                                    key={index}
                                >

                                    <div className="form-group">
                                        <label>
                                            Project Title
                                        </label>

                                        <input
                                            type="text"
                                            value={
                                                project.title || ""
                                            }
                                            onChange={(e) =>
                                                handleProjectChange(
                                                    index,
                                                    "title",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>
                                            Description
                                        </label>

                                        <textarea
                                            rows="4"
                                            value={
                                                project.description || ""
                                            }
                                            onChange={(e) =>
                                                handleProjectChange(
                                                    index,
                                                    "description",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>
                                            Technologies
                                        </label>

                                        <input
                                            type="text"
                                            value={
                                                project.technologies?.join(
                                                    ", "
                                                ) || ""
                                            }
                                            onChange={(e) =>
                                                handleProjectChange(
                                                    index,
                                                    "technologies",
                                                    e.target.value
                                                        .split(",")
                                                        .map(
                                                            (tech) =>
                                                                tech.trim()
                                                        )
                                                        .filter(
                                                            (tech) =>
                                                                tech !== ""
                                                        )
                                                )
                                            }
                                        />

                                    </div>

                                    <div className="form-group">
                                        <label>
                                            Project Link
                                        </label>

                                        <input
                                            type="url"
                                            value={
                                                project.link || ""
                                            }
                                            onChange={(e) =>
                                                handleProjectChange(
                                                    index,
                                                    "link",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>

                                    <button
                                        type="button"
                                        className="delete-item-button"
                                        onClick={() =>
                                            removeProject(index)
                                        }
                                    >
                                        Remove Project
                                    </button>

                                </div>

                            )
                        )}

                    </div>


                    {/* Experience */}

                    <div className="profile-card">

                        <div className="edit-section-header">

                            <h2>Experience</h2>

                            <button
                                type="button"
                                className="secondary-button"
                                onClick={addExperience}
                            >
                                + Add Experience
                            </button>

                        </div>

                        {formData.experience.map(
                            (exp, index) => (

                                <div
                                    className="edit-item"
                                    key={index}
                                >

                                    <div className="form-row">

                                        <div className="form-group">
                                            <label>
                                                Company
                                            </label>

                                            <input
                                                type="text"
                                                value={
                                                    exp.company || ""
                                                }
                                                onChange={(e) =>
                                                    handleExperienceChange(
                                                        index,
                                                        "company",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>
                                                Role
                                            </label>

                                            <input
                                                type="text"
                                                value={
                                                    exp.role || ""
                                                }
                                                onChange={(e) =>
                                                    handleExperienceChange(
                                                        index,
                                                        "role",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>

                                    </div>

                                    <div className="form-row">

                                        <div className="form-group">
                                            <label>
                                                Start Date
                                            </label>

                                            <input
                                                type="date"
                                                value={
                                                    exp.startDate
                                                        ? exp.startDate.substring(
                                                            0,
                                                            10
                                                        )
                                                        : ""
                                                }
                                                onChange={(e) =>
                                                    handleExperienceChange(
                                                        index,
                                                        "startDate",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>
                                                End Date
                                            </label>

                                            <input
                                                type="date"
                                                value={
                                                    exp.endDate
                                                        ? exp.endDate.substring(
                                                            0,
                                                            10
                                                        )
                                                        : ""
                                                }
                                                onChange={(e) =>
                                                    handleExperienceChange(
                                                        index,
                                                        "endDate",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>

                                    </div>

                                    <div className="form-group">
                                        <label>
                                            Description
                                        </label>

                                        <textarea
                                            rows="4"
                                            value={
                                                exp.description || ""
                                            }
                                            onChange={(e) =>
                                                handleExperienceChange(
                                                    index,
                                                    "description",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>

                                    <button
                                        type="button"
                                        className="delete-item-button"
                                        onClick={() =>
                                            removeExperience(
                                                index
                                            )
                                        }
                                    >
                                        Remove Experience
                                    </button>

                                </div>

                            )
                        )}

                    </div>


                    {/* Social Links */}

                    <div className="profile-card">

                        <h2>Social Links</h2>

                        <div className="form-group">
                            <label>GitHub</label>

                            <input
                                type="url"
                                name="github"
                                value={formData.github}
                                onChange={handleChange}
                                placeholder="https://github.com/username"
                            />
                        </div>

                        <div className="form-group">
                            <label>LinkedIn</label>

                            <input
                                type="url"
                                name="linkedin"
                                value={formData.linkedin}
                                onChange={handleChange}
                                placeholder="https://linkedin.com/in/username"
                            />
                        </div>

                        <div className="form-group">
                            <label>Portfolio</label>

                            <input
                                type="url"
                                name="portfolio"
                                value={formData.portfolio}
                                onChange={handleChange}
                                placeholder="https://yourportfolio.com"
                            />
                        </div>

                    </div>


                    {/* Form Actions */}

                    <div className="profile-edit-actions">

                        <button
                            type="submit"
                            className="auth-button"
                            disabled={saving}
                        >
                            {saving
                                ? "Saving..."
                                : "Save Changes"}
                        </button>

                        <button
                            type="button"
                            className="cancel-button"
                            onClick={() => {
                                setEditing(false);
                                setError("");
                                setSuccess("");
                            }}
                        >
                            Cancel
                        </button>

                    </div>

                </form>

            ) : (

                <>

                    {/* Basic Information */}

                    <div className="profile-card">

                        <h2>Basic Information</h2>

                        <div className="profile-info">

                            <p>
                                <strong>Name:</strong>{" "}
                                {profile.user?.name}
                            </p>

                            <p>
                                <strong>Email:</strong>{" "}
                                {profile.user?.email}
                            </p>

                            <p>
                                <strong>Role:</strong>{" "}
                                {profile.user?.role}
                            </p>

                            <p>
                                <strong>Phone:</strong>{" "}
                                {profile.phone ||
                                    "Not added"}
                            </p>

                            <p>
                                <strong>Location:</strong>{" "}
                                {profile.location ||
                                    "Not added"}
                            </p>

                            <p>
                                <strong>Work Mode:</strong>{" "}
                                {profile.workMode ||
                                    "Not added"}
                            </p>

                        </div>

                        <div>
                            <h3>Bio</h3>

                            <p>
                                {profile.bio ||
                                    "No bio added yet."}
                            </p>
                        </div>

                    </div>


                    {/* Skills */}

                    <div className="profile-card">

                        <h2>Skills</h2>

                        {profile.skills?.length > 0 ? (
                            <div className="skills-container">

                                {profile.skills.map(
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
                                No skills added yet.
                            </p>
                        )}

                    </div>


                    {/* Education */}

                    <div className="profile-card">

                        <h2>Education</h2>

                        {profile.education?.length > 0 ? (
                            profile.education.map(
                                (edu, index) => (
                                    <div
                                        className="profile-item"
                                        key={index}
                                    >
                                        <h3>
                                            {edu.degree}
                                        </h3>

                                        <p>
                                            {edu.institution}
                                        </p>

                                        <p>
                                            {edu.field}
                                        </p>

                                        <p>
                                            {edu.startYear} -{" "}
                                            {edu.endYear}
                                        </p>
                                    </div>
                                )
                            )
                        ) : (
                            <p>
                                No education added yet.
                            </p>
                        )}

                    </div>


                    {/* Projects */}

                    <div className="profile-card">

                        <h2>Projects</h2>

                        {profile.projects?.length > 0 ? (
                            profile.projects.map(
                                (project, index) => (
                                    <div
                                        className="profile-item"
                                        key={index}
                                    >
                                        <h3>
                                            {project.title}
                                        </h3>

                                        <p>
                                            {project.description}
                                        </p>

                                        <p>
                                            <strong>
                                                Technologies:
                                            </strong>{" "}
                                            {project.technologies?.join(
                                                ", "
                                            )}
                                        </p>

                                        {project.link && (
                                            <p>
                                                <a
                                                    href={
                                                        project.link
                                                    }
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    View Project
                                                </a>
                                            </p>
                                        )}

                                    </div>
                                )
                            )
                        ) : (
                            <p>
                                No projects added yet.
                            </p>
                        )}

                    </div>


                    {/* Experience */}

                    <div className="profile-card">

                        <h2>Experience</h2>

                        {profile.experience?.length > 0 ? (
                            profile.experience.map(
                                (exp, index) => (
                                    <div
                                        className="profile-item"
                                        key={index}
                                    >
                                        <h3>
                                            {exp.role}
                                        </h3>

                                        <p>
                                            {exp.company}
                                        </p>

                                        <p>
                                            {exp.description}
                                        </p>

                                        <p>
                                            {exp.startDate} -{" "}
                                            {exp.endDate}
                                        </p>

                                    </div>
                                )
                            )
                        ) : (
                            <p>
                                No experience added yet.
                            </p>
                        )}

                    </div>

                    {/* Resume */}

<div className="profile-card">

    <h2>Resume</h2>

    {profile.resume?.url ? (
    <>
        <p>
            <strong>Current Resume:</strong>{" "}
            {profile.resume.fileName}
        </p>

        <div style={{ marginTop: "10px" }}>
            <a
                href={`http://127.0.0.1:5000${profile.resume.url}`}
                target="_blank"
                rel="noreferrer"
            >
                View Resume
            </a>
        </div>

        <button
            type="button"
            className="delete-item-button"
            style={{ marginTop: "15px" }}
            onClick={handleResumeDelete}
        >
            Delete Resume
        </button>
    </>
) : (
    <p>No resume uploaded yet.</p>
)}

    <form
        onSubmit={handleResumeUpload}
        style={{ marginTop: "20px" }}
    >

        <div className="form-group">

            <label>
                Upload Resume (PDF)
            </label>

            <input
                type="file"
                accept=".pdf,application/pdf"
                onChange={(e) =>
                    setResumeFile(e.target.files[0])
                }
            />

            <small>
                Maximum file size: 5 MB
            </small>

        </div>

        <button
            type="submit"
            className="auth-button"
            disabled={uploadingResume}
        >
            {uploadingResume
                ? "Uploading..."
                : "Upload Resume"}
        </button>

    </form>

</div>
                    
                    {/* Social Links */}

                    <div className="profile-card">

                        <h2>Social Links</h2>

                        <p>
                            <strong>
                                GitHub:
                            </strong>{" "}
                            {profile.github ||
                                "Not added"}
                        </p>

                        <p>
                            <strong>
                                LinkedIn:
                            </strong>{" "}
                            {profile.linkedin ||
                                "Not added"}
                        </p>

                        <p>
                            <strong>
                                Portfolio:
                            </strong>{" "}
                            {profile.portfolio ||
                                "Not added"}
                        </p>

                    </div>

                </>

            )}

        </div>
    );
}

export default Profile;