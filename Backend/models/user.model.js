const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // AUTH FIELDS
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please enter a valid email address",
      ],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false, // never return password by default
      match: [
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,
        "Password must contain uppercase, lowercase, number, and special character",
      ],
    },

    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9_]{3,20}$/,
        "Username must be 3–20 characters and contain only letters, numbers, or underscores",
      ],
    },

    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },

    // PROFILE INFO
    profile: {
      fullName: {
        type: String,
        trim: true,
        match: [
          /^[a-zA-Z ]{2,50}$/,
          "Full name should contain only letters and spaces",
        ],
      },

      bio: {
        type: String,
        maxlength: 300,
      },

      profilePic: {
        type: String,
        match: [
          /^(https?:\/\/.*\.(?:png|jpg|jpeg|webp))$/i,
          "Profile picture must be a valid image URL",
        ],
      },

      college: {
        type: String,
        trim: true,
        maxlength: 100,
      },

      graduationYear: {
        type: Number,
        min: 2000,
        max: 2035,
      },
    },

    // LEARNING PREFERENCES
    learningPreferences: {
      targetRole: {
        type: String,
        enum: ["frontend", "backend", "fullstack", "dsa"],
      },

      experienceLevel: {
        type: String,
        enum: ["beginner", "intermediate", "advanced"],
      },

      preferredLanguage: {
        type: String,
        enum: ["java", "javascript", "cpp", "python"],
      },
    },

    // PROGRESS TRACKING
    progress: {
      solvedQuestions: {
        type: Number,
        default: 0,
      },

      streak: {
        type: Number,
        default: 0,
      },

      lastActive: {
        type: Date,
      },
    },

    // AI PERSONALIZATION
    aiProfile: {
      strengths: {
        type: [String],
        default: [],
      },

      weaknesses: {
        type: [String],
        default: [],
      },

      resumeUrl: {
        type: String,
        match: [
          /^(https?:\/\/)?([\w\d-]+\.)+[\w-]+(\/[\w\d-./?%&=]*)?$/,
          "Invalid resume URL",
        ],
      },

      githubUrl: {
        type: String,
        match: [
          /^https?:\/\/(www\.)?github\.com\/[A-Za-z0-9_-]+\/?$/,
          "Invalid GitHub profile URL",
        ],
      },
    },

    // META & SECURITY
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // createdAt & updatedAt
  }
);

module.exports = mongoose.model("User", userSchema);