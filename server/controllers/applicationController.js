const mongoose = require("mongoose");
const Application = require("../models/Application");
const Job = require("../models/Job");
const Notification = require("../models/Notification");

// Apply for a job
const applyForJob = async (req, res) => {
  try {
    const { jobId, resume } = req.body;

    // Only students can apply
    if (req.user.role !== "student") {
      return res.status(403).json({
        message: "Only students can apply for jobs"
      });
    }

    // Job ID is required
    if (!jobId) {
      return res.status(400).json({
        message: "Job ID is required"
      });
    }

    // Check if job exists
    const job = await Job.findById(jobId);
    if (
    typeof jobId !== "string" ||
    !mongoose.Types.ObjectId.isValid(jobId)
) {
    return res.status(400).json({
        message: "Invalid job ID"
    });
}

    if (!job) {
      return res.status(404).json({
        message: "Job not found"
      });
    }

    // Check application deadline
    if (job.applicationDeadline) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const deadline = new Date(job.applicationDeadline);
      deadline.setHours(23, 59, 59, 999);

      if (deadline < today) {
        return res.status(400).json({
          message: "The application deadline has passed"
        });
      }
    }

    // Check if student already applied
    const existingApplication =
      await Application.findOne({
        student: req.user.id,
        job: jobId
      });

    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied for this job"
      });
    }

    // Create application
    const application = await Application.create({
      student: req.user.id,
      job: jobId,
      resume: resume || ""
    });

    await Notification.create({
    user: job.recruiter,
    message: `New application received for ${job.title}`,
    type: "application"
});

    res.status(201).json({
      message: "Application submitted successfully",
      application
    });

  } catch (error) {
    console.error("Apply for job error:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};


// Get applications submitted by logged-in student
const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      student: req.user.id
    }).populate(
      "job",
      "title company location jobType workMode stipend"
    );

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

// Recruiter updates application status
const updateApplicationStatus = async (req, res) => {
  try {
    if (req.user.role !== "recruiter") {
    return res.status(403).json({
        message: "Only recruiters can update application status"
    });
}
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid application ID"
      });
    }
    const { status } = req.body;

    const validStatuses = [
        "Applied",
        "Under Review",
        "Shortlisted",
        "Rejected",
        "Selected"
      ];

      if (!status || !validStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid application status"
        });
      }

    // Find application
    const application = await Application.findById(req.params.id)
    .populate("student", "name email")
    .populate(
        "job",
        "title company description location jobType workMode stipend applicationDeadline companyWebsite"
    );
    if (!application) {
      return res.status(404).json({
        message: "Application not found"
      });
    }

    // Find the job associated with the application
    const job = await Job.findById(application.job);

    if (!job) {
      return res.status(404).json({
        message: "Job not found"
      });
    }

    // Check if recruiter owns the job
    if (job.recruiter.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized to update this application"
      });
    }

    // Update status
    application.status = status;

    await application.save();
    await Notification.create({
    user: application.student,
    message: `Your application for ${application.job.title} is now ${status}`,
    type: "application"
});
    res.status(200).json({
      message: "Application status updated successfully",
      application
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};


// Get applications for recruiter's jobs
const getJobApplications = async (req, res) => {
  try {
    const jobs = await Job.find({
      recruiter: req.user.id
    });

    const jobIds = jobs.map((job) => job._id);

    const applications = await Application.find({
      job: { $in: jobIds }
    })
      .populate("student", "name email")
      .populate("job", "title company");

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

// Get application details
const getApplicationById = async (req, res) => {
  try {
    if (req.user.role !== "student") {
    return res.status(403).json({
        message: "Only students can access this application endpoint"
    });
}
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
  return res.status(400).json({
    message: "Invalid application ID"
  });
}
    const application = await Application.findById(req.params.id)
      .populate("student", "name email")
      .populate(
        "job",
        "title company description location jobType workMode stipend applicationDeadline companyWebsite"
      );

    if (!application) {
      return res.status(404).json({
        message: "Application not found"
      });
    }

    // Student can view only their own application
    if (
      application.student._id.toString() !== req.user.id
    ) {
      return res.status(403).json({
        message: "Not authorized to view this application"
      });
    }

    res.status(200).json(application);
  } catch (error) {
    res.status(500).json({
    message: "An unexpected server error occurred"
});
  }
};


module.exports = {
  applyForJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
  getApplicationById
};