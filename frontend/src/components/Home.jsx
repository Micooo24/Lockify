import React from "react";
import { useNavigate } from "react-router-dom";
import img from "../assets/img/home.png";

const Home = () => {
    const navigate = useNavigate();

    const handleStartAnalyzing = () => {
        navigate("/menu");
    };

    return (
        <div className="min-h-screen flex flex-col justify-center lg:flex-row lg:justify-between items-center lg:px-32 px-5 gap-10 bg-gradient-to-r from-[#0e397e] to-[#75a6a3]">
            <div className="w-full lg:w-2/4 space-y-4 mt-14 lg:mt-0">
                <h1 className="font-semibold text-5xl text-center lg:text-start leading-tight text-white">
                    Welcome to Your Password Strength Analyzer
                </h1>
                <p className="text-lg text-white text-center lg:text-start">
                    Assess and strengthen your passwords with ease. Our tool provides instant feedback, helping you create more secure passwords based on complexity, entropy, and security best practices.
                </p>

                <div className="flex flex-row gap-6 justify-center lg:justify-start">
                    <button
                        className="bg-[#89CFF3] hover:bg-[#00A9FF] text-black font-bold py-2 px-4 rounded transition duration-200"
                        onClick={handleStartAnalyzing}
                    >
                        Start Analyzing
                    </button>
                </div>
            </div>

            <div className="relative">
                <img
                    src={img}
                    alt="Home Illustration"
                    className="h-768w-68 md:h-[20rem] md:w-[20rem] lg:h-[30rem] lg:w-[30rem] max-w-screen-md object-cover rounded-lg shadow-[0_20px_50px_rgba(125,255,212,0.5)]"
                />
                <div className="absolute bg-white px-8 py-2 top-5 right-0 rounded-full shadow-[0_20px_50px_rgba(34,197,94,0.7)]">
                    {/* Optional stats or label */}
                </div>
                <div className="absolute bg-white px-8 py-2 bottom-0 -left-10 rounded-full">
                    {/* Optional stats or label */}
                </div>
            </div>
        </div>
    );
};

export default Home;