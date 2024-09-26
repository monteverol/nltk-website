import React, { useState } from "react";
import { TiArrowSortedDown } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
import logo_abscbn from '../assets/logo_abs-cbn.png';
import logo_gma from '../assets/logo_gma.png';
import logo_mt from '../assets/logo_manila-times.png';
import logo_philstar from '../assets/logo_philstar.png';
import logo_rappler from '../assets/logo_rappler.png';

const Home = () => {
    const [page, setPage] = useState(0);
    const [fade, setFade] = useState(true);
    const navigate = useNavigate();

    const news = [
        { class: "abs-cbn", header: "ABS-CBN News", logo: logo_abscbn },
        { class: "gma", header: "GMA News", logo: logo_gma },
        { class: "manila-times", header: "Manila-Times News", logo: logo_mt },
        { class: "philstar", header: "Phil-Star News", logo: logo_philstar },
        { class: "rappler", header: "Rappler News", logo: logo_rappler }
    ];

    const handleNextPage = () => {
        if (page < news.length - 1) {
            setFade(false);
            setTimeout(() => {
                setPage((prevPage) => prevPage + 1);
                setFade(true);
            }, 500);
        }
    };

    const handlePrevPage = () => {
        if (page > 0) {
            setFade(false);
            setTimeout(() => {
                setPage((prevPage) => prevPage - 1);
                setFade(true);
            }, 500);
        }
    };

    const handleConfirm = () => {
        const selectedNews = news[page];
        navigate(`/${selectedNews.class}`, { state: { header: selectedNews.header, class: selectedNews.class, logo: selectedNews.logo }});
    };

    return (
        <div className={`h-full w-full relative ${news[page].class} transition-opacity duration-500`}>
            {/* Dark Overlay Effect */}
            <div className={`absolute inset-0 transition-all duration-500 ${fade ? 'bg-transparent' : 'bg-black bg-opacity-80'}`}></div>

            <div className={`absolute top-8 right-8 bg-[#DADADA] p-2 rounded-xl h-40 w-40 transition-opacity flex items-center justify-center duration-500 ${fade ? 'opacity-100' : 'opacity-0'}`}>
                <img src={news[page].logo} alt={`${news[page].header} logo`} className="w-full" />
            </div>

            <div className="flex flex-col items-center justify-center gap-8 h-auto w-full absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]">
                <div className="flex flex-row w-full items-center justify-center">
                    {page > 0 && (
                        <TiArrowSortedDown
                            onClick={handlePrevPage}
                            color="#CECECE"
                            size={80}
                            className="rotate-90 cursor-pointer"
                        />
                    )}
                    <h1 className={`bg-[#E7E7E7] py-8 w-1/3 text-4xl font-bold rounded-2xl text-center z-10 transition-opacity duration-500 ${fade ? 'opacity-80' : 'opacity-0'}`}>
                        {news[page].header}
                    </h1>
                    {page < news.length - 1 && (
                        <TiArrowSortedDown
                            onClick={handleNextPage}
                            color="#CECECE"
                            size={80}
                            className="-rotate-90 cursor-pointer"
                        />
                    )}
                </div>
                <div onClick={handleConfirm} className={`bg-[#DADADA] w-1/5 flex items-center justify-center py-4 rounded-2xl z-10 cursor-pointer transition-opacity duration-500 ${fade ? 'opacity-60' : 'opacity-0'}`}>
                    <h1 className="font-bold text-2xl">Confirm</h1>
                </div>
            </div>
        </div>
    );
};

export default Home;