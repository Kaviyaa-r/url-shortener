// Import React core library to render elements
import React from 'react';
// Import chart modules from the recharts plotting library
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Define the ClickChart component which renders click distributions
const ClickChart = ({ data }) => {
  // Check if click data is available and contains non-zero counts
  const hasData = data && data.some(item => item.count > 0);

  return (
    // Outer card wrapper with dark backgrounds, margins, and border styles
    <div className="bg-slate-800 border border-slate-700/60 rounded-xl p-6 shadow-lg">
      {/* Title heading for click distributions */}
      <h3 className="text-base font-bold text-white mb-6">Clicks (Last 7 Days)</h3>

      {/* Render chart layout if click data values exist */}
      {hasData ? (
        // Chart container rendering dimensions
        <div className="h-64 w-full">
          {/* Responsive wrapper to automatically resize chart to parent box width */}
          <ResponsiveContainer width="100%" height="100%">
            {/* Main BarChart component binding inputs */}
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              {/* Cartesian background grid lines styled with slate-700 */}
              <CartesianGrid stroke="#334155" strokeDasharray="3 3" vertical={false} />
              
              {/* XAxis mapping weekdays (Mon, Tue) styled with slate-400 */}
              <XAxis
                dataKey="date"
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              
              {/* YAxis mapping count values styled with slate-400 */}
              <YAxis
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              
              {/* Tooltip config customized to display inside dark boxes */}
              <Tooltip
                contentStyle={{
                  background: '#1e293b', // bg-slate-800
                  border: '1px solid #334155', // border-slate-700
                  borderRadius: '8px',
                  color: '#ffffff',
                }}
                itemStyle={{ color: '#6366f1' }} // indigo-500
                cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }} // subtle indigo highlight
              />
              
              {/* Data bar rendering click count with rounded top corners */}
              <Bar
                dataKey="count"
                fill="#6366f1" // indigo-500
                radius={[4, 4, 0, 0]} // rounded top caps
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        // Empty state message displayed if all clicks count value represents zero
        <div className="h-64 w-full flex flex-col items-center justify-center bg-slate-900/30 rounded-lg border border-dashed border-slate-700">
          {/* Warning notice text */}
          <p className="text-sm text-slate-400 font-medium">No data yet</p>
          {/* Visual sub-text helper */}
          <p className="text-xs text-slate-500 mt-1">Visit your short link to generate tracking events.</p>
        </div>
      )}
    </div>
  );
};

// Export the ClickChart component
export default ClickChart;
