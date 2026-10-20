const mongoose = require("mongoose");
const Job = require("../models/Job");

const isValidJobId = (id) =>
    mongoose.Types.ObjectId.isValid(id);


const validateJobData = (data, { partial = false } = {}) => {
    const errors = [];

    const requiredStringFields = [
        "title",
        "company",
        "description",
        "location"
    ];

    for (const field of requiredStringFields) {
        if (
            !partial &&
            (typeof data[field] !== "string" || !data[field].trim())
        ) {
            errors.push(`${field} is required`);
        } else if (
            data[field] !== undefined &&
            (typeof data[field] !== "string" || !data[field].trim())
        ) {
            errors.push(`${field} must be a non-empty string`);
        }
    }

    if (
        !partial &&
        (!Array.isArray(data.skillsRequired) ||
            data.skillsRequired.length === 0)
    ) {
        errors.push("At least one required skill must be provided");
    } else if (
        data.skillsRequired !== undefined &&
        (
            !Array.isArray(data.skillsRequired) ||
            data.skillsRequired.some(
                (skill) => typeof skill !== "string" || !skill.trim()
            )
        )
    ) {
        errors.push("Skills required must be an array of non-empty strings");
    }

    const validJobTypes = ["Internship", "Full-time", "Part-time"];
    const validWorkModes = ["Remote", "On-site", "Hybrid"];

    if (
        (!partial && !validJobTypes.includes(data.jobType)) ||
        (data.jobType !== undefined &&
            !validJobTypes.includes(data.jobType))
    ) {
        errors.push("Invalid job type");
    }

    if (
        (!partial && !validWorkModes.includes(data.workMode)) ||
        (data.workMode !== undefined &&
            !validWorkModes.includes(data.workMode))
    ) {
        errors.push("Invalid work mode");
    }

    if (
        !partial &&
        !data.applicationDeadline
    ) {
        errors.push("Application deadline is required");
    }

    if (data.applicationDeadline !== undefined) {
        const deadline = new Date(data.applicationDeadline);

        if (
            !data.applicationDeadline ||
            Number.isNaN(deadline.getTime())
        ) {
            errors.push("Invalid application deadline");
        }
    }

    if (
        data.stipend !== undefined &&
        (
            typeof data.stipend !== "number" ||
            !Number.isFinite(data.stipend) ||
            data.stipend < 0
        )
    ) {
        errors.push("Stipend must be a non-negative number");
    }

    if (
        data.companyWebsite !== undefined &&
        typeof data.companyWebsite !== "string"
    ) {
        errors.push("Company website must be a string");
    }

    return errors;
};


// Create a job

const createJob = async (req, res) => {
    try {
        if (req.user.role !== "recruiter") {
            return res.status(403).json({
                message: "Only recruiters can create jobs"
            });
        }

        const {
            title,
            company,
            description,
            skillsRequired,
            location,
            jobType,
            workMode,
            stipend,
            applicationDeadline,
            companyWebsite
        } = req.body;

        // Validate required fields
        if (
            typeof title !== "string" || !title.trim() ||
            typeof company !== "string" || !company.trim() ||
            typeof description !== "string" || !description.trim()
        ) {
            return res.status(400).json({
                message: "Title, company and description are required"
            });
        }

        // Validate optional field types
        if (
            skillsRequired !== undefined &&
            !Array.isArray(skillsRequired)
        ) {
            return res.status(400).json({
                message: "Skills required must be an array"
            });
        }

        if (
            stipend !== undefined &&
            (
                typeof stipend !== "number" ||
                !Number.isFinite(stipend) ||
                stipend < 0
            )
        ) {
            return res.status(400).json({
                message: "Stipend must be a non-negative number"
            });
        }

        if (applicationDeadline !== undefined &&
            applicationDeadline !== null &&
            applicationDeadline !== "") {
            const deadline = new Date(applicationDeadline);

            if (Number.isNaN(deadline.getTime())) {
                return res.status(400).json({
                    message: "Invalid application deadline"
                });
            }
        }
        const errors = validateJobData(req.body);

if (errors.length > 0) {
    return res.status(400).json({
        message: "Invalid job data",
        errors
    });
}

        const job = await Job.create({
            title: title.trim(),
            company: company.trim(),
            description: description.trim(),
            skillsRequired,
            location,
            jobType,
            workMode,
            stipend,
            applicationDeadline: applicationDeadline || undefined,
            companyWebsite,
            recruiter: req.user.id
        });

        res.status(201).json({
            message: "Job created successfully",
            job
        });
    } catch (error) {
        console.error("Create job error:", error);

        if (error.name === "ValidationError") {
            return res.status(400).json({
                message: "Invalid job data"
            });
        }

        res.status(500).json({
            message: "Server error"
        });
    }
};



// Get all jobs
const getJobs = async (req, res) => {
    try {
        const {
            search,
            jobType,
            workMode,
            location,
            minStipend
        } = req.query;

       
let query = {};

// Escape special regex characters in user input
    const escapeRegex = (value) =>value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Search
if (search) {
    if (typeof search !== "string" || search.length > 100) {
        return res.status(400).json({
            message: "Search must be a string of at most 100 characters"
        });
    }

    const safeSearch = escapeRegex(search.trim());

    if (safeSearch) {
        query.$or = [
            { title: { $regex: safeSearch, $options: "i" } },
            { company: { $regex: safeSearch, $options: "i" } },
            { description: { $regex: safeSearch, $options: "i" } },
            { location: { $regex: safeSearch, $options: "i" } },
            { skillsRequired: { $regex: safeSearch, $options: "i" } }
        ];
    }
}

// Job type filter
if (jobType) {
    const validJobTypes = ["Internship", "Full-time", "Part-time"];

    if (!validJobTypes.includes(jobType)) {
        return res.status(400).json({
            message: "Invalid job type"
        });
    }

    query.jobType = jobType;
}

// Work mode filter
if (workMode) {
    const validWorkModes = ["Remote", "On-site", "Hybrid"];

    if (!validWorkModes.includes(workMode)) {
        return res.status(400).json({
            message: "Invalid work mode"
        });
    }

    query.workMode = workMode;
}

// Location filter
if (location) {
    if (typeof location !== "string" || location.length > 100) {
        return res.status(400).json({
            message: "Location must be a string of at most 100 characters"
        });
    }

    const safeLocation = escapeRegex(location.trim());

    if (safeLocation) {
        query.location = {
            $regex: safeLocation,
            $options: "i"
        };
    }
}

// Minimum stipend filter
if (minStipend !== undefined) {
    const amount = Number(minStipend);

    if (
        typeof minStipend !== "string" ||
        minStipend.trim() === "" ||
        !Number.isFinite(amount) ||
        amount < 0
    ) {
        return res.status(400).json({
            message: "Minimum stipend must be a non-negative number"
        });
    }

    query.stipend = {
        $gte: amount
    };
}

const jobs = await Job.find(query);

res.status(200).json(jobs);


    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

// Get single job
const getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        res.status(200).json(job);

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// Update job
const updateJob = async (req, res) => {
    try {
        if (!isValidJobId(req.params.id)) {
    return res.status(400).json({
        message: "Invalid job ID"
    });
}
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        // Make sure the logged-in recruiter owns this job
        if (job.recruiter.toString() !== req.user.id) {
            return res.status(403).json({
                message: "Not authorized to update this job"
            });
        }

       const allowedFields = [
    "title",
    "company",
    "description",
    "skillsRequired",
    "location",
    "jobType",
    "workMode",
    "stipend",
    "applicationDeadline",
    "companyWebsite"
];

const updates = {};

for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
    }
}

const updatedJob = await Job.findByIdAndUpdate(
    req.params.id,
    updates,
    {
        new: true,
        runValidators: true
    }
);

        res.status(200).json({
            message: "Job updated successfully",
            job: updatedJob
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// Delete job
const deleteJob = async (req, res) => {
    try {
        if (req.user.role !== "recruiter") {
    return res.status(403).json({
        message: "Only recruiters can manage jobs"
    });
}
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        // Make sure the logged-in recruiter owns this job
        if (job.recruiter.toString() !== req.user.id) {
            return res.status(403).json({
                message: "Not authorized to delete this job"
            });
        }

        await Job.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Job deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


module.exports = {
    createJob,
    getJobs,
    getJobById,
    updateJob,
    deleteJob
};