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

    (title,
        description,
        difficulty,
        tags,
        visibleTestCases,
        starterCode,
        hiddenTestCases,
        referenceSolution);

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

        if (!language || !completeCode) {
            throw new ApiError(400, "Some fields are missing");
        }
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

    const problem = await Problem.create({
        ...req.body,
        problemCreator: req.user._id
    });

    return res
        .status(200)
        .json(new ApiResponse(200, { problem }, "Problem Added Succesfully"));
});
