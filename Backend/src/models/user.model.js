import mongoose from "mongoose";

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
            max: 80
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user"
        }
        // problemSolved : here reference the problem schema
    },
    {
        timestamps: true
    }
);

userSchama.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    return next();
});

userSchama.methods = {
    isPasswordCorrecty: async function (enteredPassword) {
        return await bcrypt.compare(enteredPassword, this.password);
    },

    generateAccessToken: function () {
        return jwt.sign(
            {
                _id: this._id,
                email: this.email,
                username: this.username,
                fullName: this.fullName
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresAt: process.env.ACCESS_TOKEN_EXPIRY
            }
        );
    }
};

const User = mongoose.model("User", userSchema);

export { User };
