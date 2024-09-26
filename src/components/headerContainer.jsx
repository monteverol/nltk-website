import React from 'react';

const HeaderContainer = ({ header, summary, stateView }) => {
    return (
        <div className="bg-[#F6F6F6] rounded-xl shadow-md p-4 w-[30%]">
            {/* HEADER */}
            <h1 className="text-[#5F5F5F] font-bold text-2xl">
                {header}
            </h1>
                    
            {/* SUMMARY */}
            {!stateView ? (
                <p className="text-[#919191] text-xl">
                    {summary}
                </p>
            ) : null}
        </div>
    );
}

export default HeaderContainer;