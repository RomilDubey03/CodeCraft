import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            minLength: 1,
            maxLength: 20
        },
        fullName: {
            type: String,
            required: true,
            minLength: 1,
            maxLength: 20
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            immutable: true
        },
        password: {
            type: String,
            // unique: true,
            // trim: true,
            required: true
        },
        age: {
            type: Number,
            min: 10,
            max: 80,
            default: 18
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user"
        },
        // problemSolved : here reference the problem schema
        problemSolved: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Problem"
            }
        ]
    },
    {
        timestamps: true
    }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    return next();
});

userSchema.methods = {
    isPasswordCorrect: async function (enteredPassword) {
        return await bcrypt.compare(enteredPassword, this.password);
    },

    generateAccessToken: function () {
        return jwt.sign(
            {
                _id: this._id,
                email: this.email,
                username: this.username,
                role: this.role,
                fullName: this.fullName
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: process.env.ACCESS_TOKEN_EXPIRY
            }
        );
    }
};

const User = mongoose.model("User", userSchema);

export { User };
