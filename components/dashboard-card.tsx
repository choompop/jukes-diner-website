import { ReactNode } from 'react';
import { cn } from '../lib/utils';

/**
 * DashboardCard - Standardized card component for Juke's Dashboard
 * 
 * Enforces consistent padding, borders, and spacing across all dashboard sections.
 * 
 * Padding Scale (Tailwind):
 * - p-2 (8px)  - Minimal spacing for small interactive elements
 * - p-3 (12px) - Nested/secondary content cards
 * - p-4 (16px) - Primary list items and compact cards
 * - p-5 (20px) - Card headers and prominent sections
 * - p-6 (24px) - Major container sections
 */

export interface DashboardCardProps {
  /** Card title displayed in the header */
  title?: string;
  /** Card content */
  children: ReactNode;
  /** Size variant controls padding and visual weight */
  variant?: 'default' | 'compact' | 'nested';
  /** Optional header icon (Lucide React component) */
  icon?: ReactNode;
  /** Optional header action (e.g., "VIEW ALL" link) */
  headerAction?: ReactNode;
  /** Header metadata (e.g., count badge) */
  headerMeta?: ReactNode;
  /** Background color variant */
  colorScheme?: 'white' | 'teal' | 'red' | 'gray';
  /** Additional CSS classes for the container */
  className?: string;
  /** Additional CSS classes for the content area */
  contentClassName?: string;
}

/**
 * Standardized dashboard card component.
 * 
 * @example
 * // Basic card with header
 * <DashboardCard title="TODAY'S PRIORITIES" icon={<CheckCircle />}>
 *   <div>Content here</div>
 * </DashboardCard>
 * 
 * @example
 * // Compact card (for sidebars)
 * <DashboardCard 
 *   title="MEDIA APPROVALS" 
 *   variant="compact"
 *   headerMeta={<span className="text-xs">3 pending</span>}
 * >
 *   <div>Content here</div>
 * </DashboardCard>
 * 
 * @example
 * // Colored card
 * <DashboardCard 
 *   title="FINANCIAL PULSE" 
 *   colorScheme="teal"
 *   icon={<DollarSign />}
 * >
 *   <div>Content here</div>
 * </DashboardCard>
 */
export function DashboardCard({
  title,
  children,
  variant = 'default',
  icon,
  headerAction,
  headerMeta,
  colorScheme = 'white',
  className,
  contentClassName,
}: DashboardCardProps) {
  const colorClasses = {
    white: 'bg-white border-gray-100 text-gray-800',
    teal: 'bg-diner-teal text-white border-white/10',
    red: 'bg-diner-red text-white border-white/10',
    gray: 'bg-gray-50 border-gray-200 text-gray-800',
  };

  const variantClasses = {
    default: {
      header: 'p-5',
      content: 'p-4',
      title: 'text-lg',
    },
    compact: {
      header: 'p-5',
      content: 'p-4',
      title: 'text-sm',
    },
    nested: {
      header: 'p-3',
      content: 'p-3',
      title: 'text-xs',
    },
  };

  const config = variantClasses[variant];

  return (
    <div
      className={cn(
        'rounded-2xl shadow-sm border overflow-hidden',
        colorClasses[colorScheme],
        className
      )}
    >
      {/* Header */}
      {title && (
        <div
          className={cn(
            'border-b flex items-center justify-between',
            config.header,
            colorScheme === 'white' ? 'border-gray-100' : 'border-white/10'
          )}
        >
          <div className="flex items-center gap-3">
            {icon && <div className="flex-shrink-0">{icon}</div>}
            <h2 className={cn('font-display', config.title)}>{title}</h2>
          </div>
          {headerAction && <div>{headerAction}</div>}
          {headerMeta && <div>{headerMeta}</div>}
        </div>
      )}

      {/* Content */}
      <div className={cn(config.content, contentClassName)}>{children}</div>
    </div>
  );
}

/**
 * DashboardCardList - Wrapper for list items inside cards.
 * Provides consistent spacing and dividers.
 */
export interface DashboardCardListProps {
  children: ReactNode;
  /** Add dividers between items */
  divided?: boolean;
  /** Spacing between items */
  spacing?: 'tight' | 'normal' | 'loose';
  className?: string;
}

export function DashboardCardList({
  children,
  divided = true,
  spacing = 'normal',
  className,
}: DashboardCardListProps) {
  const spacingClasses = {
    tight: 'space-y-1',
    normal: 'space-y-2',
    loose: 'space-y-3',
  };

  return (
    <div
      className={cn(
        divided ? 'divide-y divide-gray-50' : spacingClasses[spacing],
        className
      )}
    >
      {children}
    </div>
  );
}

/**
 * DashboardCardListItem - Individual list item with consistent padding.
 */
export interface DashboardCardListItemProps {
  children: ReactNode;
  /** Enable hover effect */
  hoverable?: boolean;
  /** Click handler */
  onClick?: () => void;
  className?: string;
}

export function DashboardCardListItem({
  children,
  hoverable = true,
  onClick,
  className,
}: DashboardCardListItemProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'p-4',
        hoverable && 'interactive-list-item',
        onClick && 'cursor-pointer',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-diner-red focus-visible:outline-offset-2',
        className
      )}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      {children}
    </div>
  );
}

/**
 * DashboardNestedCard - For cards within cards (e.g., approval items).
 * Uses smaller padding to show hierarchy.
 */
export interface DashboardNestedCardProps {
  children: ReactNode;
  hoverable?: boolean;
  className?: string;
}

export function DashboardNestedCard({
  children,
  hoverable = true,
  className,
}: DashboardNestedCardProps) {
  return (
    <div
      className={cn(
        'p-3 bg-gray-50 rounded-xl',
        hoverable && 'card-hover-subtle cursor-pointer',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-diner-red focus-visible:outline-offset-2',
        className
      )}
      tabIndex={hoverable ? 0 : undefined}
    >
      {children}
    </div>
  );
}
