import React, { useState } from 'react';
import './App.css';
import SentimentForm from './components/SentimentForm';
import SentimentChart from './components/SentimentChart';

function App() {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = async (text) => {
    setIsLoading(true);
  
  // Use environment variable for API URL, fallback to localhost
    const API_BASE_URL = (process.env.REACT_APP_API_URL || 'http://localhost:8000').replace(/\/$/, '');

  
    try {
      const response = await fetch(`${API_BASE_URL}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: text })
     });

      if (!response.ok) {
       throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();
    
      const sentimentResult = {
        ...result,
       timestamp: new Date()
     };
    
      setResults(prev => [sentimentResult, ...prev]);
    
    } catch (error) {
      console.error('Error:', error);
      alert('Sorry, something went wrong! Please try again or check if the API is running.');
    } finally {
     setIsLoading(false);
    }
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>Sentiment Analysis Dashboard</h1>
        <p>Analyze emotions with any texts</p>
      </header>

      <SentimentForm 
        onAnalyze={handleAnalyze}
        isLoading={isLoading}
      />

      {/* Add Charts Component */}
      <SentimentChart results={results} />

      <div className="results-section">
        <div className="results-header">
          <h2>Detailed Results</h2>
          {results.length > 0 && (
            <button onClick={clearResults} className="clear-button">
               Clear All Results
            </button>
          )}
        </div>
        
        {results.length === 0 ? (
          <div className="no-results">
            <p>No analyses yet. Try entering some text above to see detailed results!</p>
          </div>
        ) : (
          <div className="results-list">
            {results.map((result, index) => (
              <div key={index} className={`result-item ${result.sentiment}`}>
                <p><strong>📝 Text:</strong> "{result.text}"</p>
                <p><strong>😊 Sentiment:</strong> {result.sentiment.toUpperCase()}</p>
                <p><strong>🎯 Confidence:</strong> {(result.confidence * 100).toFixed(1)}%</p>
                <p><strong>⏰ Time:</strong> {result.timestamp.toLocaleTimeString()}</p>
                {result.scores && (
                  <p><strong>📊 All Scores:</strong> {JSON.stringify(result.scores)}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
