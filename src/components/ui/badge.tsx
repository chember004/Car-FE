import { cn } from '@/lib/utils';
import * as React from 'react';
import { tv, type VariantProps } from 'tailwind-variants';

const badgeVariants = tv({
  base: 'inline-flex items-center rounded-full border border-gray-200 px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2',
  variants: {
    variant: {
      default:
        'border-transparent bg-gray-900 text-gray-50 hover:bg-gray-900/80',
      secondary:
        'border-transparent bg-gray-100 text-gray-900 hover:bg-gray-100/80',
      destructive:
        'border-transparent bg-red-500 text-gray-50 hover:bg-red-500/80',
      outline: 'text-gray-950',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

type BadgeVariants = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof badgeVariants>;

interface BadgeProps extends BadgeVariants {
  children: React.ReactNode;
}

function Badge(props: BadgeProps) {
  return <div className={cn(badgeVariants(props))} {...props} />;
}

export { Badge, badgeVariants };
