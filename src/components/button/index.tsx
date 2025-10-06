import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary';
  size?: 'default' | 'sm' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', children, onClick, ...props }, ref) => {
    return (
      <button
        className={cn(
          // 기본 스타일
          'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-extrabold transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
          'disabled:pointer-events-none disabled:opacity-50',
          
          // Variant 스타일
          {
            'bg-white text-primary border border-primary hover:bg-primary hover:text-white':
              variant === 'default',
            'bg-primary text-white hover:bg-primary/90':
              variant === 'primary',
          },
          
          // Size 스타일
          {
            'h-9 px-4 py-2 text-base': size === 'default',
            'h-8 px-3 text-sm': size === 'sm',
            'h-10 px-6 text-lg': size === 'lg',
          },
          
          className
        )}
        ref={ref}
        onClick={onClick}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;