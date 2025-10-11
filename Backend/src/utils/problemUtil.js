import axios from "axios";
import ApiError from "./apiError.js";

export const getLanguageById = (lang) => {
    const languages = {
        "c++": 54,
        "java": 62,
        "javascript": 63
    };

    return languages[lang.toLowerCase()];
};

export const submitBatch = async (submissions) => {
    const options = {
        method: "POST",
        url: "https://judge0-ce.p.rapidapi.com/submissions/batch",
        params: {
            base64_encoded: "false"
        },
        headers: {
            "x-rapidapi-key": process.env.JUDGE0_KEY,
            "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
            "Content-Type": "application/json"
        },
        data: {
            submissions
        }
    };

    async function fetchData() {
        try {
            const response = await axios.request(options);
            return response.data;
        } catch (error) {
            throw new ApiError(
                500,
                "The code execution engine failed to process the request."
            );
        }
    }

    return await fetchData();
};

const waiting = async (timer) => {
    setTimeout(() => {
        return 1;
    }, timer);
};

export const submitToken = async (resultTokens) => {
    const options = {
        method: "GET",
        url: "https://judge0-ce.p.rapidapi.com/submissions/batch",
        params: {
            tokens: resultTokens.join(","), // to convert the array into comma separated string
            base64_encoded: "false",
            fields: "*"
        },
        headers: {
            "x-rapidapi-key": process.env.JUDGE0_KEY,
            "x-rapidapi-host": "judge0-ce.p.rapidapi.com"
        }
    };

    async function fetchData() {
        try {
            const response = await axios.request(options);
            return response.data;
        } catch (error) {
            throw new ApiError(
                500,
                `The code execution engine failed to process the request: ${error.response?.data || error.message}`
            );
        }
    }

    while (true) {
        const result = await fetchData();

        const isResultObtained = result.submissions.every(
            (r) => r.status_id > 2
        );

        if (isResultObtained) {
            return result.submissions;
        }

        await waiting(1000);
    }
};
