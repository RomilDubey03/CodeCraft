import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
    {
        submittedByUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        solvedProblemId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Problem"
        },
        solutionCode: {
            type: String,
            required: true
        },
        language: {
            type: String,
            enum: ["c++", "java", "javascript"],
            required: true
        },
        status: {
            type: String,
            enum: ["pending", "accepted", "error", "wrong"],
            default: "pending"
        },
        runtime: {
            type: Number,
            default: 0
        },
        memory: {
            type: String,
            default: 0
        },
        errorMessage: {
            type: String,
            default: ""
        },
        testCasesPassed: {
            type: Number
        },
        totalTestCases: {
            type: Number
        }
    },
    { timestamps: true }
);

submissionSchema.index({submittedByUser:1, solvedProblemId:1});

const Submission = mongoose.model("Submission", submissionSchema);

export default Submission;
