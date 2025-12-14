import { Router } from "express";
import {
    submitSolution,
    runSolution
} from "../controllers/submission.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Authorised routes - submit solution, run solution
router.route("/submit/:id").post(verifyJWT, submitSolution);

router.route("/run/:id").post(verifyJWT, runSolution);

export default router;
