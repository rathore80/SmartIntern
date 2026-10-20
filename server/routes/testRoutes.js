const express = require("express");

const protect = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
    "/student",
    protect,
    allowRoles("student"),
    (req, res) => {
        res.json({
            message: "Welcome Student 🎓"
        });
    }
);

router.get(
    "/recruiter",
    protect,
    allowRoles("recruiter"),
    (req, res) => {
        res.json({
            message: "Welcome Recruiter 🏢"
        });
    }
);

router.get(
    "/admin",
    protect,
    allowRoles("admin"),
    (req, res) => {
        res.json({
            message: "Welcome Admin 🛡️"
        });
    }
);

module.exports = router;