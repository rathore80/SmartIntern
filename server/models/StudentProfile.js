const mongoose = require("mongoose");

const studentProfileSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },

        phone: {
            type: String,
            trim: true
        },

        location: {
            type: String,
            trim: true
        },

        workMode: {
            type: String,
            enum: ["Remote", "On-site", "Hybrid"],
            default: "Remote"
        },

        bio: {
            type: String,
            trim: true
        },

        skills: [
            {
                type: String,
                trim: true
            }
        ],

        education: [
            {
                degree: String,
                institution: String,
                field: String,
                startYear: Number,
                endYear: Number
            }
        ],

        projects: [
            {
                title: String,
                description: String,
                technologies: [String],
                link: String
            }
        ],

        experience: [
            {
                company: String,
                role: String,
                startDate: Date,
                endDate: Date,
                description: String
            }
        ],

        resume: {
            url: String,
            fileName: String
        },

        github: String,

        linkedin: String,

        portfolio: String
    },


    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "StudentProfile",
    studentProfileSchema
);