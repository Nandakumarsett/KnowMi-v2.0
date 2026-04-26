'use client';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export default function DevicePie({ data }: { data: any[] }) {
  const totals = data.reduce((acc, d) => ({
    mobile: acc.mobile + (d.mobile_views || 0),
    desktop: acc.desktop + (d.total_views - (d.mobile_views || 0))
  }), { mobile: 0, desktop: 0 });

  const chartData = [
    { name: 'Mobile', value: totals.mobile },
    { name: 'Desktop', value: totals.desktop },
  ];

  const COLORS = ['#F97316', '#1C1917'];

  return (
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie 
            data={chartData} 
            innerRadius={60} 
            outerRadius={80} 
            paddingAngle={8} 
            dataKey="value"
            stroke="none"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={4} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}
          />
          <Legend 
            iconType="circle" 
            verticalAlign="bottom" 
            align="center"
            wrapperStyle={{ paddingTop: '20px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }} 
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
