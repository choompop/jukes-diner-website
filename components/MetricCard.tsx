'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { cn } from '../lib/utils';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: number | string;
  color: 'red' | 'teal' | 'orange' | 'purple' | 'blue';
  icon?: React.ReactNode;
  trend?: {
    direction: 'up' | 'down' | 'neutral';
    value: string;
    label: string;
  };
  linkTo?: string;
  ariaLabel?: string;
  delay?: number;
  className?: string; // Allow custom classes for grid positioning
}

const colorClasses = {
  red: 'text-diner-red border-diner-red/20 hover:border-diner-red/40',
  teal: 'text-diner-teal border-diner-teal/20 hover:border-diner-teal/40',
  orange: 'text-orange-600 border-orange-600/20 hover:border-orange-600/40',
  purple: 'text-purple-600 border-purple-600/20 hover:border-purple-600/40',
  blue: 'text-blue-500 border-blue-500/20 hover:border-blue-500/40',
};

const trendColorClasses = {
  up: 'text-green-600 bg-green-50',
  down: 'text-red-600 bg-red-50',
  neutral: 'text-gray-500 bg-gray-50',
};

export function MetricCard({
  label,
  value,
  color,
  icon,
  trend,
  linkTo,
  ariaLabel,
  delay = 0,
  className, // Accept className for grid positioning
}: MetricCardProps) {
  const shouldReduceMotion = useReducedMotion();

  const content = (
    <motion.div
      data-testid="metric-card"
      initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={shouldReduceMotion ? { duration: 0 } : { delay }}
      className={cn(
        'bg-white rounded-xl shadow-sm border transition-all duration-200',
        'hover:shadow-md cursor-pointer',
        // Responsive padding and min-heights
        'p-5 md:p-6',
        'min-h-[80px] md:min-h-[100px] lg:min-h-[120px]',
        'flex flex-col justify-between',
        colorClasses[color],
        className // Apply custom classes (e.g., md:col-span-2)
      )}
    >
      <div className="flex items-start justify-between mb-2 md:mb-3">
        {/* Responsive number sizing: 30px mobile → 36px tablet/desktop */}
        <div className={cn('text-3xl md:text-4xl font-bold', colorClasses[color])}>
          {value}
        </div>
        {icon && (
          <div className={cn('opacity-40', colorClasses[color])}>
            {icon}
          </div>
        )}
      </div>

      <div className="space-y-2">
        {/* Responsive label sizing: 14px mobile → 12px tablet/desktop */}
        <div className="text-sm md:text-xs text-gray-500 uppercase tracking-widest font-medium">
          {label}
        </div>

        {trend && (
          <div className={cn(
            'inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium',
            trendColorClasses[trend.direction]
          )}>
            {trend.direction === 'up' && <ArrowUp className="h-3 w-3" />}
            {trend.direction === 'down' && <ArrowDown className="h-3 w-3" />}
            {trend.direction === 'neutral' && <Minus className="h-3 w-3" />}
            <span>{trend.value}</span>
            <span>{trend.label}</span>
          </div>
        )}
      </div>
    </motion.div>
  );

  if (linkTo) {
    return <Link href={linkTo} aria-label={ariaLabel || `View ${label}`}>{content}</Link>;
  }

  return content;
}
