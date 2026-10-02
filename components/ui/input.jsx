import * as React from 'react';

import { cn } from '@/lib/utils';

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        'flex h-12 w-full rounded border border-white/10 bg-ink/60 px-4 text-base text-white placeholder:text-white/30 outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent/40',
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = 'Input';

export { Input };
