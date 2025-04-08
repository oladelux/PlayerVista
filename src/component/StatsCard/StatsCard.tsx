import { cva, VariantProps } from 'class-variance-authority'

import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const statsCardVariants = cva('overflow-hidden transition-all duration-300', {
  variants: {
    variant: {
      default: 'border-border bg-white',
      primary: 'border-primary/20 bg-primary/10',
      success: 'border-emerald-200 bg-emerald-50',
      warning: 'border-amber-200 bg-amber-50',
      danger: 'border-rose-200 bg-rose-50',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

export interface StatsCardProps extends VariantProps<typeof statsCardVariants> {
  title: string
  value: string | number
  icon?: React.ReactNode
  description?: string
  trend?: {
    value: number
    isPositive: boolean
  }
  className?: string
  footer?: React.ReactNode
}

export function StatsCard({
  title,
  value,
  icon,
  description,
  trend,
  variant,
  className,
  footer,
}: StatsCardProps) {
  return (
    <Card className={cn(statsCardVariants({ variant }), 'h-full card-hover', className)}>
      <CardContent className='p-6'>
        <div className='flex items-start justify-between'>
          <div>
            <p className='mb-1 text-sm font-medium text-muted-foreground'>{title}</p>
            <h3 className='text-2xl font-semibold tracking-tight'>{value}</h3>
            {description && <p className='mt-1.5 text-xs text-muted-foreground'>{description}</p>}
            {trend && (
              <div className='mt-2 flex items-center'>
                <span
                  className={cn(
                    'text-xs font-medium',
                    trend.isPositive ? 'text-emerald-600' : 'text-rose-600',
                  )}
                >
                  {trend.isPositive ? '+' : ''}
                  {trend.value}%
                </span>
                <span className='ml-1.5 text-xs text-muted-foreground'>vs. last month</span>
              </div>
            )}
          </div>
          {icon && <div className='mt-1'>{icon}</div>}
        </div>
        {footer && <div className='mt-4 border-t border-border pt-3'>{footer}</div>}
      </CardContent>
    </Card>
  )
}
