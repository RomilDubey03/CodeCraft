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

export default app;