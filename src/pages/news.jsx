import React from 'react';
import { useLocation } from 'react-router-dom';
import { CiSearch } from "react-icons/ci";

const News = () => {
    const location = useLocation();
    const { header, class: newsClass, logo } = location.state || {};

    return (
        <div className={`h-full w-full p-8 flex flex-col gap-8 ${newsClass}`}>
            {/* HEADER */}
            <div className="bg-[#DADADA] bg-opacity-90 flex flex-row justify-between items-center gap-8 p-4 rounded-2xl">
                {/* NEWS LOGO */}
                <div className="bg-[#DADADA] bg-opacity-90 flex flex-row h-20 items-center gap-8 p-4 rounded-xl shadow-md">
                    <h1 className="text-[#5F5F5F] font-bold text-2xl"> {header} </h1>
                    <img src={logo} alt={`${newsClass} logo`} className="h-full" />
                </div>

                {/* SEARCH */}
                <div className="bg-[#F6F6F6] bg-opacity-90 w-1/3 h-20 flex flex-row items-center rounded-xl shadow-md px-8">
                    <input type="text" placeholder="Search here" className="bg-transparent font-bold text-2xl outline-none w-full" />
                    <CiSearch color="#AEAEAE" size={40}/>
                </div>
            </div>

            {/* BODY */}
            <div className="flex flex-row gap-8">
                {/* LEFT SIDE */}
                <div className="h-full w-3/4 bg-[#DADADA] bg-opacity-80 rounded-2xl shadow-md">
                
                </div>
            </div>
        </div>
    );
}

export default News;