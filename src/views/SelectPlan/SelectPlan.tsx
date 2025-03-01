import { useState } from 'react'
import * as React from 'react'

import { selectSubscription, SubscriptionFrequencyType, SubscriptionPlan } from '@/api'
import { PricingSection } from '@/components/blocks/pricing-section.tsx'

const PAYMENT_FREQUENCIES: SubscriptionFrequencyType[] = [
  SubscriptionFrequencyType.MONTHLY,
  SubscriptionFrequencyType.YEARLY,
]

const TIERS = [
  {
    id: 'starter',
    name: 'Starter',
    price: {
      monthly: 10000,
      yearly: 108000,
    },
    description: 'For clubs with limited resources',
    features: [
      'Manage up to 15 players',
      'Manage 1 team',
      '2 staff members management',
      'Create up to 4 matches per month',
      'Create up to 2 roles',
    ],
    cta: 'Get started (7 Days Free Trial)',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: {
      monthly: 40000,
      yearly: 432000,
    },
    description: 'For clubs interested about player data',
    features: [
      'Manage up to 5 teams',
      'Unlimited players per team',
      'Manage up to 10 staff members',
      'Unlimited match events',
      'Create unlimited roles',
      'Live match data linked to dashboard',
      'Access to team & player statistics',
      'Premium support',
      'Public access to player data',
    ],
    cta: 'Get started (7 Days Free Trial)',
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: {
      monthly: 'Custom',
      yearly: 'Custom',
    },
    description: 'Custom plan for your club\'s needs',
    features: [
      'Tailored solutions for your specific needs',
      'Unlimited players, teams, staff, matches, and roles',
      'Priority support',
      'Custom pricing based on your requirements',
    ],
    cta: 'Book a call',
    highlighted: true,
  },
]

export default function SelectPlan() {
  const [selectedFrequency, setSelectedFrequency] =
    useState<SubscriptionFrequencyType>(PAYMENT_FREQUENCIES[0])

  const handleTierClick = async (tierId: string) => {
    switch (tierId) {
      case 'starter':
        try {
          const response = await selectSubscription({
            subscriptionPlan: SubscriptionPlan.STARTER,
            planPeriod: selectedFrequency,
          })
          if (response.redirectUrl) {
            window.location.href = response.redirectUrl
          } else {
            console.error('Unexpected error: Authorization URL not provided.')
          }
        } catch (err) {
          console.error(err, 'An unexpected error occurred. Please try again later.')
        }
        break
      case 'pro':
        try {
          const response = await selectSubscription({
            subscriptionPlan: SubscriptionPlan.PRO,
            planPeriod: selectedFrequency,
          })
          if (response.redirectUrl) {
            window.location.href = response.redirectUrl
          } else {
            console.error('Unexpected error: Authorization URL not provided.')
          }
        } catch (err) {
          console.error(err, 'An unexpected error occurred. Please try again later.')
        }
        break
      case 'enterprise':
        console.log('Enterprise plan selected')
        break
      default:
        console.log('Unknown plan selected')
    }
  }
  return (
    <PricingSection
      title='A plan for you'
      subtitle='Choose the best plan for your needs'
      frequencies={PAYMENT_FREQUENCIES}
      setSelectedFrequency={setSelectedFrequency}
      selectedFrequency={selectedFrequency}
      tiers={TIERS}
      onTierClick={handleTierClick}
    />
  )
}
