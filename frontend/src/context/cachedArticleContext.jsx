import React, { createContext, useState } from "react";

// Create the context
export const CachedArticlesContext = createContext();

// Create the provider component
export const CachedArticlesProvider = ({ children }) => {
  const [cachedArticles, setCachedArticles] = useState({}); // Store articles in memory

  // Function to cache articles for a specific news class
  const cacheArticles = (newsClass, articles) => {
    setCachedArticles((prevCache) => ({
      ...prevCache,
      [newsClass]: articles,
    }));
  };

  // Function to get cached articles for a specific news class
  const getCachedArticles = (newsClass) => {
    return cachedArticles[newsClass] || null;
  };

  return (
    <CachedArticlesContext.Provider value={{ cacheArticles, getCachedArticles }}>
      {children}
    </CachedArticlesContext.Provider>
  );
};
