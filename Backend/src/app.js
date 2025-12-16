import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = new express();

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    })
);

app.use(express.json({limti : '50mb'}));
app.use(cookieParser());
app.use(express.urlencoded({extended: true, limit: '50mb'}));
app.use(express.static('public'));

//routes import
import userRouter from './routes/user.routes.js';
import problemRouter from './routes/problem.routes.js';
import submissionRouter from './routes/submission.routes.js';
// http://localhost:3000
app.use("/api/v1/users", userRouter);
app.use("/api/v1/problems", problemRouter);
app.use("/api/v1/submissions", submissionRouter);


export default app;
// CORS configuration updated