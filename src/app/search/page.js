"use client";
import { useState } from "react";
import { link } from "../link";

const Page = () => {
    const [username, setUsername] = useState("");
    const [question, setQuestion] = useState("");
    const [output, setOutput] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = { username, question }; // Updated variable name to username

        try {
            setOutput("Sending the question...");

            const response = await fetch(link + "/api/search", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error("Failed to fetch data");
            }

            const responseData = await response.json();
            setOutput(JSON.stringify(responseData, null, 2));
        } catch (error) {
            console.error("Error:", error);
            setOutput(
                "Error occurred while fetching data.\nServer not working"
            );
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
            <div className="max-w-xl w-full py-8 px-8 bg-white shadow-lg rounded-lg">
                <h2 className="text-3xl font-semibold text-center mb-4">
                    Ask a Question
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label
                            htmlFor="username"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md px-4 py-2"
                            placeholder="Enter your username"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="question"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Question
                        </label>
                        <input
                            type="text"
                            id="question"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md px-4 py-2"
                            placeholder="What is your question?"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-customPink hover:bg-pink-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Submit
                    </button>
                </form>

                <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Output
                    </h3>
                    <textarea
                        value={output}
                        readOnly
                        className="mt-1 p-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md h-auto"
                        rows={6}
                        placeholder="Response will appear here"
                    />
                </div>
            </div>
        </div>
    );
};

export default Page;
