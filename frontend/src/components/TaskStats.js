import { useTask } from '../context/TaskContext';

const TaskStats = () => {
  const { stats } = useTask();

  if (!stats) return null;

  const statCards = [
    {
      title: 'Total Tasks',
      value: stats.total,
      icon: '📊',
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50'
    },
    {
      title: 'Completed',
      value: stats.completed,
      icon: '✅',
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-50 to-emerald-50'
    },
    {
      title: 'In Progress',
      value: stats.inProgress,
      icon: '⚡',
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50'
    },
    {
      title: 'Pending',
      value: stats.pending,
      icon: '⏳',
      gradient: 'from-orange-500 to-yellow-500',
      bgGradient: 'from-orange-50 to-yellow-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((card, index) => (
        <div
          key={card.title}
          className="group relative animate-slideIn"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          {/* Glow effect */}
          <div className={`absolute -inset-1 bg-gradient-to-r ${card.gradient} rounded-2xl blur opacity-25 group-hover:opacity-50 transition`}></div>
          
          <div className={`relative bg-gradient-to-br ${card.bgGradient} rounded-2xl p-6 border border-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1`}>
            <div className="flex items-start justify-between mb-4">
              <div className={`w-14 h-14 bg-gradient-to-br ${card.gradient} rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition`}>
                <span className="text-3xl">{card.icon}</span>
              </div>
              <div className={`px-3 py-1 bg-white/80 rounded-full text-xs font-bold text-gray-600`}>
                Active
              </div>
            </div>
            
            <div>
              <p className="text-gray-600 text-sm font-bold mb-1">{card.title}</p>
              <p className="text-4xl font-black text-gray-900">{card.value}</p>
            </div>

            {/* Progress bar */}
            <div className="mt-4 h-2 bg-white/50 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r ${card.gradient} rounded-full transition-all duration-1000`}
                style={{ width: stats.total > 0 ? `${(card.value / stats.total) * 100}%` : '0%' }}
              ></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskStats;