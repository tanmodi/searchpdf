"use client";
import React, { useState } from "react";
import link from "../link.js";

const Page = () => {
    const [username, setUsername] = useState("");
    const [output, setOutput] = useState("");
    const [audioURL, setAudioURL] = useState("");
    const [stream, setStream] = useState(null);
    const [recorder, setRecorder] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    const startRecording = async () => {
        try {
            const audioStream = await navigator.mediaDevices.getUserMedia({
                audio: true,
            });
            const mediaRecorder = new MediaRecorder(audioStream, {
                mimeType: "audio/webm; codecs=opus",
            });
            const chunks = [];

            mediaRecorder.addEventListener("dataavailable", (event) => {
                chunks.push(event.data);
            });

            mediaRecorder.addEventListener("stop", () => {
                const blob = new Blob(chunks, {
                    type: "audio/webm; codecs=opus",
                });
                const url = URL.createObjectURL(blob);
                setAudioURL(url);
                setOutput(
                    "Recording complete. You can now play or upload the audio."
                );
            });

            mediaRecorder.start();
            setIsRecording(true);
            setStream(audioStream);
            setRecorder(mediaRecorder);
            setOutput("Recording...");
        } catch (error) {
            console.error("Error starting recording:", error);
            setOutput("Error occurred while recording.");
        }
    };

    const stopRecording = () => {
        if (recorder && isRecording) {
            recorder.stop();
            setIsRecording(false);
            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
            }
        }
    };

    const playAudio = () => {
        if (audioURL) {
            const audioElement = new Audio(audioURL);
            audioElement.addEventListener("playing", () => setIsPlaying(true));
            audioElement.addEventListener("ended", () => setIsPlaying(false));
            audioElement.play();
        }
    };

    const handleUploadAndDownload = async () => {
        if (audioURL) {
            try {
                setOutput("Uploading audio...");

                const blob = await fetch(audioURL).then((response) =>
                    response.blob()
                );
                const a = document.createElement("a");
                a.href = audioURL;
                a.download = "audio.webm";
                a.click();
                const formData = new FormData();
                formData.append("username", username);
                formData.append("audio", blob, "audio.webm");

                const response = await fetch(link + "/api/speak", {
                    method: "POST",
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error("Failed to upload audio");
                }

                // Download audio

                const responseData = await response.text(); // Convert the response to text
                setOutput(JSON.stringify(responseData, null, 2));
            } catch (error) {
                console.error("Error:", error);
                setOutput(
                    "Error occurred while uploading audio.\nServer not working"
                );
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
            <div className="max-w-xl w-full py-8 px-8 bg-white shadow-lg rounded-lg">
                <h2 className="text-3xl font-semibold text-center mb-4">
                    Voice Recorder
                </h2>
                <div className="mt-6">
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

                <p className="text-center">
                    Click the buttons below to record and upload your voice.
                </p>
                <div className="flex justify-center mt-4">
                    <button
                        className="bg-customPink hover:bg-pink-400 text-white font-bold py-2 px-4 rounded mr-2"
                        onClick={startRecording}
                        disabled={isRecording}
                    >
                        Record
                    </button>
                    <button
                        className="bg-customPink hover:bg-pink-400 text-white font-bold py-2 px-4 rounded mr-2"
                        onClick={stopRecording}
                        disabled={!isRecording}
                    >
                        Stop
                    </button>
                    <button
                        className="bg-customPink hover:bg-pink-400 text-white font-bold py-2 px-4 rounded mr-2"
                        onClick={playAudio}
                        disabled={!audioURL}
                    >
                        Play
                    </button>
                    <button
                        className="bg-customPink hover:bg-pink-400 text-white font-bold py-2 px-4 rounded mr-2"
                        onClick={handleUploadAndDownload}
                        disabled={!audioURL}
                    >
                        Upload & Download
                    </button>
                </div>
                {isPlaying && audioURL && (
                    <audio
                        className="w-full mt-4"
                        controls
                        src={audioURL}
                    ></audio>
                )}
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
