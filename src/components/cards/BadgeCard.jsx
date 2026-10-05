import React from 'react';
import { Award, Lock, CheckCircle2 } from 'lucide-react';

export default function BadgeCard({ badge }) {
  const isUnlocked = badge.unlocked;

  return (
    <div
      className={`glass-card rounded-2xl p-4 border transition-all duration-300 relative overflow-hidden ${
        isUnlocked
          ? 'border-emerald-500/30 bg-gradient-to-br from-emerald-500/5 to-transparent'
          : 'opacity-60 border-gray-200 dark:border-gray-800'
      }`}
    >
      <div className="flex items-start space-x-3.5">
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-md ${
            isUnlocked ? 'bg-gradient-to-tr from-eco-500 to-emerald-400 text-white' : 'bg-gray-200 dark:bg-dark-800 text-gray-400'
          }`}
        >
          {badge.icon || <Award className="w-6 h-6" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm text-gray-900 dark:text-white truncate">{badge.title}</h4>
            {isUnlocked ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            ) : (
              <Lock className="w-4 h-4 text-gray-400 shrink-0" />
            )}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">{badge.description}</p>
          <div className="mt-2.5 flex items-center justify-between text-[10px] font-semibold text-eco-600 dark:text-eco-400">
            <span>+{badge.pointsReward} Points</span>
            <span>{isUnlocked ? 'Unlocked' : `Progress: ${badge.progress || '0/1'}`}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
