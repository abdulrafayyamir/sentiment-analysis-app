import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';

function SentimentChart({ results }) {
  // Calculate sentiment distribution
  const sentimentCounts = results.reduce((acc, result) => {
    acc[result.sentiment] = (acc[result.sentiment] || 0) + 1;
    return acc;
  }, {});

  // Prepare data for charts
  const chartData = Object.entries(sentimentCounts).map(([sentiment, count]) => ({
    sentiment: sentiment.charAt(0).toUpperCase() + sentiment.slice(1),
    count,
    percentage: ((count / results.length) * 100).toFixed(1)
  }));

  // Colors for different sentiments
  const COLORS = {
    Positive: '#10B981',
    Negative: '#EF4444', 
    Neutral: '#6B7280'
  };

  // Calculate average confidence for each sentiment
  const confidenceData = Object.keys(sentimentCounts).map(sentiment => {
    const sentimentResults = results.filter(r => r.sentiment === sentiment);
    const avgConfidence = sentimentResults.reduce((sum, r) => sum + r.confidence, 0) / sentimentResults.length;
    
    return {
      sentiment: sentiment.charAt(0).toUpperCase() + sentiment.slice(1),
      confidence: (avgConfidence * 100).toFixed(1)
    };
  });

  // Timeline data (last 10 results)
  const timelineData = results.slice(0, 10).reverse().map((result, index) => ({
    index: index + 1,
    confidence: (result.confidence * 100).toFixed(1),
    sentiment: result.sentiment,
    text: result.text.substring(0, 20) + '...'
  }));

  if (results.length === 0) {
    return (
      <div className="charts-container">
        <div className="chart-placeholder">
          <h3>📊 Analytics Dashboard</h3>
          <p>Start analyzing text to see beautiful charts and insights!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="charts-container">
      <h3>📊 Sentiment Analytics Dashboard</h3>
      
      {/* Summary Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <h4>Total Analyzed</h4>
          <div className="stat-number">{results.length}</div>
        </div>
        <div className="stat-card">
          <h4>Most Common</h4>
          <div className="stat-number">
            {chartData.reduce((max, item) => item.count > max.count ? item : max, chartData[0])?.sentiment || 'N/A'}
          </div>
        </div>
        <div className="stat-card">
          <h4>Average Confidence</h4>
          <div className="stat-number">
            {(results.reduce((sum, r) => sum + r.confidence, 0) / results.length * 100).toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        
        {/* Bar Chart - Sentiment Distribution */}
        <div className="chart-card">
          <h4>Sentiment Distribution</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="sentiment" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [value, 'Count']}
                labelFormatter={(label) => `Sentiment: ${label}`}
              />
              <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart - Sentiment Breakdown */}
        <div className="chart-card">
          <h4>Sentiment Breakdown</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="count"
                label={({ sentiment, percentage }) => `${sentiment}: ${percentage}%`}
                labelLine={false}
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[entry.sentiment] || '#8B5CF6'} 
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [value, 'Count']} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Confidence Levels */}
        <div className="chart-card">
          <h4>Average Confidence by Sentiment</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={confidenceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="sentiment" />
              <YAxis domain={[0, 100]} />
              <Tooltip formatter={(value) => [`${value}%`, 'Confidence']} />
              <Bar dataKey="confidence" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Timeline Chart */}
        <div className="chart-card">
          <h4>Recent Analysis Timeline</h4>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={timelineData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="index" />
              <YAxis domain={[0, 100]} />
              <Tooltip 
                formatter={(value) => [`${value}%`, 'Confidence']}
                labelFormatter={(index) => {
                  const item = timelineData[index - 1];
                  return item ? `Analysis ${index}: "${item.text}"` : `Analysis ${index}`;
                }}
              />
              <Line 
                type="monotone" 
                dataKey="confidence" 
                stroke="#8B5CF6" 
                strokeWidth={3}
                dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default SentimentChart;