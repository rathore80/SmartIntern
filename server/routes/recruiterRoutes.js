
const express = require("express");

const {
    createRecruiterProfile,
    getRecruiterProfile,
    updateRecruiterProfile,
    getRecruiterDashboard,
    getPostedJobs
} = require("../controllers/recruiterController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Allow only recruiters
const recruiterOnly = (req, res, next) => {
    if (req.user?.role !== "recruiter") {
        return res.status(403).json({
            message: "Only recruiters can access this resource"
        });
    }

    next();
};

// Recruiter profile
router.post("/profile", protect, recruiterOnly, createRecruiterProfile);
router.get("/profile", protect, recruiterOnly, getRecruiterProfile);
router.put("/profile", protect, recruiterOnly, updateRecruiterProfile);

// Recruiter dashboard and jobs
router.get("/dashboard", protect, recruiterOnly, getRecruiterDashboard);
router.get("/jobs", protect, recruiterOnly, getPostedJobs);

module.exports = router;

module.exports = router;