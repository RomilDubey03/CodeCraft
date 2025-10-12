import { Router } from "express";
import {
    registerUser,
    loginUser,
    logOutUser,
    adminRegister
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdminJWT } from "../middlewares/admin.auth.middleware.js";


const router = Router();
//register, Login route
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

//Authorised routes - logout, ...
router.route("/logout").post(verifyJWT, logOutUser);

//Admin Authorised Route
router.route("/adminregister").post(verifyAdminJWT, adminRegister);

export default router;
