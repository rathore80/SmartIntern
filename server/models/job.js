const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        company: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true
        },

        skillsRequired: {
            type: [String],
            required: true
        },

        location: {
            type: String,
            required: true
        },

        jobType: {
            type: String,
            enum: ["Internship", "Full-time", "Part-time"],
            required: true
        },

        workMode: {
            type: String,
            enum: ["Remote", "On-site", "Hybrid"],
            required: true
        },

        stipend: {
            type: Number,
            default: 0
        },

        applicationDeadline: {
            type: Date,
            required: true
        },

        companyWebsite: {
            type: String
        },
        recruiter: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
},
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Job", jobSchema);