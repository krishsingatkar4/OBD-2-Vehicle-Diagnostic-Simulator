import React from 'react';
import { Activity, Zap } from 'lucide-react';

interface GaugeProps {
  label: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  warningThreshold?: number;
  criticalThreshold?: number;
  icon?: React.ReactNode;
  type?: 'circular' | 'bar';
  colorScheme?: 'blue' | 'emerald' | 'amber' | 'rose' | 'cyan' | 'purple';
}

export const SensorGauge: React.FC<GaugeProps> = ({
  label,
  value,
  unit,
  min,
  max,
  warningThreshold,
  criticalThreshold,
  icon,
  type = 'circular',
  colorScheme = 'cyan'
}) => {
  const percentage = Math.min(Math.max(((value - min) / (max - min)) * 100, 0), 100);
  
  // Determine warning status
  let statusColor = 'text-cyan-400';
  let barColor = 'bg-cyan-500';
  let shadowGlow = 'rgba(6, 182, 212, 0.3)';
  let glowBorder = 'border-slate-800';

  if (colorScheme === 'emerald') {
    statusColor = 'text-emerald-400';
    barColor = 'bg-emerald-500';
    shadowGlow = 'rgba(16, 185, 129, 0.3)';
  } else if (colorScheme === 'rose') {
    statusColor = 'text-rose-400';
    barColor = 'bg-rose-500';
    shadowGlow = 'rgba(244, 63, 94, 0.3)';
  } else if (colorScheme === 'amber') {
    statusColor = 'text-amber-400';
    barColor = 'bg-amber-500';
    shadowGlow = 'rgba(245, 158, 11, 0.3)';
  } else if (colorScheme === 'purple') {
    statusColor = 'text-purple-400';
    barColor = 'bg-purple-500';
    shadowGlow = 'rgba(168, 85, 247, 0.3)';
  } else if (colorScheme === 'blue') {
    statusColor = 'text-blue-400';
    barColor = 'bg-blue-500';
    shadowGlow = 'rgba(59, 130, 246, 0.3)';
  }

  // Override if warning or critical
  const isCritical = criticalThreshold !== undefined && value >= criticalThreshold;
  const isWarning = !isCritical && warningThreshold !== undefined && value >= warningThreshold;
  const isLowAlert = label === 'Battery Voltage' && value <= 13.0;
  const isLowFuel = label === 'Fuel Level' && value <= 15;

  if (isCritical || isLowAlert || isLowFuel) {
    statusColor = 'text-rose-400 animate-pulse';
    barColor = 'bg-rose-600 animate-pulse';
    shadowGlow = 'rgba(225, 29, 72, 0.6)';
    glowBorder = 'border-rose-500/50 box-shadow-[0_0_15px_rgba(225,29,72,0.3)]';
  } else if (isWarning) {
    statusColor = 'text-amber-400';
    barColor = 'bg-amber-500';
    shadowGlow = 'rgba(245, 158, 11, 0.5)';
    glowBorder = 'border-amber-500/40';
  }

  if (type === 'bar') {
    return (
      <div className={`p-4 rounded-xl glass-panel relative overflow-hidden transition-all duration-300 ${glowBorder}`}>
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <span className={`p-1.5 rounded-lg bg-slate-800 ${statusColor}`}>{icon}</span>
            <span className="text-xs font-semibold tracking-wider uppercase text-slate-300 font-display">{label}</span>
          </div>
          <span className={`text-base font-bold font-mono tracking-tight ${statusColor}`}>
            {typeof value === 'number' && (value % 1 !== 0 ? value.toFixed(1) : value)} <span className="text-xs font-normal text-slate-400">{unit}</span>
          </span>
        </div>
        
        <div className="w-full bg-slate-800/80 rounded-full h-2.5 overflow-hidden p-0.5 border border-slate-700/50">
          <div 
            className={`h-full rounded-full transition-all duration-300 ${barColor}`}
            style={{ width: `${percentage}%`, boxShadow: `0 0 10px ${shadowGlow}` }}
          />
        </div>

        {(isCritical || isLowAlert || isLowFuel) && (
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider animate-bounce">
            <Zap className="w-2.5 h-2.5 inline" /> WARNING
          </div>
        )}
        {isWarning && !isCritical && !isLowAlert && !isLowFuel && (
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider">
            ALERT
          </div>
        )}
      </div>
    );
  }

  // Circular / semi-circular digital layout
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className={`p-4 rounded-xl glass-panel flex flex-col justify-between relative overflow-hidden transition-all duration-300 ${glowBorder}`}>
      <div className="flex justify-between items-start mb-1">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-lg bg-slate-800/80 border border-slate-700/50 ${statusColor}`}>
            {icon || <Activity className="w-4 h-4" />}
          </div>
          <span className="text-xs font-semibold tracking-wider uppercase text-slate-300 font-display">{label}</span>
        </div>

        {(isCritical || isLowAlert || isLowFuel) && (
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
          </span>
        )}
      </div>

      <div className="flex items-center justify-between my-2">
        {/* SVG Circle Graph */}
        <div className="relative flex items-center justify-center">
          <svg className="w-20 h-20 transform -rotate-90">
            <circle
              className="text-slate-800"
              strokeWidth="6"
              stroke="currentColor"
              fill="transparent"
              r={radius}
              cx="40"
              cy="40"
            />
            <circle
              className={`${isCritical || isLowAlert || isLowFuel ? 'text-rose-500' : isWarning ? 'text-amber-500' : statusColor.replace('text-', '')}`}
              strokeWidth="6"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r={radius}
              cx="40"
              cy="40"
              style={{
                transition: 'stroke-dashoffset 0.5s ease-in-out',
                filter: `drop-shadow(0px 0px 4px ${shadowGlow})`
              }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xs font-bold text-slate-400">{Math.round(percentage)}%</span>
          </div>
        </div>

        {/* Big value output */}
        <div className="flex flex-col items-end">
          <span className={`text-2xl lg:text-3xl font-extrabold font-mono tracking-tight ${statusColor}`}>
            {typeof value === 'number' && (value % 1 !== 0 ? value.toFixed(1) : value)}
          </span>
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{unit}</span>
        </div>
      </div>

      <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono mt-1 pt-2 border-t border-slate-800/80">
        <span>MIN: {min}</span>
        {warningThreshold && <span className="text-amber-500/70">WARN: {warningThreshold}</span>}
        <span>MAX: {max}</span>
      </div>
    </div>
  );
};
