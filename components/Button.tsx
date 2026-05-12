import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/utils';

/**
 * Button component with comprehensive interactive states
 * - WCAG 2.1 AA compliant focus indicators
 * - Hover, active, and disabled states
 * - Loading state with spinner
 * - Touch-friendly (44x44px minimum)
 */

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button content */
  children: ReactNode;
  /** Visual variant */
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Loading state - shows spinner and disables button */
  isLoading?: boolean;
  /** Icon to show before text */
  icon?: ReactNode;
  /** Full width button */
  fullWidth?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  fullWidth = false,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'btn-base inline-flex items-center justify-center gap-2 rounded-xl font-display transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-diner-red focus-visible:outline-offset-2';

  const variantStyles = {
    primary: 'bg-diner-red text-white hover:shadow-lg active:shadow-md disabled:bg-gray-300',
    secondary: 'bg-white border-2 border-gray-200 text-diner-black hover:border-gray-300 hover:bg-gray-50 active:bg-gray-100 disabled:bg-gray-100 disabled:text-gray-400',
    danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 disabled:bg-gray-300',
    ghost: 'bg-transparent text-diner-black hover:bg-gray-100 active:bg-gray-200 disabled:text-gray-400',
  };

  const sizeStyles = {
    sm: 'px-3 py-2 text-sm min-h-[36px]',
    md: 'px-5 py-3 text-base min-h-[44px]',
    lg: 'px-6 py-4 text-lg min-h-[52px]',
  };

  return (
    <button
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Spinner size={size === 'sm' ? 14 : 16} />}
      {!isLoading && icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
}

/**
 * Spinner component for loading states
 */
export interface SpinnerProps {
  /** Size in pixels */
  size?: number;
  /** Color (defaults to currentColor) */
  className?: string;
}

export function Spinner({ size = 16, className }: SpinnerProps) {
  return (
    <span
      className={cn('spinner', className)}
      style={{ width: size, height: size }}
      role="status"
      aria-label="Loading"
    />
  );
}

/**
 * IconButton component for toolbar actions
 */
export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Icon element */
  icon: ReactNode;
  /** Accessible label */
  label: string;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
}

export function IconButton({
  icon,
  label,
  size = 'md',
  className,
  ...props
}: IconButtonProps) {
  const sizeStyles = {
    sm: 'p-1.5 min-w-[36px] min-h-[36px]',
    md: 'p-2 min-w-[44px] min-h-[44px]',
    lg: 'p-3 min-w-[52px] min-h-[52px]',
  };

  return (
    <button
      className={cn(
        'icon-button-hover rounded-lg transition-all',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-diner-red focus-visible:outline-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        sizeStyles[size],
        className
      )}
      aria-label={label}
      title={label}
      {...props}
    >
      {icon}
    </button>
  );
}
