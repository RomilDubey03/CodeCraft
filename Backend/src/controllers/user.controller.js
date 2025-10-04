import { User } from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import validate from "../utils/dataValidator.js";

//Register
const registerUser = asyncHandler(async (req, res) => {
    // username, fullName, email, age, password
    validate(req.body);
    const { username, email, fullName, password, age } = req.body;
    const userExists = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (userExists) throw new ApiError(409, "User already exists!");

    //Add role
    user.role = "user";

    const user = await User.create(
        username.toLowerCase(),
        email.toLowerCase(),
        fullName,
        password,
        age,
        user.role
    );

    const accessToken = user.generateAcsessToken(user._id);

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

    const user = User.findOne({
        $or: [{ username }, { email }]
    });

    if (!user) throw new ApiError(404, "User Not Found!");

    const isPasswordCorrect = await user.isPasswordCorrect(password);

    if (!isPasswordCorrect)
        throw new ApiError(401, "Invalid user credentials!");

    const accessToken = user.generateAcsessToken(user._id);

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
