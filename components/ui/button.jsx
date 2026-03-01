'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-full text-base font-semibold ring-offset white transition-all duration-300 relative overflow-hidden group active:scale-95',
  {
    variants: {
      variant: {
        default: 'bg-accent text-primary hover:bg-accent-hover hover:shadow-lg hover:shadow-accent/30',
        primary: 'bg-primary text-white hover:bg-primary/90',
        outline:
          'border-2 border-accent bg-transparent text-accent hover:bg-accent hover:text-primary hover:shadow-lg hover:shadow-accent/30',
      },
      size: {
        default: 'h-[44px] px-6 min-w-[120px]',
        sm: 'h-[40px] px-5 text-sm min-w-[100px]',
        lg: 'h-[56px] px-8 text-base uppercase tracking-[2px] min-w-[160px]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    const [ripples, setRipples] = React.useState([]);
    const Comp = asChild ? Slot : 'button';

    const addRipple = (event) => {
      const button = event.currentTarget;
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = event.clientX - rect.left - size / 2;
      const y = event.clientY - rect.top - size / 2;

      const newRipple = {
        x,
        y,
        size,
        id: Date.now(),
      };

      setRipples((prev) => [...prev, newRipple]);

      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, 600);
    };

    const handleClick = (event) => {
      if (!props.disabled) {
        addRipple(event);
      }
      if (props.onClick) {
        props.onClick(event);
      }
    };

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
        onClick={handleClick}
      >
        {/* Ripple effects */}
        {ripples.map((ripple) => (
          <span
            key={ripple.id}
            className="absolute rounded-full bg-white/30 pointer-events-none animate-ripple"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: ripple.size,
              height: ripple.size,
            }}
          />
        ))}

        {/* Shine effect on hover */}
        <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
        </span>

        {/* Content */}
        <span className="relative z-10">{children}</span>
      </Comp>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
