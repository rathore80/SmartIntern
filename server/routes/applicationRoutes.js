
const express = require("express");

const {
    applyForJob,
    getMyApplications,
    getJobApplications,
    updateApplicationStatus,
    getApplicationById
} = require("../controllers/applicationController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Allow only students to apply for jobs
router.post("/", protect, (req, res, next) => {
    if (req.user.role !== "student") {
        return res.status(403).json({
            message: "Only students can apply for jobs"
        });
    }
    next();
}, applyForJob);

// Students view their own applications
router.get("/my", protect, (req, res, next) => {
    if (req.user.role !== "student") {
        return res.status(403).json({
            message: "Only students can view their applications"
        });
    }
    next();
}, getMyApplications);

// Recruiters view applications for their jobs
router.get("/recruiter", protect, (req, res, next) => {
    if (req.user.role !== "recruiter") {
        return res.status(403).json({
            message: "Only recruiters can view job applications"
        });
    }
    next();
}, getJobApplications);

// Recruiters update application status
router.put("/:id/status", protect, (req, res, next) => {
    if (req.user.role !== "recruiter") {
        return res.status(403).json({
            message: "Only recruiters can update application status"
        });
    }
    next();
}, updateApplicationStatus);

// Students view application details
router.get("/:id", protect, (req, res, next) => {
    if (req.user.role !== "student") {
        return res.status(403).json({
            message: "Only students can view application details"
        });
    }
    next();
}, getApplicationById);

module.exports = router;
