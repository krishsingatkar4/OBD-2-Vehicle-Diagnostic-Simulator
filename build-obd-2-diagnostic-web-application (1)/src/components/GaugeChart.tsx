import { useEffect, useState } from 'react';

interface GaugeChartProps {
  value: number;
  max: number;
  label: string;
  unit: string;
  color?: string;
  warningThreshold?: number;
  dangerThreshold?: number;
  size?: number;
}

export default function GaugeChart({ 
  value, max, label, unit, 
  color = '#3b82f6', 
  warningThreshold, 
  dangerThreshold,
  size = 120 
}: GaugeChartProps) {
  const [animatedValue, setAnimatedValue] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => setAnimatedValue(value), 100);
    return () => clearTimeout(timer);
  }, [value]);

  const percentage = Math.min((animatedValue / max) * 100, 100);
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference * 0.75;
  const center = size / 2;

  let activeColor = color;
  if (dangerThreshold && value >= dangerThreshold) activeColor = '#ef4444';
  else if (warningThreshold && value >= warningThreshold) activeColor = '#f59e0b';

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-[135deg]">
          {/* Background arc */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="#1e2d4a"
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * 0.25}
            strokeLinecap="round"
          />
          {/* Active arc */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={activeColor}
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
            style={{
              filter: `drop-shadow(0 0 6px ${activeColor}50)`,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
          <span className="text-lg font-bold text-text-primary font-mono">{value}</span>
          <span className="text-[10px] text-text-muted font-medium">{unit}</span>
        </div>
      </div>
      <span className="text-xs text-text-secondary font-medium mt-1">{label}</span>
    </div>
  );
}
