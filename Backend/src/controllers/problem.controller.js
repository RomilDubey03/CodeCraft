import { Problem } from "../models/problem.model.js";
import { User } from "../models/user.model.js";
import Submission from "../models/submission.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
    getLanguageById,
    submitBatch,
    submitToken
} from "../utils/problemUtil.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/ApiResponse.js";

export const createProblem = asyncHandler(async (req, res) => {
    console.log("start");

    console.log(req.body);
    const {
        title,
        description,
        difficulty,
        tags,
        visibleTestCases,
        starterCode,
        hiddenTestCases,
        referenceSolution
    } = req.body;

    if (
        !title ||
        !description ||
        !difficulty ||
        !tags ||
        !visibleTestCases ||
        !referenceSolution ||
        visibleTestCases.length === 0 ||
        referenceSolution.length === 0 ||
        !starterCode ||
        starterCode.length === 0 ||
        !hiddenTestCases
    ) {
        throw new ApiError(400, "Some fields are missing");
    }
    console.log("all data correct");
    for (const ele of referenceSolution) {
        const { language, completeCode } = ele;

        const languageId = getLanguageById(language);

        if (!languageId) {
            throw new ApiError(
                400,
                `Invalid or unsupported language provided: '${language}'`
            );
        }
        console.log("language correct");
        const submissions = visibleTestCases.map((testcase) => ({
            source_code: completeCode,
            language_id: languageId,
            stdin: testcase.input,
            expected_output: testcase.output
        }));
        //would look like this
        // [
        //   {
        //     source_code: "print('Hello')",
        //     language_id: 71,
        //     stdin: "5",          // Taken from the first test case
        //     expected_output: "25" // Taken from the first test case
        //   },
        //   {
        //     source_code: "print('Hello')",
        //     language_id: 71,
        //     stdin: "10",         // Taken from the second test case
        //     expected_output: "100" // Taken from the second test case
        //   }
        // ]
        console.log("submissions correct");
        const batchSubmissionResult = await submitBatch(submissions);
        console.log("batchSubmissionResult correct");
        console.log(batchSubmissionResult);

        const tokenList = batchSubmissionResult.map((value) => value.token);
        console.log("tokenList correct");
        console.log(tokenList);
        const tokenSubmissionResult = await submitToken(tokenList);
        console.log("tokenSubmissionResult correct");
        for (const test of tokenSubmissionResult) {
            console.log(test);
            if (test.status_id != 3) {
                console.log("test correct");
                console.log(test.description);
                return res
                    .status(400)
                    .json(
                        new ApiResponse(
                            400,
                            test.description,
                            "Submission Failed"
                        )
                    );
            }
        }
    }
    console.log("all test cases correct");
    const problem = await Problem.create({
        ...req.body,
        problemCreator: req.user._id
    });
    console.log("problem created");

    return res
        .status(200)
        .json(new ApiResponse(200, { problem }, "Problem Added Succesfully"));
});

export const updateProblem = asyncHandler(async (req, res) => {
    const {
        title,
        description,
        difficulty,
        tags,
        visibleTestCases,
        hiddenTestCases,
        starterCode,
        referenceSolution
    } = req.body;

    if (
        !title ||
        !description ||
        !difficulty ||
        !tags ||
        !visibleTestCases ||
        !referenceSolution ||
        visibleTestCases.length === 0 ||
        referenceSolution.length === 0 ||
        !starterCode ||
        starterCode.length === 0 ||
        !hiddenTestCases
    ) {
        throw new ApiError(400, "Some fields are missing");
    }

    const { id } = req.params;

    if (!id) {
        throw new ApiError(402, "Problem ID missing in request!");
    }

    const oldProblem = await Problem.findById(id);

    if (!oldProblem) {
        throw new ApiError(404, "Problem with this ID does not exists");
    }

    for (const ele of referenceSolution) {
        const { language, completeCode } = ele;

        const languageID = getLanguageById(language);

        if (!languageID) {
            throw new ApiError(
                400,
                `Invalid or unsupported language provided: '${language}'`
            );
        }

        const submissions = visibleTestCases.map((testcases) => ({
            source_code: completeCode,
            language_id: languageID,
            stdin: testcases.input,
            expected_output: testcases.output
        }));

        const batchSubmissionResult = await submitBatch(submissions);

        const tokenList = batchSubmissionResult.map((value) => value.token);

        const tokenSubmissionResult = await submitToken(tokenList);

        for (const test of tokenSubmissionResult) {
            if (test.status_id != 3) {
                return res
                    .status(400)
                    .json(new ApiResponse(400, test.description));
            }
        }
    }

    const problem = await Problem.findByIdAndUpdate(
        id,
        {
            ...req.body,
            problemCreator: req.user._id
        },
        { runValidators: true, new: true }
    );

    return res
        .status(200)
        .json(new ApiResponse(200, { problem }, "Problem Updated Succesfully"));
});

export const deleteProblem = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id) {
        throw new ApiError(400, "Problem ID missing!");
    }

    const problemDeletedByUser = await Problem.findByIdAndDelete(id);

    if (!problemDeletedByUser) {
        throw new ApiError(402, "Problem does not exists!");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Problem Deleted Succesfully"));
});

export const getProblemByID = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id) {
        throw new ApiError(402, "Problem ID Missing!");
    }

    const problemRequested = await Problem.findById(id);
    //referenceSolution can be removed by select() in some cases

    if (!problemRequested) {
        throw new ApiError(404, "Problem does not exists!");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { problemRequested },
                "Problem Fetched Successfully!"
            )
        );
});

export const getAllProblems = asyncHandler(async (req, res) => {
    const allProblems = await Problem.find({}).select(
        "_id title difficulty tags"
    );

    if (allProblems.length === 0) {
        throw new ApiError(404, "Problems not found!");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { allProblems },
                "All problems fetched successfully"
            )
        );
});

// export const problemSolvedByUser = asyncHandler(async (req, res) => {
//     const userId = req.user._id;
//     const problemId = req.params.id;
//     if (!userId || !problemId) {
//         throw new ApiError(400, "Some fields are missing");
//     }
//     const problem = await Problem.findById(problemId);

//     if (!problem) throw new ApiError(404, "Problem not found");
//     const user = req.user;
//     if (!user.problemSolved.includes(problemId)) {
//         user.problemSolved.push(problemId);
//         await user.save();
//     }
//     return res
//         .status(200)
//         .json(
//             new ApiResponse(
//                 200,
//                 {},
//                 "Problem marked as solved by the user"
//             )
//         );
// });

export const getAllProblemsSolvedByUser = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    if (!userId) {
        throw new ApiError(400, "User ID missing");
    }

    const user = await User.findById(userId).populate({
        path: "problemSolved",
        select: "_id title difficulty tags"
    });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (!user.problemSolved || user.problemSolved.length === 0) {
        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    { problemsSolved: [] },
                    "No problems solved by this user"
                )
            );
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { problemsSolved: user.problemSolved },
                "Problems solved by user fetched successfully"
            )
        );
});

export const getSubmittedSolution = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const problemId = req.params.id;

    const solutions = await Submission.find({
        submittedByUser: userId,
        solvedProblemId: problemId
    });

    if (!solutions || solutions.length === 0) {
        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    [],
                    "No Submissions by the user for this Problem"
                )
            );
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, solutions, "Submissions fetched successfully")
        );
});
