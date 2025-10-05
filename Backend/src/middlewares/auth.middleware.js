import JWT from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler";
import ApiError from "../utils/apiError";
import { User } from "../models/user.model";
import { redisClient } from "../db/redisDbConnect";

const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        const accessToken =
            req.cookies?.accessToken ||
            req.header("Authorization")?.replace("Bearer ", "");
        if (!accessToken)
            throw new ApiError(401, "Unauthorised Access - Token Missing");

        const decodedToken = JWT.verify(
            accessToken,
            process.env.ACCESS_TOKEN_SECRET
        );

        const { _id } = decodedToken;
        if (!_id) throw new ApiError(401, "Invalid Token!");

        const user = User.findById(_id).select("-password");
        if (!user) throw new ApiError(404, "User Does Not Exists!");

        const isBlocked = redisClient.exists(`accessToken:${decodedToken}`);
        if (isBlocked) throw new ApiError(401, "Invalid Token!");

        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Token!");
    }
});
