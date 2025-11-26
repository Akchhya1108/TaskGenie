import { useState } from 'react';
import { useTask } from '../context/TaskContext';

const TaskCard = ({ task }) => {
  const [showDetails, setShowDetails] = useState(false);
  const { toggleComplete, deleteTask } = useTask();

  const categoryColors = {
    work: 'bg-blue-100 text-blue-800',
    personal: 'bg-green-100 text-green-800',
    urgent: 'bg-red-100 text-red-800',
    other: 'bg-gray-100 text-gray-800'
  };

  const priorityColors = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-green-100 text-green-800'
  };

  const statusColors = {
    pending: 'bg-gray-100 text-gray-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800'
  };

  const handleToggleComplete = async () => {
    try {
      await toggleComplete(task._id);
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(task._id);
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const formatDate = (date) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-5 border-l-4 ${
      task.completed ? 'border-green-500 opacity-75' : 'border-blue-500'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={handleToggleComplete}
              className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
            />
            <h4 className={`text-lg font-semibold ${
              task.completed ? 'line-through text-gray-500' : 'text-gray-900'
            }`}>
              {task.title}
            </h4>
          </div>

          {task.description && (
            <p className="text-gray-600 text-sm mb-3 ml-7">
              {task.description}
            </p>
          )}

          <div className="flex flex-wrap gap-2 ml-7">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColors[task.category]}`}>
              {task.category}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>
              {task.priority}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[task.status]}`}>
              {task.status}
            </span>
            {task.dueDate && (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                📅 {formatDate(task.dueDate)}
              </span>
            )}
          </div>

          {task.tags && task.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 ml-7 mt-2">
              {task.tags.map((tag, index) => (
                <span key={index} className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {task.aiSuggestions && task.aiSuggestions.length > 0 && (
            <div className="mt-3 ml-7">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                {showDetails ? '▼' : '▶'} AI Suggestions ({task.aiSuggestions.length})
              </button>
              
              {showDetails && (
                <div className="mt-2 bg-blue-50 rounded-lg p-3">
                  <p className="text-xs font-medium text-blue-900 mb-2">💡 AI Recommendations:</p>
                  <ul className="space-y-1">
                    {task.aiSuggestions.map((suggestion, index) => (
                      <li key={index} className="text-sm text-blue-800">
                        • {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        <button
          onClick={handleDelete}
          className="text-red-500 hover:text-red-700 ml-4"
          title="Delete task"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default TaskCard;