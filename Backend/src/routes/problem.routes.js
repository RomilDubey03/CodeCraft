import { Router } from "express";
import { verifyAdminJWT } from "../middlewares/admin.auth.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    createProblem,
    deleteProblem,
    getAllProblems,
    getProblemByID,
    updateProblem,
    getAllProblemsSolvedByUser,
    getSubmittedSolution
} from "../controllers/problem.controller.js";
const router = Router();

//admin only routes for problem
router.route("/create").post(verifyAdminJWT, createProblem);
router.route("/update/:id").post(verifyAdminJWT, updateProblem);
router.route("/delete/:id").post(verifyAdminJWT, deleteProblem);

//all users accessible problem route
router.route("/problemByID/:id").get(verifyJWT, getProblemByID);
router.route("/getAllProblems").get(verifyJWT, getAllProblems);
router
    .route("/getAllProblemsSolvedByUser")
    .get(verifyJWT, getAllProblemsSolvedByUser);

router.route("/submittedProblem/:id").get(verifyJWT, getSubmittedSolution);

export default router;
