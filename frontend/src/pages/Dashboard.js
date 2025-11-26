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
  const { tasks, loading, stats } = useTask();
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const handleExport = () => {
    exportTasksToCSV(tasks);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="min-h-[60vh] flex items-center justify-center mb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 opacity-50"></div>
        
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <div className="inline-block mb-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
            ✨ AI-Powered Task Management
          </div>
          
          <h1 className="text-6xl md:text-7xl font-black text-gray-900 mb-6 leading-tight">
            Your Tasks,<br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Organized Magically
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Stop juggling sticky notes and scattered to-do lists. Let AI help you organize, prioritize, and actually get stuff done. No cap. 🚀
          </p>
          
          <div className="flex gap-4 justify-center items-center flex-wrap">
            <a href="#create-task" className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all transform hover:scale-105">
              Get Started Free
            </a>
            <button
              onClick={() => setShowBreakdown(true)}
              className="px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-bold text-lg hover:border-blue-400 transition-all transform hover:scale-105"
            >
              Try AI Breakdown
            </button>
          </div>

          {stats && (
            <div className="mt-12 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-4xl font-black text-blue-600">{stats.total}</div>
                <div className="text-sm text-gray-600 font-medium mt-1">Total Tasks</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-green-600">{stats.completed}</div>
                <div className="text-sm text-gray-600 font-medium mt-1">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-purple-600">
                  {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
                </div>
                <div className="text-sm text-gray-600 font-medium mt-1">Success Rate</div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Pain Point Section - Gen Z Style */}
      <section className="mb-16 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-3xl p-12 border border-orange-100">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-6xl mb-6">😵‍💫</div>
          <h2 className="text-4xl font-black text-gray-900 mb-6">
            Tired of Task Chaos?
          </h2>
          <p className="text-xl text-gray-700 mb-6 leading-relaxed">
            We get it. You've got a million things to do, deadlines coming at you from all sides, 
            and your brain feels like it's running 47 Chrome tabs at once. 
            Your to-do list? More like a to-don't list. 💀
          </p>
          <p className="text-lg text-gray-600">
            <strong className="text-gray-800">The struggle is real:</strong> You waste hours deciding what to do first. 
            Important stuff gets buried. And somehow, "reply to that email" has been on your list for 3 weeks.
          </p>
        </div>
      </section>

      {/* Stats Overview */}
      <section className="mb-16" id="stats">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-gray-900 mb-2">Your Productivity Dashboard</h2>
          <p className="text-gray-600">Real-time insights into your task management</p>
        </div>
        <TaskStats />
      </section>

      {/* Create Task Section */}
      <section className="mb-16" id="create-task">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-gray-900 mb-2">Create Your Next Task</h2>
          <p className="text-gray-600">Just type naturally - AI handles the rest ✨</p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <TaskInput />
        </div>
      </section>

      {/* Features Section */}
      <section className="mb-16 grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all group">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <span className="text-3xl">🤖</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">AI Classification</h3>
          <p className="text-gray-600">
            Automatically categorizes and prioritizes your tasks. No manual sorting needed.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all group">
          <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <span className="text-3xl">📋</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Smart Breakdown</h3>
          <p className="text-gray-600">
            Complex project? AI breaks it into bite-sized, actionable subtasks.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-green-300 hover:shadow-lg transition-all group">
          <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <span className="text-3xl">🎯</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Natural Language</h3>
          <p className="text-gray-600">
            Type "meeting tomorrow at 3pm" and watch the magic happen. Due dates extracted automatically.
          </p>
        </div>
      </section>

      {/* Tasks Section */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-black text-gray-900 mb-2">Your Tasks</h2>
            <p className="text-gray-600">Everything in one organized place</p>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setShowAnalytics(!showAnalytics)}
              className="px-6 py-3 bg-white border border-gray-200 rounded-xl font-medium hover:border-blue-400 hover:shadow-md transition-all"
            >
              {showAnalytics ? '📋 View Tasks' : '📊 View Analytics'}
            </button>
            <button
              onClick={handleExport}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all"
              disabled={tasks.length === 0}
            >
              Export CSV
            </button>
          </div>
        </div>

        {showAnalytics ? (
          <div className="transition-all duration-300">
            <Analytics />
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {loading ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
                  <p className="text-gray-600 font-medium">Loading your tasks...</p>
                </div>
              ) : tasks.length === 0 ? (
                <div className="bg-white rounded-2xl p-16 text-center border border-gray-200">
                  <div className="text-6xl mb-4">🎯</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">No tasks yet!</h3>
                  <p className="text-gray-600 mb-6">Ready to get organized? Create your first task above.</p>
                  <a 
                    href="#create-task"
                    className="inline-block px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition"
                  >
                    Create First Task
                  </a>
                </div>
              ) : (
                <div className="space-y-4">
                  {tasks.map(task => (
                    <TaskCard key={task._id} task={task} onEdit={setEditingTask} />
                  ))}
                </div>
              )}
            </div>

            <div>
              <TaskFilters />
            </div>
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="mb-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white text-center">
        <h2 className="text-4xl font-black mb-4">Ready to Get Organized?</h2>
        <p className="text-xl mb-8 opacity-90">
          Join thousands of productive people who've ditched task chaos
        </p>
        <a 
          href="#create-task"
          className="inline-block px-8 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg hover:shadow-2xl transition-all transform hover:scale-105"
        >
          Start Organizing Now
        </a>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 border-t border-gray-200">
        <p className="text-gray-600 text-lg mb-2">
          Made with <span className="text-red-500 animate-pulse">❤️</span> by{' '}
          <a 
            href="https://github.com/Akchhya1108" 
            target="_blank" 
            rel="noopener noreferrer"
            className="font-bold text-blue-600 hover:text-blue-700 transition"
          >
            Akchhya Singh
          </a>
        </p>
        <p className="text-gray-500 text-sm">
          TaskGenie © 2025 • Powered by AI • Built with passion
        </p>
      </footer>

      {/* Modals */}
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