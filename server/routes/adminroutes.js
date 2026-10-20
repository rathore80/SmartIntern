const express = require("express");

const router = express.Router();

const {
    getAdminDashboard,
    getAllUsers,
    deleteUser,
    getAllJobs,
    deleteJob
} = require("../controllers/adminController");

const protect = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

router.get(
    "/dashboard",
    protect,
    adminMiddleware,
    getAdminDashboard
);
router.get(
    "/users",
    protect,
    adminMiddleware,
    getAllUsers
);

router.delete(
    "/users/:id",
    protect,
    adminMiddleware,
    deleteUser
);

router.get(
    "/jobs",
    protect,
    adminMiddleware,
    getAllJobs
);

router.delete(
    "/jobs/:id",
    protect,
    adminMiddleware,
    deleteJob
);
module.exports = router;