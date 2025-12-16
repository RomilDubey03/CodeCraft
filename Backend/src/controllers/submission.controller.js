import { Problem } from "../models/problem.model.js";
import { User } from "../models/user.model.js";
import Submission from "../models/submission.model.js";
import {
    getLanguageById,
    submitBatch,
    submitToken
} from "../utils/problemUtil.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/apiError.js";

const submitSolution = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const problemId = req.params.id;

    let { code, language } = req.body;

    if (!userId || !code || !problemId || !language) {
        throw new ApiError(400, "Some fields are missing");
    }
    // for frontend code editor i.e monaco, as it accepts cpp and our problemSchema has c++
    if (language === "cpp") language = "c++";

    const problem = await Problem.findById(problemId);

    if (!problem) throw new ApiError(404, "Problem not found");

    // now we will submit this code sent by user in our database and mark the status as pending, so that if our judge0 fails to give any response, we would still have the data for further ask
    const solutionSubmitResult = await Submission.create({
        submittedByUser: userId,
        solvedProblemId: problemId,
        solutionCode: code,
        language,
        status: "pending",
        totalTestCases: problem.hiddenTestCases.length
    });

    // submit the code to judge0
    const languageId = getLanguageById(language);

    if (!languageId) {
        throw new ApiError(
            400,
            `Invalid or unsupported language provided: '${language}'`
        );
    }

    const submissions = problem.hiddenTestCases.map((testcase) => ({
        source_code: code,
        language_id: languageId,
        stdin: testcase.input,
        expected_output: testcase.output
    }));

    const batchSubmissionResult = await submitBatch(submissions);

    const tokenList = batchSubmissionResult.map((value) => value.token);

    const tokenSubmissionResult = await submitToken(tokenList);

    // update the solutionSubmittedResult now
    let casesPassed = 0;
    let runtime = 0;
    let memory = 0;
    let status = "accepted";
    let errorMessage = null;

    for (const test of tokenSubmissionResult) {
        if (test.status_id === 3) {
            casesPassed++;
            runtime += parseFloat(test.time);
            memory = Math.max(memory, test.memory);
        } else {
            if (test.status_id === 4) {
                status = "error";
                errorMessage = test.stderr;
            } else {
                status = "wrong";
                errorMessage = test.stderr;
            }
        }
    }

    solutionSubmitResult.status = status;
    solutionSubmitResult.testCasesPassed = casesPassed;
    solutionSubmitResult.errorMessage = errorMessage;
    solutionSubmitResult.runtime = runtime;
    solutionSubmitResult.memory = memory;

    await solutionSubmitResult.save();

    // If the solution is accepted, add the problem to the user's problemSolved array
    if (status === "accepted") {
        const user = await User.findById(userId);

        if (user && !user.problemSolved.includes(problemId)) {
            user.problemSolved.push(problemId);
            await user.save();
        }
    }

    const accepted = status === "accepted";
    res.status(201).json(
        new ApiResponse(
            201,
            {
                accepted,
                totalTestCases: solutionSubmitResult.totalTestCases,
                passedTestCases: casesPassed,
                runtime,
                memory,
                error: solutionSubmitResult.errorMessage
            },
            "Code submitted successfully"
        )
    );
});

const runSolution = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const problemId = req.params.id;

    let { code, language } = req.body;

    if (!userId || !code || !problemId || !language) {
        throw new ApiError(400, "Some fields are missing");
    }

    if (language === "cpp") language = "c++"; // for frontend code editor i.e monaco, as it accepts cpp and our problemSchema has c++

    // fetch the problem db
    const problem = await Problem.findById(problemId);

    if (!problem) throw new ApiError(404, "Problem not found");

    // submit the code to judge0
    const languageId = getLanguageById(language);

    if (!languageId) {
        throw new ApiError(
            400,
            `Invalid or unsupported language provided: '${language}'`
        );
    }

    const submissions = problem.visibleTestCases.map((testcase) => ({
        source_code: code,
        language_id: languageId,
        stdin: testcase.input,
        expected_output: testcase.output
    }));

    const batchSubmissionResult = await submitBatch(submissions);

    const tokenList = batchSubmissionResult.map((value) => value.token);

    const tokenSubmissionResult = await submitToken(tokenList);
    let casesPassed = 0;
    let runtime = 0;
    let memory = 0;
    let status = true;
    let errorMessage = null;

    for (const test of tokenSubmissionResult) {
        if (test.status_id === 3) {
            casesPassed++;
            runtime += parseFloat(test.time);
            memory = Math.max(memory, test.memory);
        } else {
            if (test.status_id === 4) {
                status = false;
                errorMessage = test.stderr;
            } else {
                status = false;
                errorMessage = test.stderr;
            }
        }
    }

    res.status(200).json(
        new ApiResponse(
            200,
            {
                success: status,
                testCases: tokenSubmissionResult,
                runtime,
                memory
            },
            "Code executed successfully"
        )
    );
});

export { submitSolution, runSolution };
