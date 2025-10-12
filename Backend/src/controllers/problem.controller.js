import { Problem } from "../models/problem.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
    getLanguageById,
    submitBatch,
    submitToken
} from "../utils/problemUtil.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/ApiResponse.js";

export const createProblem = asyncHandler(async (req, res) => {
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

    for (const ele of referenceSolution) {
        const { language, completeCode } = ele;

        const languageId = getLanguageById(language);

        if (!languageId) {
            throw new ApiError(
                400,
                `Invalid or unsupported language provided: '${language}'`
            );
        }

        const submissions = visibleTestCases.map((testcase) => ({
            source_code: completeCode,
            language_id: languageId,
            stdin: testcase.input,
            expected_output: testcase.output
        }));

        const batchSubmissionResult = await submitBatch(submissions);

        const tokenList = batchSubmissionResult.map((value) => (value.token));

        const tokenSubmissionResult = await submitToken(tokenList);

        for (const test of tokenSubmissionResult) {
            if (test.status_id != 3) {
                return res
                    .status(400)
                    .json(new ApiResponse(400, test.description));
            }
        }
    }

    const problem = await Problem.create({
        ...req.body,
        problemCreator: req.user._id
    });

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

