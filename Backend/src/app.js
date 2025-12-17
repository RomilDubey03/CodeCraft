// import express from "express";
// import cors from "cors";
// import cookieParser from "cookie-parser";

// const app = express();

// app.use(
//     cors({
//         origin: process.env.CORS_ORIGIN,
//         credentials: true
//     })
// );

// app.use(express.json({ limti: "50mb" }));
// app.use(cookieParser());
// app.use(express.urlencoded({ extended: true, limit: "50mb" }));
// app.use(express.static("public"));

// //routes import
// import userRouter from "./routes/user.routes.js";
// import problemRouter from "./routes/problem.routes.js";
// import submissionRouter from "./routes/submission.routes.js";
// // http://localhost:3000
// app.use("/api/v1/users", userRouter);
// app.use("/api/v1/problems", problemRouter);
// app.use("/api/v1/submissions", submissionRouter);

// export default app;
// // CORS configuration updated
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";

// Import your DB connections
import connectToDB from "./db/dbconnect.js";
import { redisClient } from "./db/redisDbConnect.js";

// Import Routes
import userRouter from "./routes/user.routes.js";
import problemRouter from "./routes/problem.routes.js";
import submissionRouter from "./routes/submission.routes.js";

// 1. Configuration
dotenv.config({ path: "./.env" });

const app = express();

// 2. Middleware
app.use(
    cors({
        origin: (origin, callback) => {
            const allowedOrigins = [
                process.env.CORS_ORIGIN,
                "http://localhost:5173",
                "http://localhost:3000"
            ];
            // Allow requests with no origin (like mobile apps or curl requests)
            if (!origin) return callback(null, true);

            if (allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true
    })
);

app.use(express.json({ limit: "50mb" })); // Fixed typo 'limti' -> 'limit'
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.static("public"));
app.use(cookieParser());

// 3. Routes
// http://localhost:3000/api/v1/...
app.use("/api/v1/users", userRouter);
app.use("/api/v1/problems", problemRouter);
app.use("/api/v1/submissions", submissionRouter);

// 4. Database Connection Logic
// We create a function to handle connections but DO NOT block the app export
const initializeServices = async () => {
    try {
        // Connect to MongoDB
        // We call this, but we don't 'await' it strictly for the export to happen.
        // Mongoose 'buffers' requests (waits) until the connection is ready.
        await connectToDB();

        // Connect to Redis (Safely)
        if (!redisClient.isOpen) {
            await redisClient.connect().catch((err) => {
                console.error(
                    "Redis Connection Failed (Continuing without Redis):",
                    err
                );
            });
        }
        console.log("Services initialized successfully");
    } catch (error) {
        console.error("Service initialization failed:", error);
        // On Vercel, we rarely want to exit process, but locally we might.
        // process.exit(1);
    }
};

// Trigger connection immediately when file loads
initializeServices();

// 5. Server Listener (The "Hybrid" Logic)
// Vercel does NOT want app.listen(). It exports the app to a serverless function.
// Local Dev DOES want app.listen().
// We check if we are in "Production" (Vercel usually sets NODE_ENV=production)
// OR we can just check if this file is being run directly.

if (process.env.NODE_ENV !== "production") {
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
        console.log(`⚙️  Server is running locally on port: ${PORT}`);
    });
}

// 6. Export for Vercel
export default app;
