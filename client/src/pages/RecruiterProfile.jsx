import { useEffect, useState } from "react";
import api from "../services/api";

const RecruiterProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [formData, setFormData] = useState({
        companyName: "",
        companyDescription: "",
        companyWebsite: "",
        industry: "",
        companySize: "1-10",
        location: "",
        companyLogo: ""
    });

    const fetchProfile = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(
                "/recruiters/profile"
            );

            setProfile(response.data);

            setFormData({
                companyName:
                    response.data.companyName || "",

                companyDescription:
                    response.data.companyDescription || "",

                companyWebsite:
                    response.data.companyWebsite || "",

                industry:
                    response.data.industry || "",

                companySize:
                    response.data.companySize || "1-10",

                location:
                    response.data.location || "",

                companyLogo:
                    response.data.companyLogo || ""
            });

        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to load recruiter profile"
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

    const handleSave = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);
            setError("");
            setSuccess("");

            await api.put(
                "/recruiters/profile",
                formData
            );

            await fetchProfile();

            setEditing(false);

            setSuccess(
                "Recruiter profile updated successfully."
            );

        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to update recruiter profile"
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <h2>Loading recruiter profile...</h2>;
    }

    if (error && !profile) {
        return (
            <div className="profile-page">
                <h2>{error}</h2>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="profile-page">
                <h2>No recruiter profile found</h2>
            </div>
        );
    }

    return (
        <div className="profile-page">

            <div className="profile-header">

                <div>
                    <h1>Recruiter Profile</h1>

                    <p>
                        Manage your company information
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

                    <div className="profile-card">

                        <h2>Company Information</h2>

                        <div className="form-group">

                            <label>
                                Company Name
                            </label>

                            <input
                                type="text"
                                name="companyName"
                                value={formData.companyName}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        <div className="form-group">

                            <label>
                                Company Description
                            </label>

                            <textarea
                                name="companyDescription"
                                value={
                                    formData.companyDescription
                                }
                                onChange={handleChange}
                                rows="5"
                                required
                            />

                        </div>

                        <div className="form-group">

                            <label>
                                Company Website
                            </label>

                            <input
                                type="url"
                                name="companyWebsite"
                                value={
                                    formData.companyWebsite
                                }
                                onChange={handleChange}
                                placeholder="https://example.com"
                            />

                        </div>

                        <div className="form-group">

                            <label>
                                Industry
                            </label>

                            <input
                                type="text"
                                name="industry"
                                value={formData.industry}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        <div className="form-group">

                            <label>
                                Company Size
                            </label>

                            <select
                                name="companySize"
                                value={formData.companySize}
                                onChange={handleChange}
                                required
                            >

                                <option value="1-10">
                                    1-10
                                </option>

                                <option value="11-50">
                                    11-50
                                </option>

                                <option value="51-200">
                                    51-200
                                </option>

                                <option value="201-500">
                                    201-500
                                </option>

                                <option value="501-1000">
                                    501-1000
                                </option>

                                <option value="1000+">
                                    1000+
                                </option>

                            </select>

                        </div>

                        <div className="form-group">

                            <label>
                                Location
                            </label>

                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        <div className="form-group">

                            <label>
                                Company Logo URL
                            </label>

                            <input
                                type="url"
                                name="companyLogo"
                                value={formData.companyLogo}
                                onChange={handleChange}
                                placeholder="https://example.com/logo.png"
                            />

                        </div>

                    </div>

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

                    <div className="profile-card">

                        <h2>Company Information</h2>

                        <div className="profile-info">

                            <p>
                                <strong>
                                    Company Name:
                                </strong>{" "}
                                {profile.companyName}
                            </p>

                            <p>
                                <strong>
                                    Industry:
                                </strong>{" "}
                                {profile.industry}
                            </p>

                            <p>
                                <strong>
                                    Company Size:
                                </strong>{" "}
                                {profile.companySize}
                            </p>

                            <p>
                                <strong>
                                    Location:
                                </strong>{" "}
                                {profile.location}
                            </p>

                        </div>

                    </div>

                    <div className="profile-card">

                        <h2>About Company</h2>

                        <p>
                            {profile.companyDescription}
                        </p>

                    </div>

                    <div className="profile-card">

                        <h2>Company Website</h2>

                        {profile.companyWebsite ? (

                            <a
                                href={profile.companyWebsite}
                                target="_blank"
                                rel="noreferrer"
                            >
                                Visit Company Website
                            </a>

                        ) : (

                            <p>
                                No company website added.
                            </p>

                        )}

                    </div>

                    <div className="profile-card">

                        <h2>Company Logo</h2>

                        {profile.companyLogo ? (

                            <img
                                src={profile.companyLogo}
                                alt="Company Logo"
                                style={{
                                    maxWidth: "150px",
                                    maxHeight: "150px"
                                }}
                            />

                        ) : (

                            <p>
                                No company logo added.
                            </p>

                        )}

                    </div>

                </>

            )}

        </div>
    );
};

export default RecruiterProfile;