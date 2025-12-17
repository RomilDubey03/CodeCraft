import JWT from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { redisClient } from "../db/redisDbConnect.js";
import ApiResponse from "../utils/ApiResponse.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const accessToken =
            req.cookies?.accessToken ||
            req.header("Authorization")?.replace("Bearer ", "");

        if (!accessToken) {
            return res
                .status(300)
                .json(
                    new ApiResponse(
                        401,
                        {},
                        "Unauthorised Access - Token Missing"
                    )
                );
        }

        const decodedToken = JWT.verify(
            accessToken,
            process.env.ACCESS_TOKEN_SECRET
        );

        const { _id } = decodedToken;
        if (!_id) throw new ApiError(401, "Invalid Token! - ID NOT FOUND");

        const user = await User.findById(_id).select(" -password ");
        if (!user) throw new ApiError(404, "User Does Not Exists!");

        const isBlocked = await redisClient.exists(
            `accessToken:${accessToken}`
        );
        if (isBlocked) throw new ApiError(401, "Invalid Token! - BLOCKED");

        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Token!");
    }
});
