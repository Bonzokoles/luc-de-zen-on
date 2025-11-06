import { motion } from 'framer-motion';
import { TrendingUp, Users, DollarSign, Target, Zap, BarChart3 } from 'lucide-react';
import { StatCardEnhanced, GradientCard, ProgressBar, AnimatedBadge } from './shared/EnhancedVisuals';
import { AnimatedPieChart } from './shared/ChartComponents';

const DashboardVisual = () => {
  // Demo data
  const stats = [
    {
      icon: <DollarSign className="w-6 h-6" />,
      label: 'Miesięczny Przychód',
      value: '125,000 PLN',
      trend: { value: 12.5, isPositive: true },
      color: '#10b981'
    },
    {
      icon: <Users className="w-6 h-6" />,
      label: 'Aktywni Użytkownicy',
      value: '2,847',
      trend: { value: 8.3, isPositive: true },
      color: '#0ea5e9'
    },
    {
      icon: <Target className="w-6 h-6" />,
      label: 'Konwersja',
      value: '3.8%',
      trend: { value: 2.1, isPositive: true },
      color: '#8b5cf6'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      label: 'Zrealizowane Projekty',
      value: '156',
      trend: { value: 15.2, isPositive: true },
      color: '#f59e0b'
    }
  ];

  const pieData = [
    { name: 'Faktury', value: 35 },
    { name: 'Treści', value: 28 },
    { name: 'Email', value: 22 },
    { name: 'CRM', value: 15 }
  ];

  const taskProgress = [
    { name: 'Marketing', completed: 85, total: 100, color: 'bg-blue-500' },
    { name: 'Sprzedaż', completed: 72, total: 100, color: 'bg-green-500' },
    { name: 'Produkcja', completed: 63, total: 100, color: 'bg-purple-500' },
    { name: 'Wsparcie', completed: 91, total: 100, color: 'bg-orange-500' }
  ];

  const recentActivity = [
    { action: 'Nowa faktura utworzona', time: '5 min temu', icon: '📄', color: 'text-green-400' },
    { action: 'Wygenerowano treść AI', time: '12 min temu', icon: '✨', color: 'text-blue-400' },
    { action: 'Dodano klienta do CRM', time: '1 godz. temu', icon: '👤', color: 'text-purple-400' },
    { action: 'Wysłano email', time: '2 godz. temu', icon: '📧', color: 'text-orange-400' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">
          Twój Dashboard
        </h2>
        <p className="text-business-text-dim">
          Przegląd najważniejszych statystyk i aktywności
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <StatCardEnhanced {...stat} animated />
          </motion.div>
        ))}
      </div>

      {/* Charts and Progress Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Used Tools */}
        <GradientCard gradient="from-blue-500/10 to-purple-500/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-business-text">
              Najpopularniejsze Narzędzia
            </h3>
            <AnimatedBadge text="Top 4" color="primary" pulse />
          </div>
          <AnimatedPieChart data={pieData} height={250} />
        </GradientCard>

        {/* Task Progress */}
        <GradientCard gradient="from-green-500/10 to-cyan-500/10">
          <h3 className="text-lg font-bold text-business-text mb-4">
            Postęp Zadań
          </h3>
          <div className="space-y-4">
            {taskProgress.map((task, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-business-text">
                    {task.name}
                  </span>
                  <span className="text-xs text-business-text-dim">
                    {task.completed}%
                  </span>
                </div>
                <ProgressBar
                  value={task.completed}
                  max={task.total}
                  color={task.color}
                  height="h-2"
                  showLabel={false}
                  animated
                />
              </motion.div>
            ))}
          </div>
        </GradientCard>
      </div>

      {/* Recent Activity */}
      <GradientCard gradient="from-orange-500/10 to-pink-500/10">
        <h3 className="text-lg font-bold text-business-text mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Ostatnia Aktywność
        </h3>
        <div className="space-y-3">
          {recentActivity.map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              className="flex items-center gap-4 p-3 bg-business-dark/50 rounded-lg hover:bg-business-dark transition-colors"
            >
              <div className="text-2xl">{activity.icon}</div>
              <div className="flex-1">
                <p className="text-sm font-medium text-business-text">
                  {activity.action}
                </p>
                <p className="text-xs text-business-text-dim">
                  {activity.time}
                </p>
              </div>
              <div className={`text-xl ${activity.color}`}>→</div>
            </motion.div>
          ))}
        </div>
      </GradientCard>

      {/* Quick Actions */}
      <GradientCard gradient="from-purple-500/10 to-indigo-500/10">
        <h3 className="text-lg font-bold text-business-text mb-4">
          Szybkie Akcje
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: '📄', label: 'Nowa Faktura', href: '/narzedzia/generator-faktur' },
            { icon: '✍️', label: 'Generuj Treść', href: '/narzedzia/generator-tresci' },
            { icon: '📧', label: 'Napisz Email', href: '/narzedzia/asystent-email' },
            { icon: '📊', label: 'Zobacz Raporty', href: '/analityka-raporty' }
          ].map((action, index) => (
            <motion.a
              key={index}
              href={action.href}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ delay: 1 + index * 0.1 }}
              className="flex flex-col items-center justify-center p-6 bg-business-dark/50 rounded-xl hover:bg-business-dark transition-colors border border-business-border hover:border-primary-500 group"
            >
              <span className="text-4xl mb-2 group-hover:scale-110 transition-transform">
                {action.icon}
              </span>
              <span className="text-sm text-center text-business-text group-hover:text-primary-400 transition-colors">
                {action.label}
              </span>
            </motion.a>
          ))}
        </div>
      </GradientCard>
    </div>
  );
};

export default DashboardVisual;
