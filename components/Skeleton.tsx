import { cn } from '../lib/utils';

/**
 * Skeleton loader components for initial page load states
 * Provides visual feedback while content is loading
 */

export interface SkeletonProps {
  /** Width (CSS value) */
  width?: string;
  /** Height (CSS value) */
  height?: string;
  /** Custom className */
  className?: string;
  /** Shape variant */
  variant?: 'text' | 'circular' | 'rectangular';
}

export function Skeleton({
  width,
  height,
  className,
  variant = 'rectangular',
}: SkeletonProps) {
  const variantStyles = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  return (
    <div
      className={cn('skeleton', variantStyles[variant], className)}
      style={{ width, height }}
      aria-label="Loading..."
      role="status"
    />
  );
}

/**
 * SkeletonCard - Placeholder for dashboard cards
 */
export function SkeletonCard() {
  return (
    <div className="rounded-2xl shadow-sm border border-gray-100 bg-white overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-gray-100 flex items-center gap-3">
        <Skeleton variant="circular" width="24px" height="24px" />
        <Skeleton width="140px" height="20px" />
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <Skeleton width="100%" height="16px" />
        <Skeleton width="90%" height="16px" />
        <Skeleton width="75%" height="16px" />
      </div>
    </div>
  );
}

/**
 * SkeletonList - Placeholder for list items
 */
export interface SkeletonListProps {
  /** Number of skeleton items */
  count?: number;
}

export function SkeletonList({ count = 3 }: SkeletonListProps) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="p-4 border-b border-gray-50">
          <div className="flex items-start gap-3">
            <Skeleton variant="circular" width="40px" height="40px" />
            <div className="flex-1 space-y-2">
              <Skeleton width="60%" height="16px" />
              <Skeleton width="40%" height="14px" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * SkeletonText - Multiple text lines
 */
export interface SkeletonTextProps {
  /** Number of lines */
  lines?: number;
}

export function SkeletonText({ lines = 3 }: SkeletonTextProps) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          width={i === lines - 1 ? '75%' : '100%'}
          height="14px"
        />
      ))}
    </div>
  );
}
