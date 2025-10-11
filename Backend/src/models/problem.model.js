import mongoose from "mongoose";

const problemSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        difficulty: {
            type: String,
            enum: ["easy", "medium", "hard"],
            required: true
        },
        tags: {
            type: String,
            enum: [
                "array",
                "string",
                "linkedlist",
                "graph",
                "stack",
                "queue",
                "dp"
            ],
            required: true
        },
        visibleTestCases: [
            {
                input: {
                    type: String,
                    required: true
                },
                output: {
                    type: String,
                    required: true
                },
                explanation: {
                    type: String,
                    required: true
                }
            }
        ],
        hiddenTestCases: [
            {
                input: {
                    type: String,
                    required: true
                },
                output: {
                    type: String,
                    required: true
                }
            }
        ],
        starterCode: [
            {
                language: {
                    type: String,
                    required: true
                },
                code: {
                    type: String,
                    required: true
                }
            }
        ],
        referenceSolution: [
            {
                language: {
                    type: String,
                    required: true
                },
                completeCode: {
                    type: String,
                    required: true
                }
            }
        ],
        problemCreator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    },
    { timestamps: true }
);

const Problem = mongoose.model("Problem", problemSchema);

export { Problem };
