const RecruiterProfile = require("../models/RecruiterProfile");
const Job = require("../models/Job");

const isRecruiter = (req, res) => {
    if (req.user?.role !== "recruiter") {
        res.status(403).json({
            message: "Only recruiters can perform this action"
        });
        return false;
    }

    return true;
};

// Create recruiter profile
const createRecruiterProfile = async (req, res) => {
    try {
        if (!isRecruiter(req, res)) return;
        const {
            companyName,
            companyDescription,
            companyWebsite,
            industry,
            companySize,
            location,
            companyLogo
        } = req.body;

        // Check if recruiter profile already exists
        const existingProfile = await RecruiterProfile.findOne({
            user: req.user.id
        });

        if (existingProfile) {
            return res.status(400).json({
                message: "Recruiter profile already exists"
            });
        }

        const validateRecruiterProfile = (data, partial = false) => {
    const errors = [];

    const stringFields = [
        "companyName",
        "companyDescription",
        "companyWebsite",
        "industry",
        "companySize",
        "location",
        "companyLogo"
    ];

    if (!partial && !data.companyName?.trim()) {
        errors.push("Company name is required");
    }

    for (const field of stringFields) {
        if (
            data[field] !== undefined &&
            typeof data[field] !== "string"
        ) {
            errors.push(`${field} must be a string`);
        }
    }

    if (
        data.companyName !== undefined &&
        typeof data.companyName === "string" &&
        !data.companyName.trim()
    ) {
        errors.push("Company name cannot be empty");
    }

    return errors;
};
        // Create profile
        const profile = await RecruiterProfile.create({
            user: req.user.id,
            companyName,
            companyDescription,
            companyWebsite,
            industry,
            companySize,
            location,
            companyLogo
        });

        res.status(201).json({
            message: "Recruiter profile created successfully",
            profile
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
        });
    }
};


// Get recruiter profile
const getRecruiterProfile = async (req, res) => {
    try {
        if (!isRecruiter(req, res)) return;
        const profile = await RecruiterProfile.findOne({
            user: req.user.id
        }).populate("user", "name email role");

        if (!profile) {
            return res.status(404).json({
                message: "Recruiter profile not found"
            });
        }

        res.status(200).json(profile);

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            
        });
    }
};


// Update recruiter profile
const updateRecruiterProfile = async (req, res) => {
    try {
        if (!isRecruiter(req, res)) return;
        const profile = await RecruiterProfile.findOne({
            user: req.user.id
        });

        if (!profile) {
            return res.status(404).json({
                message: "Recruiter profile not found"
            });
        }
        const validateRecruiterProfile = (data, partial = false) => {
    const errors = [];

    const stringFields = [
        "companyName",
        "companyDescription",
        "companyWebsite",
        "industry",
        "companySize",
        "location",
        "companyLogo"
    ];

    if (!partial && !data.companyName?.trim()) {
        errors.push("Company name is required");
    }

    for (const field of stringFields) {
        if (
            data[field] !== undefined &&
            typeof data[field] !== "string"
        ) {
            errors.push(`${field} must be a string`);
        }
    }

    if (
        data.companyName !== undefined &&
        typeof data.companyName === "string" &&
        !data.companyName.trim()
    ) {
        errors.push("Company name cannot be empty");
    }

    return errors;
};
        const {
            companyName,
            companyDescription,
            companyWebsite,
            industry,
            companySize,
            location,
            companyLogo
        } = req.body;
 
        profile.companyName = companyName ?? profile.companyName;
        profile.companyDescription =
            companyDescription ?? profile.companyDescription;
        profile.companyWebsite =
            companyWebsite ?? profile.companyWebsite;
        profile.industry = industry ?? profile.industry;
        profile.companySize = companySize ?? profile.companySize;
        profile.location = location ?? profile.location;
        profile.companyLogo = companyLogo ?? profile.companyLogo;

        await profile.save();

        res.status(200).json({
            message: "Recruiter profile updated successfully",
            profile
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
    
        });
    }
};
const getRecruiterDashboard = async (req, res) => {
    try {
        if (!isRecruiter(req, res)) return;
        const jobs = await Job.find({
            recruiter: req.user.id
        });

        const totalJobs = jobs.length;

        res.status(200).json({
            totalJobs,
            jobs
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
        });
    }
};

const getPostedJobs = async (req, res) => {
    try {
        if (!isRecruiter(req, res)) return;
        const jobs = await Job.find({
            recruiter: req.user.id
        });

        res.status(200).json({
            totalJobs: jobs.length,
            jobs
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
        });
    }
};


module.exports = {
    createRecruiterProfile,
    getRecruiterProfile,
    updateRecruiterProfile,
    getRecruiterDashboard,
    getPostedJobs
};