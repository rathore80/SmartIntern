const mongoose = require("mongoose");

const recruiterProfileSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },

        companyName: {
            type: String,
            required: true,
            trim: true
        },

        companyDescription: {
            type: String,
            required: true,
            trim: true
        },

        companyWebsite: {
            type: String,
            trim: true
        },

        industry: {
            type: String,
            required: true,
            trim: true
        },

        companySize: {
            type: String,
            enum: [
                "1-10",
                "11-50",
                "51-200",
                "201-500",
                "501-1000",
                "1000+"
            ],
            required: true
        },

        location: {
            type: String,
            required: true,
            trim: true
        },

        companyLogo: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "RecruiterProfile",
    recruiterProfileSchema
);