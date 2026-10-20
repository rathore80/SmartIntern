const StudentProfile = require("../models/StudentProfile");
const Application = require("../models/Application");
const fs = require("fs");
const path = require("path");

// Create student profile
const createProfile = async (req, res) => {
    try {
        const existingProfile = await StudentProfile.findOne({
            user: req.user.id
        });

        if (existingProfile) {
            return res.status(400).json({
                message: "Student profile already exists"
            });
        }

        const profile = await StudentProfile.create({
            user: req.user.id,
            phone: req.body.phone,
            bio: req.body.bio,
            skills: req.body.skills,
            education: req.body.education,
            projects: req.body.projects,
            experience: req.body.experience,
            github: req.body.github,
            linkedin: req.body.linkedin,
            portfolio: req.body.portfolio
        });

        res.status(201).json({
            message: "Student profile created successfully",
            profile
        });

    } catch (error) {
        console.error("Create profile error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// Get logged-in student's profile
const getProfile = async (req, res) => {
    try {
        const profile = await StudentProfile.findOne({
            user: req.user.id
        }).populate("user", "name email role");

        if (!profile) {
            return res.status(404).json({
                message: "Student profile not found"
            });
        }

        res.status(200).json(profile);

    } catch (error) {
        console.error("Get profile error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// Update logged-in student's profile

const updateProfile = async (req, res) => {
    try {
        if (req.user.role !== "student") {
            return res.status(403).json({
                message: "Only students can update student profiles"
            });
        }

        const { phone, bio, skills, education, projects, experience,
            github, linkedin, portfolio } = req.body;

        if (
            skills !== undefined && !Array.isArray(skills) ||
            education !== undefined && !Array.isArray(education) ||
            projects !== undefined && !Array.isArray(projects) ||
            experience !== undefined && !Array.isArray(experience)
        ) {
            return res.status(400).json({
                message: "Skills, education, projects and experience must be arrays"
            });
        }

        for (const value of [
            phone, bio, github, linkedin, portfolio
        ]) {
            if (value !== undefined && typeof value !== "string") {
                return res.status(400).json({
                    message: "Profile text fields must be strings"
                });
            }
        }

        const profile = await StudentProfile.findOne({
            user: req.user.id
        });

        if (!profile) {
            return res.status(404).json({
                message: "Student profile not found"
            });
        }

        if (phone !== undefined) profile.phone = phone;
        if (bio !== undefined) profile.bio = bio;
        if (skills !== undefined) profile.skills = skills;
        if (education !== undefined) profile.education = education;
        if (projects !== undefined) profile.projects = projects;
        if (experience !== undefined) profile.experience = experience;
        if (github !== undefined) profile.github = github;
        if (linkedin !== undefined) profile.linkedin = linkedin;
        if (portfolio !== undefined) profile.portfolio = portfolio;

        await profile.save();

        res.status(200).json({
            message: "Student profile updated successfully",
            profile
        });
    } catch (error) {
        console.error("Update profile error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

// Upload resume

const uploadResume = async (req, res) => {
    try {
        if (req.user.role !== "student") {
            return res.status(403).json({
                message: "Only students can upload resumes"
            });
        }

        if (!req.file) {
            return res.status(400).json({
                message: "Please upload a PDF resume"
            });
        }

        const profile = await StudentProfile.findOne({
            user: req.user.id
        });

        if (!profile) {
            // Remove the newly uploaded file if no profile exists
            await fs.promises.unlink(req.file.path).catch(() => {});

            return res.status(404).json({
                message: "Student profile not found"
            });
        }

        const previousResumeUrl = profile.resume?.url;

        profile.resume = {
            url: `/uploads/${req.file.filename}`,
            fileName: req.file.originalname
        };

        await profile.save();

        // Remove the previous resume after the new one is saved
        if (previousResumeUrl) {
            const previousFilename = path.basename(previousResumeUrl);
            const previousPath = path.join(
                __dirname,
                "..",
                "uploads",
                previousFilename
            );

            if (previousFilename && previousFilename !== req.file.filename) {
                await fs.promises.unlink(previousPath).catch((error) => {
                    if (error.code !== "ENOENT") {
                        console.error("Previous resume cleanup failed:", error);
                    }
                });
            }
        }

        res.status(200).json({
            message: "Resume uploaded successfully",
            resume: profile.resume
        });

    } catch (error) {
        console.error("Resume upload error:", error);

        res.status(500).json({
            message: "Resume upload failed"
        });
    }
};


const deleteResume = async (req, res) => {
    try {
        const profile = await StudentProfile.findOne({
            user: req.user.id
        });

        if (!profile) {
            return res.status(404).json({
                message: "Student profile not found"
            });
        }

        if (!profile.resume?.url) {
            return res.status(404).json({
                message: "No resume found"
            });
        }
const filePath = path.join(
    __dirname,
    "..",
    "uploads",
    path.basename(profile.resume.url)
);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        profile.resume = {
            url: "",
            fileName: ""
        };

        await profile.save();

        res.status(200).json({
            message: "Resume deleted successfully"
        });

    } catch (error) {
        console.error("Resume delete error:", error);

        res.status(500).json({
            message: "Failed to delete resume"
        });
    }
};

// Get candidate profile for recruiter

const getCandidateProfile = async (req, res) => {
    try {
        // Only recruiters can access candidate profiles
        if (req.user.role !== "recruiter") {
            return res.status(403).json({
                message: "Only recruiters can view candidate profiles"
            });
        }

        const candidateId = req.params.id;

        // Validate candidate ID
        if (!mongoose.Types.ObjectId.isValid(candidateId)) {
            return res.status(400).json({
                message: "Invalid candidate ID"
            });
        }

        // Find an application from this candidate
        // for a job owned by the logged-in recruiter
        const jobs = await Job.find({
            recruiter: req.user.id
        }).select("_id");

        const jobIds = jobs.map((job) => job._id);

        const application = await Application.findOne({
            student: candidateId,
            job: { $in: jobIds }
        });

        if (!application) {
            return res.status(404).json({
                message: "No application found for this candidate in your jobs"
            });
        }

        // Fetch candidate profile only after authorization
        const profile = await StudentProfile.findOne({
            user: candidateId
        }).populate("user", "name email role");

        if (!profile) {
            return res.status(404).json({
                message: "Candidate profile not found"
            });
        }

        res.status(200).json(profile);

    } catch (error) {
        console.error(
            "Get candidate profile error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    createProfile,
    getProfile,
    updateProfile,
    uploadResume,
    deleteResume,
    getCandidateProfile
};