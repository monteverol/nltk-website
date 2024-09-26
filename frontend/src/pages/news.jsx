import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CiSearch } from "react-icons/ci";
import { FaSortAmountDown , FaSortAmountUpAlt   } from "react-icons/fa";
import HeaderContainer from '../components/headerContainer';
import articles from '../data/articles';
import tags from '../data/tags';

const News = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { header, class: newsClass, logo } = location.state || {};
    const [stateView, setStateView] = useState(true); // Normal View = TRUE by default
    const [sort, setSort] = useState(true);

    const toggleSort = () => {
        setSort((prevSort) => !prevSort);
    }

    const handleViewChange = (view) => {
        setStateView(view);
    };

    return (
        <div className={`h-full w-full p-8 flex flex-col gap-8 ${newsClass}`}>
            {/* HEADER */}
            <div className="bg-[#DADADA] bg-opacity-90 flex flex-row justify-between items-center gap-8 p-4 rounded-2xl">
                {/* NEWS LOGO */}
                <div 
                    onClick={() => navigate('/')}
                    className="bg-[#DADADA] bg-opacity-90 flex flex-row h-20 items-center gap-8 p-4 rounded-xl drop-shadow-md cursor-pointer">
                    <h1 className="text-[#5F5F5F] font-bold text-2xl"> {header} </h1>
                    <img src={logo} alt={`${newsClass} logo`} className="h-full" />
                </div>

                {/* SEARCH */}
                <div className="bg-[#F6F6F6] bg-opacity-90 w-1/3 h-20 flex flex-row items-center rounded-xl drop-shadow-md px-8">
                    <input type="text" placeholder="Search here" className="bg-transparent font-bold text-2xl outline-none w-full" />
                    <CiSearch color="#AEAEAE" size={40}/>
                </div>
            </div>

            {/* BODY */}
            <div className="flex flex-row gap-8 h-full overflow-y-hidden">
                {/* LEFT SIDE */}
                <div className="h-auto w-[70%] overflow-y-scroll flex flex-wrap justify-evenly gap-8 bg-[#DADADA] p-8 bg-opacity-80 rounded-2xl drop-shadow-md">
                    {/* ARTICLES */}
                    {
                        articles.map((article, key) => (
                            <HeaderContainer 
                                key={key}
                                header={article.header}
                                summary={article.summary}
                                stateView={stateView}
                            />
                        ))
                    }
                </div>

                {/* RIGHT SIDE */}
                <div className="bg-[#DADADA] bg-opacity-80 flex flex-col items-start w-[30%] rounded-2xl drop-shadow-md p-8 gap-4">
                    <label htmlFor="normal-view" className="w-full cursor-pointer">
                        <div className="bg-[#FFFFFF] py-4 px-8 flex flex-row justify-between items-center rounded-xl drop-shadow-md">
                            <h1 className="text-[#656565] font-bold text-2xl">Normal View</h1>
                            <input 
                                type="radio" 
                                name="view" 
                                id="normal-view" 
                                className="scale-150" 
                                checked={stateView === true}
                                onChange={() => handleViewChange(true)} 
                            />
                        </div>
                    </label>
                    <label htmlFor="title-only-view" className="w-full cursor-pointer">
                        <div className="bg-[#FFFFFF] py-4 px-8 flex flex-row justify-between items-center rounded-xl drop-shadow-md">
                            <h1 className="text-[#656565] font-bold text-2xl">Title-Only View</h1>
                            <input 
                                type="radio" 
                                name="view" 
                                id="title-only-view" 
                                className="scale-150" 
                                checked={stateView === false}
                                onChange={() => handleViewChange(false)} 
                            />
                        </div>
                    </label>
                    <div onClick={toggleSort} className="bg-[#D2D2D2] py-4 px-8 w-full flex flex-row justify-between items-center rounded-xl drop-shadow-md cursor-pointer">
                        {sort ? <FaSortAmountDown color="#434343" size={40} /> : <FaSortAmountUpAlt color="#434343" size={40} />}
                        {sort ? <h1 className="text-[#434343] font-bold text-2xl">Sort by Recency</h1> : <h1 className="text-[#434343] font-bold text-2xl">Sort by Latency</h1>}
                    </div>
                    <div className="bg-[#959595] p-8 gap-4 w-full h-full overflow-y-scroll rounded-xl drop-shadow-md flex flex-wrap items-start">
                        {/* TAGS */}
                        {
                            tags.map((index, key) => (
                                <div className="bg-white rounded-xl drop-shadow-md px-4 py-2" key={key}>
                                    <h1 className="text-[#818181] font-bold text-xl">#{index}</h1>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default News;
