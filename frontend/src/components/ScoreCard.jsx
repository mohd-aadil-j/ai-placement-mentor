import React from 'react';

const ScoreCard = ({ title, score, color = 'blue' }) => {
  const getColorClasses = () => {
    switch (color) {
      case 'green':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'yellow':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'red':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  const getScoreColor = () => {
    if (score >= 75) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className={`border-2 rounded-lg p-6 ${getColorClasses()}`}>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <div className="flex items-baseline">
        <span className={`text-4xl font-bold ${getScoreColor()}`}>{score}</span>
        <span className="text-xl ml-1">/100</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
        <div
          className={`h-2 rounded-full ${getScoreColor().replace('text', 'bg')}`}
          style={{ width: `${score}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ScoreCard;
