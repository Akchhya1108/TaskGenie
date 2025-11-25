import Layout from '../components/Layout';

const Dashboard = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-600 mt-2">Manage your tasks with AI assistance</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4">Welcome to TaskGenie!</h3>
          <p className="text-gray-600">
            We'll add task management features in the next steps.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;