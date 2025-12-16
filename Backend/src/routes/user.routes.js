import { Router } from "express";
import {
    registerUser,
    loginUser,
    logOutUser,
    adminRegister,
    getCurrentUser
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdminJWT } from "../middlewares/admin.auth.middleware.js";
import ApiResponse from "../utils/ApiResponse.js";

const router = Router();
//register, Login route
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

//Authorised routes - logout, ...
router.route("/logout").post(verifyJWT, logOutUser);
router.route("/me").get(verifyJWT, getCurrentUser);
router.route("/check").get(verifyJWT, (req, res) => {
    const reply = {
        firstName: req.user.firstName,
        emailId: req.user.emailId,
        _id: req.user._id,
        role: req.user.role
    };
    return res
        .status(200)
        .json(new ApiResponse(200, reply, "User LoggedIn Successfully"));
});

//Admin Authorised Route
router.route("/adminregister").post(verifyAdminJWT, adminRegister);

export default router;
