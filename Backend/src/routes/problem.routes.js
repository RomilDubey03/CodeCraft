import { Router } from "express";
import { verifyAdminJWT } from "../middlewares/admin.auth.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createProblem, deleteProblem, getAllProblems, getProblemByID, updateProblem } from "../controllers/problem.controller.js";
const router = Router();

//admin only routes for problem
router.route("/create").post(verifyAdminJWT, createProblem);
router.route("/update/:id").post(verifyAdminJWT, updateProblem);
router.route("/delete/:id").post(verifyAdminJWT, deleteProblem);

//all users accessible problem route
router.route("/problemByID/:id").get(verifyJWT, getProblemByID);
router.route("/getAllProblems").get(verifyJWT, getAllProblems);
// router
//     .route("/getAllProblemsSolvedByUSer/:id")
//     .get(verifyJWT, getAllProblemsSolvedByUser);

export default router;
