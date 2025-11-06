import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo } from 'react';
import type { ReactNode } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface Column {
  key: string;
  label: string;
  align?: 'left' | 'center' | 'right';
  width?: string;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  title?: string;
  hoverable?: boolean;
  striped?: boolean;
}

export const DataTable: React.FC<DataTableProps> = ({
  columns,
  data,
  title,
  hoverable = true,
  striped = true
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-business-surface border border-business-border rounded-lg overflow-hidden"
    >
      {title && (
        <div className="px-6 py-4 border-b border-business-border">
          <h3 className="text-lg font-semibold text-business-text">{title}</h3>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-business-dark border-b border-business-border">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-6 py-3 text-xs font-semibold text-business-text-dim uppercase tracking-wider text-${col.align || 'left'}`}
                  style={{ width: col.width }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <motion.tr
                key={rowIndex}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: rowIndex * 0.05, duration: 0.3 }}
                className={`
                  border-b border-business-border/50 last:border-b-0
                  ${striped && rowIndex % 2 === 1 ? 'bg-business-dark/30' : ''}
                  ${hoverable ? 'hover:bg-business-dark/50 transition-colors' : ''}
                `}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`px-6 py-4 text-sm text-business-text text-${col.align || 'left'}`}
                  >
                    {row[col.key]}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

// Comparison Table Component
interface ComparisonTableProps {
  title?: string;
  categories: string[];
  items: {
    name: string;
    values: (string | number | ReactNode)[];
    highlight?: boolean;
  }[];
}

export const ComparisonTable: React.FC<ComparisonTableProps> = ({
  title,
  categories,
  items
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="bg-business-surface border border-business-border rounded-lg overflow-hidden"
    >
      {title && (
        <div className="px-6 py-4 border-b border-business-border bg-business-dark">
          <h3 className="text-lg font-semibold text-business-text">{title}</h3>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-business-border">
              <th className="px-6 py-3 text-left text-xs font-semibold text-business-text-dim uppercase tracking-wider bg-business-dark">
                Kryteria
              </th>
              {items.map((item, idx) => (
                <th
                  key={idx}
                  className={`px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider ${
                    item.highlight
                      ? 'bg-primary-900/30 text-primary-300 border-l-2 border-r-2 border-primary-600'
                      : 'bg-business-dark text-business-text-dim'
                  }`}
                >
                  {item.name}
                  {item.highlight && (
                    <div className="inline-block ml-2">
                      <motion.span
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-primary-400"
                      >
                        ⭐
                      </motion.span>
                    </div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {categories.map((category, catIdx) => (
              <motion.tr
                key={catIdx}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: catIdx * 0.1, duration: 0.3 }}
                className="border-b border-business-border/50 last:border-b-0 hover:bg-business-dark/30 transition-colors"
              >
                <td className="px-6 py-4 text-sm font-medium text-business-text">
                  {category}
                </td>
                {items.map((item, itemIdx) => (
                  <td
                    key={itemIdx}
                    className={`px-6 py-4 text-sm text-center ${
                      item.highlight ? 'border-l-2 border-r-2 border-primary-600/30 bg-primary-900/10' : ''
                    }`}
                  >
                    <span className="text-business-text-dim">{item.values[catIdx]}</span>
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

// Stats Grid Component
interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  trend,
  color = '#64748b'
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="bg-business-surface border border-business-border rounded-lg p-6 hover:border-business-accent transition-colors"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-business-text-dim mb-2">{label}</p>
          <p className="text-3xl font-bold text-business-text">{value}</p>
          {trend && (
            <div className={`flex items-center mt-2 text-sm ${trend.isPositive ? 'text-green-400' : 'text-red-400'}`}>
              <span>{trend.isPositive ? '↑' : '↓'}</span>
              <span className="ml-1">{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>
        {icon && (
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
            style={{ backgroundColor: `${color}22`, color }}
          >
            {icon}
          </div>
        )}
      </div>
    </motion.div>
  );
};

interface StatsGridProps {
  stats: StatCardProps[];
  columns?: number;
}

export const StatsGrid: React.FC<StatsGridProps> = ({ stats, columns = 4 }) => {
  const gridClass = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  }[columns] || 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';

  return (
    <div className={`grid ${gridClass} gap-6`}>
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

// Enhanced Data Table with Sorting
interface EnhancedColumn extends Column {
  sortable?: boolean;
  render?: (value: any, row: any) => ReactNode;
}

interface EnhancedTableProps {
  columns: EnhancedColumn[];
  data: any[];
  title?: string;
  hoverable?: boolean;
  striped?: boolean;
  searchable?: boolean;
  onRowClick?: (row: any) => void;
}

export const EnhancedTable: React.FC<EnhancedTableProps> = ({
  columns,
  data,
  title,
  hoverable = true,
  striped = true,
  searchable = false,
  onRowClick
}) => {
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = useMemo(() => {
    let sorted = [...data];
    if (sortConfig) {
      sorted.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sorted;
  }, [data, sortConfig]);

  const filteredData = useMemo(() => {
    if (!searchTerm) return sortedData;
    return sortedData.filter((row) =>
      columns.some((col) =>
        String(row[col.key]).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [sortedData, searchTerm, columns]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-business-surface border border-business-border rounded-lg overflow-hidden"
    >
      {(title || searchable) && (
        <div className="px-6 py-4 border-b border-business-border">
          <div className="flex items-center justify-between">
            {title && <h3 className="text-lg font-semibold text-business-text">{title}</h3>}
            {searchable && (
              <input
                type="text"
                placeholder="Szukaj..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-1 bg-business-dark border border-business-border rounded text-sm text-business-text focus:outline-none focus:border-primary-500"
              />
            )}
          </div>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-business-dark border-b border-business-border">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-6 py-3 text-xs font-semibold text-business-text-dim uppercase tracking-wider text-${col.align || 'left'} ${
                    col.sortable ? 'cursor-pointer select-none hover:text-business-accent transition-colors' : ''
                  }`}
                  style={{ width: col.width }}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div className="flex items-center gap-2">
                    {col.label}
                    {col.sortable && sortConfig?.key === col.key && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                      >
                        {sortConfig.direction === 'asc' ? (
                          <ArrowUp className="w-3 h-3" />
                        ) : (
                          <ArrowDown className="w-3 h-3" />
                        )}
                      </motion.span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {filteredData.map((row, rowIndex) => (
                <motion.tr
                  key={rowIndex}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: rowIndex * 0.05, duration: 0.3 }}
                  className={`
                    border-b border-business-border/50 last:border-b-0
                    ${striped && rowIndex % 2 === 1 ? 'bg-business-dark/30' : ''}
                    ${hoverable ? 'hover:bg-business-dark/50 transition-colors' : ''}
                    ${onRowClick ? 'cursor-pointer' : ''}
                  `}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`px-6 py-4 text-sm text-business-text text-${col.align || 'left'}`}
                    >
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
      {filteredData.length === 0 && (
        <div className="text-center py-12 text-business-text-dim">
          Brak danych do wyświetlenia
        </div>
      )}
    </motion.div>
  );
};

export default { DataTable, ComparisonTable, StatCard, StatsGrid, EnhancedTable };
