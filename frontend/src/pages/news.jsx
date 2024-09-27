import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import { FaSortAmountDown, FaSortAmountUpAlt } from "react-icons/fa";
import HeaderContainer from "../components/HeaderContainer";
import { CachedArticlesContext } from "../context/cachedArticleContext"; // Import the context

const News = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { header, class: newsClass, logo } = location.state || {};
  const [stateView, setStateView] = useState(true);
  const [sort, setSort] = useState(true);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [tags, setTags] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true); // Add loading state

  // Access cacheArticles and getCachedArticles from context
  const { cacheArticles, getCachedArticles } = useContext(CachedArticlesContext);

  // Check if articles are already cached
  const cachedArticles = getCachedArticles(newsClass);

  useEffect(() => {
    if (cachedArticles) {
      // Use cached articles if available
      setFilteredArticles(cachedArticles);
      setLoading(false); // Set loading to false once articles are loaded
    } else {
      // Fetch articles if not cached
      const fetchNews = async () => {
        setLoading(true); // Start loading before fetching
        try {
          const response = await fetch(`http://127.0.0.1:5000/api/${newsClass}`);
          const data = await response.json();
          cacheArticles(newsClass, data.news); // Cache articles after fetching
          setFilteredArticles(data.news); // Set filtered articles
          setTags(data.tags); // Set tags
        } catch (error) {
          console.error("Error fetching news:", error);
        } finally {
          setLoading(false); // Stop loading once fetching is complete
        }
      };
      fetchNews();
    }
  }, [newsClass, cachedArticles, cacheArticles]);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    const regex = new RegExp(query, "i");
    const filtered = cachedArticles.filter((article) => regex.test(article.title));
    setFilteredArticles(filtered);
  };

  const toggleSort = () => setSort((prevSort) => !prevSort);
  const handleViewChange = (view) => setStateView(view);

  return (
    <div className={`h-full w-full p-8 flex flex-col gap-8 ${newsClass}`}>
      {/* HEADER */}
      <div className="bg-[#DADADA] bg-opacity-90 flex flex-row justify-between items-center gap-8 p-4 rounded-2xl">
        {/* NEWS LOGO */}
        <div
          onClick={() => navigate("/")}
          className="bg-[#DADADA] bg-opacity-90 flex flex-row h-20 items-center gap-8 p-4 rounded-xl drop-shadow-md cursor-pointer"
        >
          <h1 className="text-[#5F5F5F] font-bold text-2xl"> {header} </h1>
          <img src={logo} alt={`${newsClass} logo`} className="h-full" />
        </div>

        {/* SEARCH */}
        <div className="bg-[#F6F6F6] bg-opacity-90 w-1/3 h-20 flex flex-row items-center rounded-xl drop-shadow-md px-8">
          <input
            type="text"
            placeholder="Search here"
            className="bg-transparent font-bold text-2xl outline-none w-full"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <CiSearch color="#AEAEAE" size={40} />
        </div>
      </div>

      {/* BODY */}
      <div className="flex flex-row gap-8 h-full overflow-y-hidden">
        {/* LEFT SIDE */}
        <div className="h-auto w-[70%] overflow-y-scroll flex flex-wrap justify-evenly gap-8 bg-[#DADADA] p-8 bg-opacity-80 rounded-2xl drop-shadow-md">
          {/* ARTICLES */}
          {loading ? (
            <div className="text-xl font-bold">Loading articles...</div> // Display loading state
          ) : filteredArticles.length > 0 ? (
            filteredArticles.map((article, key) => (
              <HeaderContainer
                key={key}
                header={article.title}
                summary={article.summary}
                stateView={stateView}
                onClick={() =>
                  navigate("/article", {
                    state: {
                      title: article.title,
                      summary: article.summary,
                      paragraphs: article.paragraphs,
                      tags: article.tags,
                      date: article.date,
                    },
                  })
                }
              />
            ))
          ) : (
            <div className="text-xl font-bold">No articles found</div>
          )}
        </div>

        {/* RIGHT SIDE */}
        <div className="bg-[#DADADA] bg-opacity-80 flex flex-col items-start w-[30%] rounded-2xl drop-shadow-md p-8 gap-4">
          {/* NORMAL VIEW / TITLE-ONLY VIEW TOGGLE */}
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
              <h1 className="text-[#656565] font-bold text-2xl">
                Title-Only View
              </h1>
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

          {/* SORT TOGGLE */}
          <div
            onClick={toggleSort}
            className="bg-[#D2D2D2] py-4 px-8 w-full flex flex-row justify-between items-center rounded-xl drop-shadow-md cursor-pointer"
          >
            {sort ? (
              <FaSortAmountDown color="#434343" size={40} />
            ) : (
              <FaSortAmountUpAlt color="#434343" size={40} />
            )}
            <h1 className="text-[#434343] font-bold text-2xl">
              {sort ? "Sort by Recency" : "Sort by Latency"}
            </h1>
          </div>

          {/* TAGS */}
          <div className="bg-[#959595] p-8 gap-4 w-full h-full overflow-y-scroll rounded-xl drop-shadow-md flex flex-wrap items-start">
            {tags.map((tagObj, key) => (
              <div
                className="bg-white rounded-xl drop-shadow-md px-4 py-2"
                key={key}
              >
                <h1 className="text-[#818181] font-bold text-xl">
                  #{tagObj.tag}
                </h1>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default News;
