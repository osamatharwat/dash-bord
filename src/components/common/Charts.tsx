import React from 'react';

// Crisp SVG sparkline for KPI historical trend
export const Sparkline: React.FC<{
  data: (number | null)[];
  color?: string;
  height?: number;
  width?: number;
}> = ({ data, color = '#38bdf8', height = 28, width = 96 }) => {
  const validData = data.filter((d): d is number => d !== null);
  if (validData.length < 2) {
    return <span className="text-xs text-slate-500 font-mono">· · ·</span>;
  }

  const min = Math.min(...validData);
  const max = Math.max(...validData);
  const range = max - min || 1;

  const points = validData
    .map((val, idx) => {
      const x = (idx / (validData.length - 1)) * (width - 4) + 2;
      const y = height - ((val - min) / range) * (height - 8) - 4;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg width={width} height={height} className="overflow-visible inline-block">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
};

// SVG Multi-Period Trend Chart with Target Line
export const TrendChart: React.FC<{
  history: { period: string; actual: number | null; target: number }[];
  unit?: string;
  height?: number;
}> = ({ history, unit = '', height = 180 }) => {
  if (!history || history.length === 0) {
    return (
      <div className="h-40 flex items-center justify-center text-xs text-slate-500 font-mono">
        No historical telemetry available
      </div>
    );
  }

  // Find max scale
  const actualValues = history.map(h => h.actual).filter((v): v is number => v !== null);
  const targetValues = history.map(h => h.target);
  const allValues = [...actualValues, ...targetValues];
  const maxVal = Math.max(...allValues, 10) * 1.15;
  const minVal = Math.min(0, ...allValues);
  const range = maxVal - minVal || 1;

  const width = 500;
  const paddingX = 40;
  const paddingY = 24;
  const chartW = width - paddingX * 2;
  const chartH = height - paddingY * 2;

  // Points for actuals
  const actualPoints = history
    .map((item, idx) => {
      if (item.actual === null) return null;
      const x = paddingX + (idx / (history.length - 1 || 1)) * chartW;
      const y = height - paddingY - ((item.actual - minVal) / range) * chartH;
      return { x, y, val: item.actual, period: item.period };
    })
    .filter((p): p is { x: number; y: number; val: number; period: string } => p !== null);

  // Target points
  const targetPoints = history.map((item, idx) => {
    const x = paddingX + (idx / (history.length - 1 || 1)) * chartW;
    const y = height - paddingY - ((item.target - minVal) / range) * chartH;
    return { x, y, val: item.target, period: item.period };
  });

  const actualPolyline = actualPoints.map(p => `${p.x},${p.y}`).join(' ');
  const targetPolyline = targetPoints.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        {/* Horizontal gridlines */}
        {[0, 0.5, 1].map((pct, i) => {
          const y = height - paddingY - pct * chartH;
          const val = Math.round(minVal + pct * range);
          return (
            <g key={i}>
              <line
                x1={paddingX}
                y1={y}
                x2={width - paddingX}
                y2={y}
                stroke="#334155"
                strokeDasharray="3 3"
                strokeWidth="1"
              />
              <text
                x={paddingX - 6}
                y={y + 3}
                fill="#64748b"
                fontSize="10"
                fontFamily="var(--font-mono)"
                textAnchor="end"
              >
                {val}
              </text>
            </g>
          );
        })}

        {/* Target dashed line */}
        <polyline
          fill="none"
          stroke="#94a3b8"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          points={targetPolyline}
        />

        {/* Actual solid line */}
        {actualPoints.length > 1 && (
          <polyline
            fill="none"
            stroke="#38bdf8"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={actualPolyline}
          />
        )}

        {/* Target dots */}
        {targetPoints.map((p, idx) => (
          <circle key={`t-${idx}`} cx={p.x} cy={p.y} r="3" fill="#94a3b8" />
        ))}

        {/* Actual dots */}
        {actualPoints.map((p, idx) => (
          <g key={`a-${idx}`}>
            <circle cx={p.x} cy={p.y} r="4.5" fill="#38bdf8" stroke="#0f172a" strokeWidth="2" />
            <text
              x={p.x}
              y={p.y - 8}
              fill="#e2e8f0"
              fontSize="10"
              fontFamily="var(--font-mono)"
              textAnchor="middle"
              className="font-medium"
            >
              {p.val.toLocaleString()}{unit === 'percentage' ? '%' : ''}
            </text>
          </g>
        ))}

        {/* X axis labels */}
        {history.map((item, idx) => {
          const x = paddingX + (idx / (history.length - 1 || 1)) * chartW;
          return (
            <text
              key={`x-${idx}`}
              x={x}
              y={height - 6}
              fill="#94a3b8"
              fontSize="10"
              fontFamily="var(--font-sans)"
              textAnchor="middle"
            >
              {item.period}
            </text>
          );
        })}
      </svg>
      <div className="flex items-center justify-center gap-6 mt-2 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-3 h-0.5 bg-sky-400 inline-block"></span>
          <span>Actual Results</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-0.5 border-t border-dashed border-slate-400 inline-block"></span>
          <span>Configured Target</span>
        </div>
      </div>
    </div>
  );
};

// Radial circular meter for scores / compliance
export const RadialProgress: React.FC<{
  value: number; // 0 - 100
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  color?: string;
}> = ({ value, size = 110, strokeWidth = 8, label, sublabel, color = '#38bdf8' }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedValue = Math.min(100, Math.max(0, value));
  const offset = circumference - (clampedValue / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#1e293b"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="none"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-xl font-bold font-mono tabular-nums text-slate-100">
          {clampedValue}%
        </span>
        {label && <span className="text-[10px] uppercase tracking-wider text-slate-400">{label}</span>}
      </div>
      {sublabel && <span className="text-xs text-slate-400 mt-1">{sublabel}</span>}
    </div>
  );
};

// Horizontal comparison bar
export const ComparisonBar: React.FC<{
  label: string;
  value: number;
  max?: number;
  unit?: string;
  target?: number;
  status?: 'On Track' | 'Needs Attention' | 'Critical' | 'Missing Report';
}> = ({ label, value, max = 100, unit = '%', target, status }) => {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  
  let barColor = 'bg-sky-500';
  if (status === 'Critical') barColor = 'bg-rose-500';
  else if (status === 'Needs Attention') barColor = 'bg-amber-500';
  else if (status === 'On Track') barColor = 'bg-emerald-500';

  return (
    <div className="w-full text-xs">
      <div className="flex items-center justify-between mb-1 text-slate-300">
        <span className="font-medium text-slate-200">{label}</span>
        <span className="font-mono tabular-nums">
          {value.toLocaleString()} {unit}
          {target !== undefined && (
            <span className="text-slate-500 ml-1.5">/ {target.toLocaleString()}</span>
          )}
        </span>
      </div>
      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden relative">
        <div
          className={`h-full ${barColor} transition-all duration-300`}
          style={{ width: `${pct}%` }}
        />
        {target !== undefined && max && (
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-white/80"
            style={{ left: `${Math.min(100, (target / max) * 100)}%` }}
            title={`Target: ${target}`}
          />
        )}
      </div>
    </div>
  );
};
