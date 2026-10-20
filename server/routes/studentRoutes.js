
const express = require("express");

const router = express.Router();

const {
    createProfile,
    getProfile,
    updateProfile,
    uploadResume,
    deleteResume,
    getCandidateProfile
} = require("../controllers/studentController");

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// Allow only student accounts
const studentOnly = (req, res, next) => {
    if (req.user.role !== "student") {
        return res.status(403).json({
            message: "Access restricted to students"
        });
    }

    next();
};

// Create student profile
router.post("/profile", protect, studentOnly, createProfile);

// Get own student profile
router.get("/profile", protect, studentOnly, getProfile);

// Update own student profile
router.put("/profile", protect, studentOnly, updateProfile);

// Upload resume
router.post(
    "/resume",
    protect,
    studentOnly,
    upload.single("resume"),
    uploadResume
);

// Delete resume
router.delete(
    "/resume",
    protect,
    studentOnly,
    deleteResume
);

// Recruiters can view authorized candidate profiles.
// The controller checks recruiter role and application ownership.
router.get(
    "/candidate/:id",
    protect,
    getCandidateProfile
);

module.exports = router;
