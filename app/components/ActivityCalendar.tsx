'use client';

import React from 'react';
import { eachDayOfInterval, subYears, format, isEqual, startOfDay } from 'date-fns';

interface ActivityData {
  date: Date;
  count: number;
}

interface ActivityCalendarProps {
  data: ActivityData[];
}

const ActivityCalendar: React.FC<ActivityCalendarProps> = ({ data }) => {
  const today = new Date();
  const oneYearAgo = subYears(today, 1);
  
  // Generate all dates for the past year
  const dates = eachDayOfInterval({
    start: oneYearAgo,
    end: today,
  });

  // Create a map of activity counts
  const activityMap = new Map<string, number>();
  data.forEach((item) => {
    const dateStr = format(startOfDay(item.date), 'yyyy-MM-dd');
    activityMap.set(dateStr, item.count);
  });

  // Calculate the maximum count to determine color intensity
  const maxCount = Math.max(...Array.from(activityMap.values()), 1);

  // Helper function to get color based on activity count
  const getColor = (count: number) => {
    if (count === 0) return 'bg-gray-100 dark:bg-gray-800';
    const intensity = Math.min((count / maxCount) * 4, 4);
    const colorLevels = [
      'bg-green-100 dark:bg-green-900',
      'bg-green-200 dark:bg-green-800',
      'bg-green-300 dark:bg-green-700',
      'bg-green-400 dark:bg-green-600',
      'bg-green-500 dark:bg-green-500',
    ];
    return colorLevels[Math.floor(intensity)];
  };

  // Group dates by week for display
  const weeks: Date[][] = [];
  let currentWeek: Date[] = [];

  dates.forEach((date) => {
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    currentWeek.push(date);
  });
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-4">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
          <span>Less</span>
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={`w-3 h-3 rounded ${getColor(level * (maxCount / 4))}`}
              />
            ))}
          </div>
          <span>More</span>
        </div>
        <div className="flex gap-1">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.map((date) => {
                const dateStr = format(date, 'yyyy-MM-dd');
                const count = activityMap.get(dateStr) || 0;
                return (
                  <div
                    key={dateStr}
                    className={`w-3 h-3 rounded ${getColor(count)}`}
                    title={`${format(date, 'MMM d, yyyy')}: ${count} activities`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActivityCalendar; 