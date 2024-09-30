import React from 'react';

const SentimentChart = ({ bad, neutral, good }) => {
    return(
        <div className="h-full flex flex-col justify-evenly items-start p-8 gap-8">
            <div className="flex flex-row gap-8 w-full items-center">
                <h1 className="text-[#93614C] font-bold text-4xl w-40"> Bad </h1>
                <div className="bg-[#996F5D] h-16 rounded-xl shadow-md transition duration-500 drop-shadow-md" style={{ width: `${bad}%` }}></div>
                <h1 className="text-[#93614C] font-bold text-4xl"> {bad.toFixed(2)}% </h1>
            </div>
            <div className="flex flex-row gap-8 w-full items-center">
                <h1 className="text-[#978D5B] font-bold text-4xl w-40"> Neutral </h1>
                <div className="bg-[#978D5B] h-16 rounded-xl shadow-md transition duration-500 drop-shadow-md" style={{ width: `${neutral}%` }}></div>
                <h1 className="text-[#978D5B] font-bold text-4xl "> {neutral.toFixed(2)}% </h1>
            </div>
            <div className="flex flex-row gap-8 w-full items-center">
                <h1 className="text-[#5F9976] font-bold text-4xl w-40"> Good </h1>
                <div className="bg-[#5F9976] h-16 rounded-xl shadow-md transition duration-500 drop-shadow-md500" style={{ width: `${good}%` }}></div>
                <h1 className="text-[#5F9976] font-bold text-4xl"> {good.toFixed(2)}% </h1>
            </div>
        </div>
    );
}

export default SentimentChart;
