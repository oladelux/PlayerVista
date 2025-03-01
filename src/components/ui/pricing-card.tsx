'use client'

import NumberFlow from '@number-flow/react'
import { BadgeCheck, ArrowRight } from 'lucide-react'
import * as React from 'react'

import { SubscriptionFrequencyType } from '@/api'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export interface PricingTier {
  id: string
  name: string
  price: Record<string, number | string>
  description: string
  features: string[]
  cta: string
  highlighted?: boolean
  popular?: boolean
}

interface PricingCardProps {
  tier: PricingTier
  paymentFrequency: SubscriptionFrequencyType
  onTierClick: (tierId: string) => void
}

export function PricingCard({ tier, paymentFrequency, onTierClick }: PricingCardProps) {
  const price = tier.price[paymentFrequency]
  const isHighlighted = tier.highlighted
  const isPopular = tier.popular
  const onClickPlan = () => onTierClick(tier.id)

  return (
    <Card
      className={cn(
        'relative flex flex-col gap-8 overflow-hidden p-6',
        isHighlighted
          ? 'bg-foreground text-background'
          : 'bg-background text-foreground',
        isPopular && 'ring-2 ring-primary',
      )}
    >
      <h2 className='flex items-center gap-3 text-xl font-medium capitalize'>
        {tier.name}
        {isPopular && (
          <Badge variant='secondary' className='z-10  mt-1'>
            🔥 Most Popular
          </Badge>
        )}
      </h2>

      <div className='relative h-12'>
        {typeof price === 'number' ? (
          <>
            <NumberFlow
              format={{
                style: 'currency',
                currency: 'NGN',
                currencyDisplay: 'narrowSymbol',
                trailingZeroDisplay: 'stripIfInteger',
              }}
              value={price}
              className='text-4xl font-medium'
            />
            <p className='-mt-2 text-xs text-muted-foreground'>
              Per month
            </p>
          </>
        ) : (
          <h1 className='text-4xl font-medium'>{price}</h1>
        )}
      </div>

      <div className='flex-1 space-y-2'>
        <h3 className='text-sm font-medium'>{tier.description}</h3>
        <ul className='space-y-2'>
          {tier.features.map((feature, index) => (
            <li
              key={index}
              className={cn(
                'flex items-center gap-2 text-sm font-medium',
                isHighlighted ? 'text-background' : 'text-muted-foreground',
              )}
            >
              <BadgeCheck className='size-4' />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <Button
        variant={isHighlighted ? 'secondary' : 'default'}
        className='w-full'
        onClick={onClickPlan}
      >
        {tier.cta}
        <ArrowRight className='ml-2 size-4' />
      </Button>
    </Card>
  )
}
