import React from 'react';

const Comment = ({ date, message }) => {
    return(
        <div className="bg-white bg-opacity-80 w-full h-min p-8 flex flex-col gap-4 rounded-xl drop-shadow-md">
            <div className="flex flex-row justify-between items-center">
                {/* PROFILE */}
                <div className="flex flex-row gap-4 items-center">
                    <div className="bg-[#CECECE] h-10 w-10 rounded-xl drop-shadow-md"></div>
                    <h1 className="text-[#434343] font-bold text-xl">Anonymous</h1>
                </div>
                {/* DATE */}
                <h1 className="text-[#808080] font-bold text-xl">{date}</h1>
            </div>
            <p className="text-[#787878] font-bold text-md">
                {message}
            </p>
        </div>
    );
}

export default Comment;