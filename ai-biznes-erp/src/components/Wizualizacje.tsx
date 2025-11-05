import { useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { motion } from 'framer-motion';

// ========== DEMO DATA ==========

const salesData = [
  { month: 'Sty', sales: 45000, costs: 32000, profit: 13000 },
  { month: 'Lut', sales: 52000, costs: 35000, profit: 17000 },
  { month: 'Mar', sales: 48000, costs: 33000, profit: 15000 },
  { month: 'Kwi', sales: 61000, costs: 38000, profit: 23000 },
  { month: 'Maj', sales: 58000, costs: 36000, profit: 22000 },
  { month: 'Cze', sales: 72000, costs: 42000, profit: 30000 }
];

const categoryData = [
  { name: 'E-commerce', value: 120000, color: '#3b82f6' },
  { name: 'Aplikacje', value: 85000, color: '#10b981' },
  { name: 'Konsultacje', value: 65000, color: '#f59e0b' },
  { name: 'Utrzymanie', value: 45000, color: '#8b5cf6' },
  { name: 'Inne', value: 30000, color: '#ec4899' }
];

const performanceData = [
  { subject: 'Sprzedaż', A: 95, fullMark: 100 },
  { subject: 'Marketing', A: 78, fullMark: 100 },
  { subject: 'Zadowolenie', A: 88, fullMark: 100 },
  { subject: 'Zysk', A: 82, fullMark: 100 },
  { subject: 'Wzrost', A: 75, fullMark: 100 }
];

const dailyData = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  value: Math.floor(Math.random() * 5000) + 3000
}));

// ========== COMPONENT ==========

export default function Wizualizacje() {
  const [activeChart, setActiveChart] = useState<'line' | 'bar' | 'pie' | 'area' | 'radar'>('line');
  const [isAnimated, setIsAnimated] = useState(true);

  const charts = [
    { id: 'line', label: '📈 Line Chart', description: 'Trendy w czasie' },
    { id: 'bar', label: '📊 Bar Chart', description: 'Porównania' },
    { id: 'pie', label: '🥧 Pie Chart', description: 'Proporcje' },
    { id: 'area', label: '🌊 Area Chart', description: 'Przepływ danych' },
    { id: 'radar', label: '🎯 Radar Chart', description: 'Wydajność' }
  ];

  // ========== RENDER ==========

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-pink-950 to-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            📊 Wizualizacje & Dashboardy
          </h1>
          <p className="text-slate-400">Interaktywne wykresy i animowane wizualizacje danych</p>
        </motion.div>

        {/* Animation Toggle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <button
            onClick={() => setIsAnimated(!isAnimated)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              isAnimated
                ? 'bg-pink-600 text-white'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            {isAnimated ? '✓ Animacje włączone' : '○ Animacje wyłączone'}
          </button>
        </motion.div>

        {/* Chart Selector */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8"
        >
          {charts.map((chart, idx) => (
            <motion.button
              key={chart.id}
              onClick={() => setActiveChart(chart.id as any)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx }}
              className={`p-6 rounded-xl font-medium transition-all text-left ${
                activeChart === chart.id
                  ? 'bg-gradient-to-br from-pink-600 to-purple-600 border-2 border-pink-400 shadow-lg shadow-pink-500/30'
                  : 'bg-slate-800/50 border-2 border-slate-700 hover:border-pink-500/50'
              }`}
            >
              <div className="text-2xl mb-2">{chart.label.split(' ')[0]}</div>
              <div className="text-sm font-bold">{chart.label.substring(3)}</div>
              <div className="text-xs text-slate-400 mt-1">{chart.description}</div>
            </motion.button>
          ))}
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          {[
            { label: 'Przychody', value: '345 000 zł', color: 'from-emerald-600 to-green-600', icon: '💰' },
            { label: 'Projekty', value: '24', color: 'from-blue-600 to-cyan-600', icon: '💼' },
            { label: 'Klienci', value: '18', color: 'from-purple-600 to-pink-600', icon: '👥' },
            { label: 'ROI', value: '+45%', color: 'from-orange-600 to-yellow-600', icon: '📈' }
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + idx * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className={`bg-gradient-to-br ${stat.color} rounded-xl p-6 shadow-lg`}
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm opacity-90">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Chart */}
        <motion.div
          key={activeChart}
          initial={isAnimated ? { opacity: 0, y: 20 } : {}}
          animate={isAnimated ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-8 mb-8"
        >
          <h2 className="text-2xl font-bold mb-6">
            {charts.find(c => c.id === activeChart)?.label}
          </h2>

          {/* Line Chart */}
          {activeChart === 'line' && (
            <div>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                    labelStyle={{ color: '#f1f5f9' }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    name="Sprzedaż"
                    animationDuration={isAnimated ? 1000 : 0}
                  />
                  <Line
                    type="monotone"
                    dataKey="costs"
                    stroke="#ef4444"
                    strokeWidth={3}
                    name="Koszty"
                    animationDuration={isAnimated ? 1000 : 0}
                  />
                  <Line
                    type="monotone"
                    dataKey="profit"
                    stroke="#10b981"
                    strokeWidth={3}
                    name="Zysk"
                    animationDuration={isAnimated ? 1000 : 0}
                  />
                </LineChart>
              </ResponsiveContainer>
              <p className="text-sm text-slate-400 mt-4">
                📈 Wykres liniowy pokazuje trendy sprzedaży, kosztów i zysków w ostatnich 6 miesiącach
              </p>
            </div>
          )}

          {/* Bar Chart */}
          {activeChart === 'bar' && (
            <div>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                    labelStyle={{ color: '#f1f5f9' }}
                  />
                  <Legend />
                  <Bar
                    dataKey="sales"
                    fill="#3b82f6"
                    name="Sprzedaż"
                    animationDuration={isAnimated ? 1000 : 0}
                  />
                  <Bar
                    dataKey="costs"
                    fill="#ef4444"
                    name="Koszty"
                    animationDuration={isAnimated ? 1000 : 0}
                  />
                  <Bar
                    dataKey="profit"
                    fill="#10b981"
                    name="Zysk"
                    animationDuration={isAnimated ? 1000 : 0}
                  />
                </BarChart>
              </ResponsiveContainer>
              <p className="text-sm text-slate-400 mt-4">
                📊 Wykres słupkowy umożliwia łatwe porównanie wartości między miesiącami
              </p>
            </div>
          )}

          {/* Pie Chart */}
          {activeChart === 'pie' && (
            <div>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    label={(entry) => `${entry.name}: ${(entry.value / 1000).toFixed(0)}k`}
                    animationDuration={isAnimated ? 1000 : 0}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                    formatter={(value: number) => `${value.toLocaleString('pl-PL')} zł`}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
              <p className="text-sm text-slate-400 mt-4">
                🥧 Wykres kołowy pokazuje proporcje przychodów z różnych kategorii usług
              </p>
            </div>
          )}

          {/* Area Chart */}
          {activeChart === 'area' && (
            <div>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={dailyData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="day" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                    labelStyle={{ color: '#f1f5f9' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#8b5cf6"
                    fillOpacity={1}
                    fill="url(#colorValue)"
                    name="Dzienna wartość"
                    animationDuration={isAnimated ? 1000 : 0}
                  />
                </AreaChart>
              </ResponsiveContainer>
              <p className="text-sm text-slate-400 mt-4">
                🌊 Wykres obszarowy (Area Chart) świetnie pokazuje przepływ danych w czasie - ostatnie 30 dni
              </p>
            </div>
          )}

          {/* Radar Chart */}
          {activeChart === 'radar' && (
            <div>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={performanceData}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="subject" stroke="#94a3b8" />
                  <PolarRadiusAxis stroke="#94a3b8" />
                  <Radar
                    name="Wydajność"
                    dataKey="A"
                    stroke="#ec4899"
                    fill="#ec4899"
                    fillOpacity={0.6}
                    animationDuration={isAnimated ? 1000 : 0}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
              <p className="text-sm text-slate-400 mt-4">
                🎯 Wykres radarowy (Radar Chart) idealny do pokazania wydajności w różnych kategoriach
              </p>
            </div>
          )}

        </motion.div>

        {/* Animated Cards Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            { title: 'Eksport wykresów', desc: 'Zapisz wykresy jako PNG/SVG', icon: '💾', color: 'blue' },
            { title: 'Interaktywność', desc: 'Klikaj elementy aby zobaczyć szczegóły', icon: '🖱️', color: 'purple' },
            { title: 'Customizacja', desc: 'Dostosuj kolory i style do potrzeb', icon: '🎨', color: 'pink' }
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + idx * 0.1 }}
              whileHover={isAnimated ? { scale: 1.05, rotateY: 5 } : {}}
              className={`bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6`}
            >
              <div className="text-4xl mb-3">{feature.icon}</div>
              <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
              <p className="text-sm text-slate-400">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-8 bg-gradient-to-r from-pink-900/20 to-purple-900/20 border border-pink-500/30 rounded-xl p-6"
        >
          <h3 className="text-xl font-bold mb-3 text-pink-400">💡 Możliwości wizualizacji</h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-300">
            <li>✓ Recharts - biblioteka wykresów React</li>
            <li>✓ Framer Motion - płynne animacje</li>
            <li>✓ Interaktywne tooltips</li>
            <li>✓ Responsywny design</li>
            <li>✓ Eksport do obrazów</li>
            <li>✓ Customowe kolory i style</li>
            <li>✓ Animowane transitions</li>
            <li>✓ Real-time data updates</li>
          </ul>
        </motion.div>

      </div>
    </div>
  );
}
