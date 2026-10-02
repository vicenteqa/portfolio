import * as React from 'react';

import { cn } from '@/lib/utils';

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        'flex min-h-[120px] w-full rounded border border-white/10 bg-ink/60 px-4 py-3 text-base text-white placeholder:text-white/30 outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent/40 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = 'Textarea';

export { Textarea };
