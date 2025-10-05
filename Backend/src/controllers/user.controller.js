import { User } from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/apiError.js";
import validate from "../utils/dataValidator.js";
import { redisClient } from "../db/redisDbConnect.js";
import JWT from "jsonwebtoken";
//Register
const registerUser = asyncHandler(async (req, res) => {
    // username, fullName, email, age, password
    validate(req.body);
    const { username, email, fullName, password, age } = req.body;
    const userExists = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (userExists) throw new ApiError(409, "User already exists!");

    const user = await User.create({
        username: username.toLowerCase(),
        email: email.toLowerCase(),
        fullName: fullName,
        password: password,
        age: age,
        role: "user"
    });

    const accessToken = user.generateAccessToken(user._id);

    const createdUser = await User.findById(user._id).select("-password");

    if (!createdUser) throw new ApiError(500, "User not registered");

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "None"
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .json(
            new ApiResponse(200, createdUser, "User Registered Successfully")
        );
});

//LogIn
const loginUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    if (!username && !email)
        throw new ApiError(400, "username or email is missing!");

    const user = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (!user) throw new ApiError(404, "User Not Found!");

    const isPasswordCorrect = await user.isPasswordCorrect(password);

    if (!isPasswordCorrect)
        throw new ApiError(401, "Invalid user credentials!");

    const accessToken = user.generateAccessToken(user._id);

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "None"
    };

    const loggedInUser = await User.findById(user._id).select("-password");

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .json(new ApiResponse(200, loggedInUser, "User LoggedIn Successfully"));
});

//LogOut
const logOutUser = asyncHandler(async (req, res) => {
    const { accessToken } = req.cookies;

    const payload = JWT.decode(accessToken);

    await redisClient.set(`accessToken:${accessToken}`, "BLOCKED");
    await redisClient.expireAt(`accessToken:${accessToken}`, payload.exp);

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "None"
    };
    return res
        .status(200)
        .clearCookie("accessToken", options)
        .json(new ApiResponse(200, {}, "User logged out Successfully!"));
});


//Admin Routes
const adminRegister = asyncHandler(async (req, res) =>{
    // username, fullName, email, age, password
    validate(req.body);
    const { username, email, fullName, password, age } = req.body;
    const userExists = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (userExists) throw new ApiError(409, "User already exists!");

    const user = await User.create({
        username: username.toLowerCase(),
        email: email.toLowerCase(),
        fullName: fullName,
        password: password,
        age: age,
        role: "admin"
    });

    const accessToken = user.generateAccessToken(user._id);

    const createdUser = await User.findById(user._id).select("-password");

    if (!createdUser) throw new ApiError(500, "User not registered");

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "None"
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .json(
            new ApiResponse(200, createdUser, "Admin Registered Successfully")
        );
});

export { registerUser, loginUser, logOutUser, adminRegister};
