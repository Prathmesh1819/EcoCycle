import React from 'react';

export default function StatsCard({ title, value, icon: Icon, trend, subtext, color = 'eco' }) {
  const colorMap = {
    eco: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    blue: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
    amber: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    purple: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
  };

  return (
    <div className="glass-card rounded-2xl p-5 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">{title}</p>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">{value}</h3>
        </div>
        <div className={`p-3 rounded-2xl border ${colorMap[color]} group-hover:scale-110 transition-transform`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>

      {(trend || subtext) && (
        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs">
          {trend && (
            <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              ↑ {trend}
            </span>
          )}
          {subtext && <span className="text-gray-500 dark:text-gray-400">{subtext}</span>}
        </div>
      )}
    </div>
  );
}
