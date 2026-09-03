import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import type { ProdiStatistik } from '@/types';

interface StatistikChartProps {
  data: ProdiStatistik[];
  height?: number;
}

const PRODI_COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#06b6d4'];

export const StatistikChart: React.FC<StatistikChartProps> = ({ data, height = 240 }) => {
  const chartData = data.map((item, idx) => ({
    name: `${item.prodi}`,
    prodiCode: item.prodi,
    rawName: item.nama_prodi,
    total: item.total,
    persentase: item.persentase,
    color: PRODI_COLORS[idx % PRODI_COLORS.length],
  }));

  const totalAll = chartData.reduce((sum, d) => sum + d.total, 0);

  if (chartData.length === 0 || totalAll === 0) {
    return (
      <div className="h-56 flex items-center justify-center text-xs text-muted-foreground">
        Belum ada data pengajuan per prodi.
      </div>
    );
  }

  // Custom label renderer on slices: renders exact number & percentage
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, value }: any) => {
    if (!value || value === 0) return null;
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#ffffff"
        textAnchor="middle"
        dominantBaseline="central"
        className="text-[11px] font-bold pointer-events-none drop-shadow-md"
      >
        {`${value}`}
      </text>
    );
  };

  return (
    <div className="space-y-3">
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={78}
              paddingAngle={4}
              dataKey="total"
              label={renderCustomLabel}
              labelLine={false}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--popover, #1e293b)',
                color: 'var(--popover-foreground, #f8fafc)',
                borderRadius: '10px',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                fontSize: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              }}
              formatter={(value: any, name: any, props: any) => [
                `${value} Pengajuan (${props.payload.persentase}%)`,
                props.payload.rawName,
              ]}
            />
            <Legend
              wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }}
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              formatter={(value, entry: any) => (
                <span className="text-slate-700 dark:text-slate-300 font-medium">
                  {value} ({entry.payload.persentase}%)
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Direct Numbers Display Grid (Tanpa Perlu Diklik / Hover) */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
        {chartData.map((d) => (
          <div
            key={d.prodiCode}
            className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 flex flex-col items-center justify-center transition-colors"
          >
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
              <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                {d.prodiCode}
              </span>
            </div>
            <span className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-tight">
              {d.total} Mhs
            </span>
            <span className="text-[10px] text-muted-foreground font-medium">
              {d.persentase}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatistikChart;
