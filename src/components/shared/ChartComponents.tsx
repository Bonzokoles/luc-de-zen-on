import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, AreaChart, Area } from 'recharts';

// Muted color palette - subtle and professional
export const MUTED_COLORS = {
  primary: '#64748b',
  secondary: '#475569',
  accent: '#0ea5e9',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  border: '#334155',
  background: '#0f172a',
  surface: '#1e293b',
};

export const CHART_COLORS = [
  '#64748b', // slate
  '#475569', // slate-dark
  '#0ea5e9', // blue
  '#10b981', // green
  '#8b5cf6', // purple
  '#f59e0b', // amber
  '#ef4444', // red
  '#06b6d4', // cyan
];

// Custom Tooltip with muted styling
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-business-surface border border-business-border p-3 shadow-xl">
        <p className="text-sm font-semibold text-business-text mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-xs text-business-text-dim">
            <span style={{ color: entry.color }}>{entry.name}:</span> {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Animated Line Chart Component
interface AnimatedLineChartProps {
  data: any[];
  dataKeys: { key: string; name: string; color?: string }[];
  xKey: string;
  title?: string;
  height?: number;
}

export const AnimatedLineChart: React.FC<AnimatedLineChartProps> = ({
  data,
  dataKeys,
  xKey,
  title,
  height = 300
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-business-surface border border-business-border p-4"
    >
      {title && <h3 className="text-lg font-semibold mb-4 text-business-text">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={MUTED_COLORS.border} opacity={0.3} />
          <XAxis dataKey={xKey} stroke={MUTED_COLORS.primary} style={{ fontSize: '12px' }} />
          <YAxis stroke={MUTED_COLORS.primary} style={{ fontSize: '12px' }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: '12px' }} />
          {dataKeys.map((dk, index) => (
            <Line
              key={dk.key}
              type="monotone"
              dataKey={dk.key}
              name={dk.name}
              stroke={dk.color || CHART_COLORS[index]}
              strokeWidth={2}
              dot={{ fill: dk.color || CHART_COLORS[index], r: 4 }}
              activeDot={{ r: 6 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

// Animated Bar Chart Component
interface AnimatedBarChartProps {
  data: any[];
  dataKeys: { key: string; name: string; color?: string }[];
  xKey: string;
  title?: string;
  height?: number;
}

export const AnimatedBarChart: React.FC<AnimatedBarChartProps> = ({
  data,
  dataKeys,
  xKey,
  title,
  height = 300
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-business-surface border border-business-border p-4"
    >
      {title && <h3 className="text-lg font-semibold mb-4 text-business-text">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={MUTED_COLORS.border} opacity={0.3} />
          <XAxis dataKey={xKey} stroke={MUTED_COLORS.primary} style={{ fontSize: '12px' }} />
          <YAxis stroke={MUTED_COLORS.primary} style={{ fontSize: '12px' }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: '12px' }} />
          {dataKeys.map((dk, index) => (
            <Bar
              key={dk.key}
              dataKey={dk.key}
              name={dk.name}
              fill={dk.color || CHART_COLORS[index]}
              radius={[4, 4, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

// Animated Pie Chart Component
interface AnimatedPieChartProps {
  data: { name: string; value: number }[];
  title?: string;
  height?: number;
}

export const AnimatedPieChart: React.FC<AnimatedPieChartProps> = ({
  data,
  title,
  height = 300
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, rotate: -10 }}
      animate={{ opacity: 1, rotate: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-business-surface border border-business-border p-4"
    >
      {title && <h3 className="text-lg font-semibold mb-4 text-business-text">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }: any) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

// Animated Area Chart Component
interface AnimatedAreaChartProps {
  data: any[];
  dataKeys: { key: string; name: string; color?: string }[];
  xKey: string;
  title?: string;
  height?: number;
}

export const AnimatedAreaChart: React.FC<AnimatedAreaChartProps> = ({
  data,
  dataKeys,
  xKey,
  title,
  height = 300
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-business-surface border border-business-border p-4"
    >
      {title && <h3 className="text-lg font-semibold mb-4 text-business-text">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data}>
          <defs>
            {dataKeys.map((dk, index) => (
              <linearGradient key={dk.key} id={`color${dk.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={dk.color || CHART_COLORS[index]} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={dk.color || CHART_COLORS[index]} stopOpacity={0.1}/>
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={MUTED_COLORS.border} opacity={0.3} />
          <XAxis dataKey={xKey} stroke={MUTED_COLORS.primary} style={{ fontSize: '12px' }} />
          <YAxis stroke={MUTED_COLORS.primary} style={{ fontSize: '12px' }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: '12px' }} />
          {dataKeys.map((dk, index) => (
            <Area
              key={dk.key}
              type="monotone"
              dataKey={dk.key}
              name={dk.name}
              stroke={dk.color || CHART_COLORS[index]}
              strokeWidth={2}
              fillOpacity={1}
              fill={`url(#color${dk.key})`}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

// Animated Radar Chart Component
interface AnimatedRadarChartProps {
  data: any[];
  dataKeys: { key: string; name: string; color?: string }[];
  categoryKey: string;
  title?: string;
  height?: number;
}

export const AnimatedRadarChart: React.FC<AnimatedRadarChartProps> = ({
  data,
  dataKeys,
  categoryKey,
  title,
  height = 300
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-business-surface border border-business-border p-4"
    >
      {title && <h3 className="text-lg font-semibold mb-4 text-business-text">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <RadarChart data={data}>
          <PolarGrid stroke={MUTED_COLORS.border} />
          <PolarAngleAxis dataKey={categoryKey} stroke={MUTED_COLORS.primary} style={{ fontSize: '12px' }} />
          <PolarRadiusAxis stroke={MUTED_COLORS.primary} style={{ fontSize: '11px' }} />
          {dataKeys.map((dk, index) => (
            <Radar
              key={dk.key}
              name={dk.name}
              dataKey={dk.key}
              stroke={dk.color || CHART_COLORS[index]}
              fill={dk.color || CHART_COLORS[index]}
              fillOpacity={0.3}
            />
          ))}
          <Legend wrapperStyle={{ fontSize: '12px' }} />
          <Tooltip content={<CustomTooltip />} />
        </RadarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default {
  AnimatedLineChart,
  AnimatedBarChart,
  AnimatedPieChart,
  AnimatedAreaChart,
  AnimatedRadarChart
};
