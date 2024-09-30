import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { BiSolidLike, BiSolidDislike, BiCommentDetail } from "react-icons/bi";
import initialComments from '../data/comments';
import Sentiment from 'sentiment'; // Import sentiment analysis library
import SentimentChart from '../components/sentimentChart';
import Comment from '../components/comment';

const Article = () => {
  const location = useLocation();
  const { title, summary, paragraphs, tags, date } = location.state || {};
  
  const [active, setActive] = useState(null); // Track which button is active (null, 'like', or 'dislike')
  const [inputValue, setInputValue] = useState(''); // Manage the input value
  const [comments, setComments] = useState(initialComments); // Manage the comments array
  const [sentimentData, setSentimentData] = useState({ bad: 0, neutral: 0, good: 0 }); // Initialize sentiment data
  
  const sentiment = new Sentiment(); // Initialize sentiment analysis
  
  // Format the date to "Month Day, Year"
  const formattedDate = date ? new Date(date).toLocaleDateString("en-US", {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }) : '';
  
  const handleLikeClick = () => {
    setActive(active === 'like' ? null : 'like');
  };
  
  const handleDislikeClick = () => {
    setActive(active === 'dislike' ? null : 'dislike');
  };

  const analyzeSentiment = (message) => {
    const result = sentiment.analyze(message);
    if (result.score > 0) {
      return 'good';
    } else if (result.score < 0) {
      return 'bad';
    } else {
      return 'neutral';
    }
  };

  const updateSentimentData = (newSentiment) => {
    let newBad = sentimentData.bad;
    let newNeutral = sentimentData.neutral;
    let newGood = sentimentData.good;

    if (newSentiment === 'bad') {
      newBad += 1;
    } else if (newSentiment === 'neutral') {
      newNeutral += 1;
    } else if (newSentiment === 'good') {
      newGood += 1;
    }

    const total = newBad + newNeutral + newGood;
    setSentimentData({
      bad: (newBad / total) * 100,
      neutral: (newNeutral / total) * 100,
      good: (newGood / total) * 100
    });
  };

  const handlePost = () => {
    if (inputValue.trim()) {
      const newComment = {
        date: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }),
        message: inputValue.trim(),
      };
      
      const sentimentResult = analyzeSentiment(newComment.message);
      updateSentimentData(sentimentResult);

      setComments([newComment, ...comments]);
      setInputValue(''); // Clear the input field
    }
  };

  if (!title) {
    return <div>No article data found.</div>;
  }

  return (
    <div className="h-full w-full abs-cbn relative overflow-hidden">
      <div className="h-[90%] w-[80%] flex flex-row gap-8 absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]">
        {/* LEFT SIDE */}
        <div className="bg-[#F4F4F4] w-[60%] bg-opacity-80 p-8 flex flex-col gap-8 overflow-y-scroll rounded-2xl drop-shadow-md">
          {/* TITLE */}
          <div className="bg-[#B5B5B5] bg-opacity-80 w-full p-8 rounded-xl drop-shadow-md">
            <h1 className="text-[#000000] font-bold text-4xl">{title}</h1>
          </div>

          {/* SUMMARY */}
          <div className="bg-[#FFFFFF] bg-opacity-80 w-full p-8 flex flex-col gap-8 rounded-xl drop-shadow-md">
            <h1 className="text-[#A8A8A8] font-bold text-2xl">Summary</h1>
            <p className="text-[#787878] font-bold text-xl">{summary}</p>
          </div>

          {/* TAGS */}
          <div className="bg-[#FFFFFF] bg-opacity-80 w-full p-8 flex flex-col gap-8 rounded-xl drop-shadow-md">
            <h1 className="text-[#A8A8A8] font-bold text-2xl">Tags</h1>
            <div className="flex flex-wrap gap-4">
              {
                tags && tags.map((tag, key) => (
                  <p key={key} className="text-[#787878] font-bold italic underline text-xl">#{tag}</p>
                ))
              }
            </div>
          </div>

          {/* FULL ARTICLE */}
          <div className="bg-[#FFFFFF] bg-opacity-80 w-full p-8 flex flex-col gap-8 rounded-xl drop-shadow-md">
            <div className="w-full flex justify-between items-center">
              <h1 className="text-[#A8A8A8] w-1/6 font-bold text-2xl">Full Article</h1>
              <h1 className="text-[#5A5A5A] font-bold text-2xl">{formattedDate}</h1>
            </div>
            <p className="text-[#787878] font-bold text-xl">{paragraphs}</p>
          </div>

          {/* SENTIMENT CHART */}
          <div className="bg-[#FFFFFF] bg-opacity-80 w-full p-8 flex flex-col gap-8 rounded-xl drop-shadow-md">
            <h1 className="text-[#5A5A5A] font-bold text-4xl">Sentiment Analysis</h1>
            <SentimentChart
              bad={sentimentData.bad}
              neutral={sentimentData.neutral}
              good={sentimentData.good}
            />
          </div>
        </div>
        
        {/* RIGHT SIDE */}
        <div className="bg-[#F4F4F4] bg-opacity-80 p-8 w-[40%] flex flex-col gap-8 overflow-y-scroll relative rounded-2xl drop-shadow-md">
          <div className="flex flex-row w-full justify-between items-center">
            <h1 className="text-[#585858] font-bold text-4xl">Comments</h1>
            <div className="flex flex-row gap-4">
              <div 
                onClick={handleDislikeClick}
                className={`p-4 flex items-center justify-center rounded-xl drop-shadow-md cursor-pointer transition-colors duration-300 
                ${active === 'dislike' ? 'bg-[#A26C6C]' : 'bg-[#F0F0F0]'}`}
              >
                <BiSolidDislike color={active === 'dislike' ? "#FFFFFF" : "#A26C6C"} size={40} />
              </div>
              <div 
                onClick={handleLikeClick}
                className={`p-4 flex items-center justify-center rounded-xl drop-shadow-md cursor-pointer transition-colors duration-300 
                ${active === 'like' ? 'bg-[#5E8B60]' : 'bg-[#F0F0F0]'}`}
              >
                <BiSolidLike color={active === 'like' ? "#FFFFFF" : "#5E8B60"} size={40} />
              </div>
            </div>
          </div>
          <div className="h-full w-full flex flex-col gap-4 overflow-y-scroll">
            {
              comments.map((comment, key) => (
                <Comment 
                  key={key}
                  date={comment.date}
                  message={comment.message}
                />
              ))
            }
          </div>
          {/* COMMENT */}
          <div className="bg-white gap-2 p-2 bottom-8 flex flex-row items-center rounded-xl drop-shadow-md w-full box-border">
            <BiCommentDetail color="#A8A8A8" size={40} />
            <input 
              type="text" 
              placeholder="Comment here" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="font-bold text-2xl outline-none bg-transparent flex-grow" 
            />
            <button 
              type="button" 
              onClick={handlePost}
              className="bg-[#8E5A5A] px-4 py-2 font-bold text-white text-xl rounded-xl drop-shadow-md"
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Article;
