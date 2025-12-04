import React from 'react';

const SkillGapList = ({ title, items, type = 'skills' }) => {
  const getIcon = () => {
    switch (type) {
      case 'projects':
        return '🚀';
      case 'suggestions':
        return '💡';
      default:
        return '⚠️';
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <h3 className="text-xl font-semibold mb-4 flex items-center">
        <span className="mr-2">{getIcon()}</span>
        {title}
      </h3>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-start">
            <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
            <span className="text-gray-700">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SkillGapList;
