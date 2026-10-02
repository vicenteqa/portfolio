'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';

import { cn } from '@/lib/utils';

// Tactile buttons: a hard offset shadow that the button "sinks" into on press.
const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded font-mono text-sm font-medium transition-all duration-150 select-none disabled:pointer-events-none disabled:opacity-50 hover:-translate-x-px hover:-translate-y-px active:translate-x-[3px] active:translate-y-[3px] active:shadow-none',
  {
    variants: {
      variant: {
        default:
          'bg-accent text-ink shadow-[3px_3px_0_0_rgba(41,212,255,0.28)] hover:bg-white hover:shadow-[4px_4px_0_0_rgba(41,212,255,0.45)]',
        primary:
          'bg-primary text-white border border-white/10 hover:border-accent/50',
        outline:
          'border border-accent/70 bg-transparent text-accent shadow-[3px_3px_0_0_rgba(41,212,255,0.18)] hover:bg-accent hover:text-ink hover:shadow-[4px_4px_0_0_rgba(41,212,255,0.4)]',
      },
      size: {
        default: 'h-10 px-5',
        sm: 'h-9 px-4 text-xs',
        lg: 'h-14 px-8 text-sm uppercase tracking-[0.14em]',
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
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
