import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Tooltip } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { useTask } from '../context/TaskContext';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const Analytics = () => {
  const { stats } = useTask();

  if (!stats) return null;

  const categoryData = {
    labels: ['Work', 'Personal', 'Urgent', 'Other'],
    datasets: [
      {
        label: 'Tasks by Category',
        data: [
          stats.byCategory.work,
          stats.byCategory.personal,
          stats.byCategory.urgent,
          stats.byCategory.other
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(156, 163, 175, 0.8)'
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(34, 197, 94, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(156, 163, 175, 1)'
        ],
        borderWidth: 2
      }
    ]
  };

  const priorityData = {
    labels: ['High', 'Medium', 'Low'],
    datasets: [
      {
        label: 'Tasks by Priority',
        data: [
          stats.byPriority.high,
          stats.byPriority.medium,
          stats.byPriority.low
        ],
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',
          'rgba(234, 179, 8, 0.8)',
          'rgba(34, 197, 94, 0.8)'
        ],
        borderColor: [
          'rgba(239, 68, 68, 1)',
          'rgba(234, 179, 8, 1)',
          'rgba(34, 197, 94, 1)'
        ],
        borderWidth: 2
      }
    ]
  };

  const statusData = {
    labels: ['Completed', 'In Progress', 'Pending'],
    datasets: [
      {
        label: 'Number of Tasks',
        data: [stats.completed, stats.inProgress, stats.pending],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(234, 179, 8, 0.8)'
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(234, 179, 8, 1)'
        ],
        borderWidth: 2
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">📊 Analytics</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-center font-medium text-gray-700 mb-4">Task Status</h4>
          <Bar data={statusData} options={chartOptions} />
        </div>

        <div>
          <h4 className="text-center font-medium text-gray-700 mb-4">Categories</h4>
          <Pie data={categoryData} options={chartOptions} />
        </div>

        <div>
          <h4 className="text-center font-medium text-gray-700 mb-4">Priority Distribution</h4>
          <Pie data={priorityData} options={chartOptions} />
        </div>

        <div className="flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-6">
          <div className="text-center">
            <p className="text-gray-600 text-sm mb-2">Completion Rate</p>
            <p className="text-5xl font-bold text-blue-600">
              {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
            </p>
            <p className="text-gray-500 text-sm mt-2">
              {stats.completed} of {stats.total} tasks completed
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;