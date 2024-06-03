import React from 'react';
import "../styles/Newscard.css"; // Import custom CSS for Newscard styling

const Newscard = ({ news }) => {
  return (
    <div className="news-container">
      {news.map((article, index) => (
        <div className="news-card" key={index}>
          <img src={article.image_url} alt="News" />
          <div className="card-content">
            <h2>{article.title}</h2>
            <p>{article.description}</p>
            <p>Published on: {new Date(article.published_at).toLocaleDateString()}</p>
            <a href={article.url} target="_blank" rel="noopener noreferrer">Read More</a>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Newscard;
