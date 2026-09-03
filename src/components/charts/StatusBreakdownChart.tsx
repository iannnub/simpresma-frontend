import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import type { ProdiStatistik } from '@/types';

interface StatusBreakdownChartProps {
  data: ProdiStatistik[];
  height?: number;
}

export const StatusBreakdownChart: React.FC<StatusBreakdownChartProps> = ({
  data,
  height = 260,
}) => {
  const chartData = data.map((item) => ({
    name: item.prodi,
    fullName: item.nama_prodi,
    Pending: item.by_status.pending || 0,
    Diterima: item.by_status.diterima || 0,
    Ditolak: item.by_status.ditolak || 0,
    Selesai: item.by_status.selesai || 0,
  }));

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis dataKey="name" tick={{ fontSize: 11 }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              fontSize: '12px',
            }}
          />
          <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
          <Bar dataKey="Pending" fill="#f59e0b" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Diterima" fill="#0284c7" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Selesai" fill="#10b981" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Ditolak" fill="#e11d48" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StatusBreakdownChart;
