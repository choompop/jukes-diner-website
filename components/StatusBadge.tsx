/**
 * StatusBadge - Standardized badge component for status, priority, and category labels
 * 
 * Replaces inline badge styling across the dashboard with a unified component.
 * All badges share consistent:
 * - Border radius (rounded-full / 12px equivalent)
 * - Font size per size variant
 * - Padding structure
 * - Text transform (uppercase)
 * - Letter spacing
 */

import React from 'react';
import { cn } from '@/lib/utils';

export type BadgeVariant =
  // Priority variants
  | 'urgent'
  | 'high'
  | 'medium'
  | 'low'
  // Booking variants
  | 'booking'
  | 'lead'
  // SOP variants
  | 'daily-ops'
  | 'emergency'
  // Media type variants
  | 'image'
  | 'video'
  // Generic semantic variants
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'neutral';

export type BadgeSize = 'sm' | 'md' | 'lg';

interface StatusBadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
  size?: BadgeSize;
  className?: string;
}

// Base badge styling - ALL badges share this foundation
const baseStyles = 'inline-flex items-center justify-center whitespace-nowrap font-bold uppercase tracking-widest transition-colors';

// Size variants - consistent padding and font size per size
const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-[9px] rounded-full',      // Compact for dense layouts
  md: 'px-3 py-1 text-[10px] rounded-full',       // Default for most cases
  lg: 'px-4 py-1.5 text-xs rounded-full',         // Prominent for key indicators
};

// Semantic color variants - consistent with design system
const variantStyles: Record<BadgeVariant, string> = {
  // Priority badges (already consistent in command center)
  urgent: 'bg-red-100 text-red-700 border border-red-300',
  high: 'bg-orange-100 text-orange-700 border border-orange-300',
  medium: 'bg-yellow-100 text-yellow-700 border border-yellow-300',
  low: 'bg-blue-100 text-blue-700 border border-blue-300',
  
  // Booking status badges
  booking: 'bg-green-100 text-green-700',
  lead: 'bg-blue-100 text-blue-700',
  
  // SOP category badges
  'daily-ops': 'bg-indigo-100 text-indigo-700',
  emergency: 'bg-red-100 text-red-700',
  
  // Media type badges
  image: 'bg-purple-100 text-purple-700',
  video: 'bg-pink-100 text-pink-700',
  
  // Generic semantic badges
  success: 'bg-green-100 text-green-700',
  warning: 'bg-yellow-100 text-yellow-700',
  error: 'bg-red-100 text-red-700',
  info: 'bg-blue-100 text-blue-700',
  neutral: 'bg-gray-100 text-gray-700',
};

export function StatusBadge({
  variant,
  children,
  size = 'md',
  className,
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        baseStyles,
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

/**
 * Usage Examples:
 * 
 * Priority badge:
 * <StatusBadge variant="urgent">URGENT</StatusBadge>
 * 
 * Booking status:
 * <StatusBadge variant="booking">BOOKING</StatusBadge>
 * <StatusBadge variant="lead">LEAD</StatusBadge>
 * 
 * SOP category:
 * <StatusBadge variant="emergency">emergency</StatusBadge>
 * <StatusBadge variant="daily-ops">daily-ops</StatusBadge>
 * 
 * Media type:
 * <StatusBadge variant="image" size="sm">image</StatusBadge>
 * <StatusBadge variant="video" size="sm">video</StatusBadge>
 */
