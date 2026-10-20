const mongoose = require("mongoose");
const User = require("../models/User");
const Job = require("../models/Job");
const Application = require("../models/Application");

const getAdminDashboard = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();

        const totalStudents = await User.countDocuments({
            role: "student"
        });

        const totalRecruiters = await User.countDocuments({
            role: "recruiter"
        });

        const totalJobs = await Job.countDocuments();

        const totalApplications =
            await Application.countDocuments();

        res.status(200).json({
            totalUsers,
            totalStudents,
            totalRecruiters,
            totalJobs,
            totalApplications
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to load admin dashboard"
        });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select("-password")
            .sort({ createdAt: -1 });

        res.status(200).json(users);

    } catch (error) {
        console.error("Get all users error:", error);

        res.status(500).json({
            message: "Failed to load users"
        });
    }
};

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                message: "Invalid user ID"
            });
        }

        // Prevent admin from deleting their own account
        if (userId === req.user.id) {
            return res.status(400).json({
                message: "You cannot delete your own account"
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        await User.findByIdAndDelete(userId);

        res.status(200).json({
            message: "User deleted successfully"
        });

    } catch (error) {
        console.error("Delete user error:", error);

        res.status(500).json({
            message: "Failed to delete user"
        });
    }
};

const getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find()
            .populate("recruiter", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json(jobs);

    } catch (error) {
        console.error("Get all jobs error:", error);

        res.status(500).json({
            message: "Failed to load jobs"
        });
    }
};

const deleteJob = async (req, res) => {
    try {
        const jobId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(jobId)) {
            return res.status(400).json({
                message: "Invalid job ID"
            });
        }

        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        await Job.findByIdAndDelete(jobId);

        res.status(200).json({
            message: "Job deleted successfully"
        });

    } catch (error) {
        console.error("Delete job error:", error);

        res.status(500).json({
            message: "Failed to delete job"
        });
    }
};

module.exports = {
    getAdminDashboard,
    getAllUsers,
    deleteUser,
    getAllJobs,
    deleteJob
};