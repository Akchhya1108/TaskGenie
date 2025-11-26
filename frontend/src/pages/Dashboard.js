import Layout from '../components/Layout';
import TaskCard from '../components/TaskCard';
import TaskFilters from '../components/TaskFilters';
import TaskInput from '../components/TaskInput';
import TaskStats from '../components/TaskStats';
import { TaskProvider, useTask } from '../context/TaskContext';

const DashboardContent = () => {
  const { tasks, loading } = useTask();

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-600 mt-2">Manage your tasks with AI assistance</p>
        </div>

        <TaskStats />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <TaskInput />

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                📋 Your Tasks
              </h3>

              {loading ? (
                <div className="text-center py-8">
                  <div className="text-gray-600">Loading tasks...</div>
                </div>
              ) : tasks.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">No tasks yet. Create your first task above! 🚀</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {tasks.map(task => (
                    <TaskCard key={task._id} task={task} />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <TaskFilters />
          </div>
        </div>
      </div>
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