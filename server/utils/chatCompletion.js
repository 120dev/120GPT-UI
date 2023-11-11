const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const openai = axios.create({
    baseURL: "https://api.openai.com/v1",
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
    },
});

//https://platform.openai.com/docs/guides/gpt/function-calling
// https://github.com/openai/openai-cookbook/blob/main/examples/How_to_stream_completions.ipynb
async function createChatCompletion(messages, options = {}) {
    try {
        const response = await openai.post("/chat/completions", {
            model: 'gpt-4',
            messages,
            ...options,
        });
        console.dir(response)
        return response.data.choices;
    } catch (error) {
        console.error("Error creating chat completion:", error);
        throw error;
    }
}

module.exports = createChatCompletion;
