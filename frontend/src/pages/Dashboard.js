import { useState } from 'react';
import Analytics from '../components/Analytics';
import EditTaskModal from '../components/EditTaskModal';
import Layout from '../components/Layout';
import TaskBreakdownModal from '../components/TaskBreakdownModal';
import TaskCard from '../components/TaskCard';
import TaskFilters from '../components/TaskFilters';
import TaskInput from '../components/TaskInput';
import TaskStats from '../components/TaskStats';
import { TaskProvider, useTask } from '../context/TaskContext';
import { exportTasksToCSV } from '../utils/exportTasks';

const DashboardContent = () => {
  const { tasks, loading } = useTask();
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const handleExport = () => {
    exportTasksToCSV(tasks);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
            <p className="text-gray-600 mt-2">Manage your tasks with AI assistance</p>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setShowBreakdown(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              🤖 AI Breakdown
            </button>
            <button
              onClick={() => setShowAnalytics(!showAnalytics)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              {showAnalytics ? '📋 Tasks' : '📊 Analytics'}
            </button>
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              disabled={tasks.length === 0}
            >
              📥 Export CSV
            </button>
          </div>
        </div>

        <TaskStats />

        {showAnalytics ? (
          <Analytics />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <TaskInput />

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  📋 Your Tasks
                </h3>

                {loading ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="text-gray-600 mt-2">Loading tasks...</p>
                  </div>
                ) : tasks.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600">No tasks yet. Create your first task above! 🚀</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {tasks.map(task => (
                      <TaskCard 
                        key={task._id} 
                        task={task}
                        onEdit={setEditingTask}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <TaskFilters />
            </div>
          </div>
        )}
      </div>

      <TaskBreakdownModal 
        isOpen={showBreakdown} 
        onClose={() => setShowBreakdown(false)} 
      />

      <EditTaskModal
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        task={editingTask}
      />
    </Layout>
  );
};

const Dashboard = () => {
  return (
    <TaskProvider>
      <DashboardContent />
    </TaskProvider>
  );
};

export default Dashboard;