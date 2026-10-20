
const express = require("express");

const {
    createJob,
    getJobs,
    getJobById,
    updateJob,
    deleteJob
} = require("../controllers/jobcontroller");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Restrict job management to recruiters
const recruiterOnly = (req, res, next) => {
    if (req.user.role !== "recruiter") {
        return res.status(403).json({
            message: "Only recruiters can manage jobs"
        });
    }

    next();
};

// Create a job — recruiters only
router.post("/", protect, recruiterOnly, createJob);

// Browse jobs — authenticated users
router.get("/", protect, getJobs);

// View a single job — authenticated users
router.get("/:id", protect, getJobById);

// Update a job — recruiters only
router.put("/:id", protect, recruiterOnly, updateJob);

// Delete a job — recruiters only
router.delete("/:id", protect, recruiterOnly, deleteJob);

module.exports = router;
