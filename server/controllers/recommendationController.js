const StudentProfile = require("../models/StudentProfile");
const Job = require("../models/Job");
const { matchStudentWithJob } = require("../utils/matching");

const getRecommendedJobs = async (req, res) => {
  try {
    // Get the logged-in student's profile
    const studentProfile = await StudentProfile.findOne({
      user: req.user.id
    });

    if (!studentProfile) {
      return res.status(404).json({
        message: "Student profile not found"
      });
    }

    // Get all available jobs
    const jobs = await Job.find();

    // Match student with every job
   const recommendations = jobs.map((job) => matchStudentWithJob(studentProfile, job)).sort((a, b) => b.matchPercentage - a.matchPercentage);

    res.status(200).json(recommendations);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

module.exports = {
  getRecommendedJobs
};