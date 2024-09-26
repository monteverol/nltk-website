import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import News from './pages/news';
import Article from './pages/article';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:news" element={<News />} />
        <Route path="/article" element={<Article />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;