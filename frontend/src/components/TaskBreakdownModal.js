import { useState } from 'react';
import { useTask } from '../context/TaskContext';

const TaskBreakdownModal = ({ isOpen, onClose }) => {
  const [text, setText] = useState('');
  const [breakdown, setBreakdown] = useState(null);
  const [loading, setLoading] = useState(false);
  const { getTaskBreakdown } = useTask();

  const handleBreakdown = async () => {
    if (!text.trim()) return;

    setLoading(true);
    try {
      const result = await getTaskBreakdown(text);
      setBreakdown(result);
    } catch (error) {
      console.error('Error getting breakdown:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setText('');
    setBreakdown(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold text-gray-900">
              🤖 AI Task Breakdown
            </h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <p className="text-gray-600 mb-4">
            Describe a complex task and let AI break it down into manageable subtasks.
          </p>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Task Description
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              placeholder="e.g., Launch a marketing campaign for new product"
            />
          </div>

          <div className="flex gap-2 mb-4">
            <button
              onClick={handleBreakdown}
              disabled={loading || !text.trim()}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition"
            >
              {loading ? '🤖 Analyzing...' : '✨ Break Down Task'}
            </button>
            {breakdown && (
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Reset
              </button>
            )}
          </div>

          {breakdown && (
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">📋 Suggested Subtasks:</h4>
                <ul className="space-y-2">
                  {breakdown.subtasks.map((subtask, index) => (
                    <li key={index} className="text-blue-800 flex items-start">
                      <span className="mr-2">{index + 1}.</span>
                      <span>{subtask}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {breakdown.suggestions && breakdown.suggestions.length > 0 && (
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 mb-2">💡 Recommendations:</h4>
                  <ul className="space-y-1">
                    {breakdown.suggestions.map((suggestion, index) => (
                      <li key={index} className="text-green-800 text-sm">
                        • {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {breakdown.category && (
                <div className="bg-purple-50 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-900 mb-2">🏷️ Suggested Category:</h4>
                  <span className="inline-block px-3 py-1 bg-purple-200 text-purple-800 rounded-full text-sm font-medium">
                    {breakdown.category}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskBreakdownModal;