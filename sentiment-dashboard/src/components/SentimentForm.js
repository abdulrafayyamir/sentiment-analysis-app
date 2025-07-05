import React, { useState } from 'react';

function SentimentForm({ onAnalyze, isLoading }) {
  const [text, setText] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevents page refresh
    if (text.trim() && !isLoading) {  // Only analyze if there's text and not loading
      onAnalyze(text);
      setText('');          // Clear the form after submission
    }
  };

  return (
    <div className="sentiment-form">
      <h2>💭 Enter text to analyze:</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type something here... e.g., 'I love this!', 'This is terrible', 'It's okay I guess'"
          rows={4}
          disabled={isLoading}  // Disable while loading
          required
        />
        <br />
        <button type="submit" disabled={isLoading || !text.trim()}>
          {isLoading ? '🔄 Analyzing...' : 'Analyze Sentiment'}
        </button>
      </form>
      
      {isLoading && (
        <div className="loading-message">
          <p>🤖 AI is thinking... this might take a few seconds!</p>
        </div>
      )}
    </div>
  );
}

export default SentimentForm;