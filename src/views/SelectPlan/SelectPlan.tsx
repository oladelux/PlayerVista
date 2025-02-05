import { useState } from 'react'

import { selectSubscription, SubscriptionPlan, SubscriptionType } from '@/api'
import { DashboardHeader } from '@/component/DashboardLayout/DashboardLayout.tsx'
import { Button } from '@/components/ui/button.tsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.tsx'
import { useTeams } from '@/hooks/useTeams.ts'

export default function SelectPlan() {
  const { teams } = useTeams()
  return (
    <>
      <DashboardHeader teams={teams}/>
      <div className='flex flex-col items-center justify-center bg-white p-5'>
        <h1 className='text-[26px] text-dark-purple'>Choose the Perfect Plan for You</h1>
        <p className='my-5 text-sm text-[#4B4B4B]'>
          Access powerful tools and analytics to elevate your team's performance.
          Select a plan that fits your needs.
        </p>
        <div className='w-full'>
          <Tabs defaultValue='monthly'>
            <TabsList className='mx-auto mb-5 contents h-fit w-3/5 gap-3 rounded-full bg-light-purple p-1.5 md:grid md:grid-cols-2'>
              <TabsTrigger
                value='monthly'
                className='px-3.5 py-2.5 text-text-grey-3 data-[state=active]:rounded-full data-[state=active]:bg-dark-purple data-[state=active]:text-white'
              >
                Monthly
              </TabsTrigger>

              <TabsTrigger
                value='yearly'
                className='px-3.5 py-2.5 text-text-grey-3 data-[state=active]:rounded-full data-[state=active]:bg-dark-purple data-[state=active]:text-white'
              >
                  Yearly
              </TabsTrigger>
            </TabsList>
            <TabsContent value='monthly'>
              <MonthlyPlan />
            </TabsContent>
            <TabsContent value='yearly'>
              <YearlyPlan />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  )
}

function MonthlyPlan() {
  const [loading, setLoading] = useState(false)

  async function onSelectPlan(plan: SubscriptionPlan, type: SubscriptionType) {
    setLoading(true)

    try {
      const response = await selectSubscription({
        subscriptionPlan: plan,
        planPeriod: type,
      })
      console.log(response)
      if (response.redirectUrl) {
        window.location.href = response.redirectUrl
      } else {
        console.error('Unexpected error: Authorization URL not provided.')
      }
    } catch (err) {
      console.error(err, 'An unexpected error occurred. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='mx-auto grid w-4/5 grid-cols-3 gap-5'>
      <div className='rounded-lg border bg-white p-3'>
        <div className='w-fit rounded-md bg-light-purple px-2 py-1.5 text-sm text-dark-purple'>Starter</div>
        <div className='min-h-[190px]'>
          <div className='py-4 text-sm text-sub-text'>
            Designed for clubs with limited resources but the desire to manage their team more
            effectively
          </div>
          <div className='py-5 text-[28px] font-medium'>
            &#8358;15,000 <span className='text-sm text-sub-text'>/month</span>
          </div>
        </div>
        <div className='min-h-[390px] border-y border-border-line py-5'>
          <ul className='space-y-4 text-left text-gray-500 dark:text-gray-400'>
            <li className='flex items-center space-x-3 rtl:space-x-reverse'>
              <svg className='size-3.5 shrink-0 text-green-500 dark:text-green-400' aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 16 12'>
                <path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2'
                  d='M1 5.917 5.724 10.5 15 1.5'/>
              </svg>
              <span> Manage up to 15 players </span>
            </li>
            <li className='flex items-center space-x-3 rtl:space-x-reverse'>
              <svg className='size-3.5 shrink-0 text-green-500 dark:text-green-400' aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 16 12'>
                <path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2'
                  d='M1 5.917 5.724 10.5 15 1.5'/>
              </svg>
              <span>Manage 1 team</span>
            </li>
            <li className='flex items-center space-x-3 rtl:space-x-reverse'>
              <svg className='size-3.5 shrink-0 text-green-500 dark:text-green-400' aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 16 12'>
                <path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2'
                  d='M1 5.917 5.724 10.5 15 1.5'/>
              </svg>
              <span>2 staff members management</span>
            </li>
            <li className='flex items-center space-x-3 rtl:space-x-reverse'>
              <svg className='size-3.5 shrink-0 text-green-500 dark:text-green-400' aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 16 12'>
                <path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2'
                  d='M1 5.917 5.724 10.5 15 1.5'/>
              </svg>
              <span>Create up to 4 matches per month</span>
            </li>
            <li className='flex items-center space-x-3 rtl:space-x-reverse'>
              <svg className='size-3.5 shrink-0 text-green-500 dark:text-green-400' aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 16 12'>
                <path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2'
                  d='M1 5.917 5.724 10.5 15 1.5'/>
              </svg>
              <span>Create up to 2 roles</span>
            </li>
          </ul>
        </div>
        <Button
          className='my-10 w-full border border-dark-purple bg-white py-1.5 text-dark-purple hover:bg-dark-purple hover:text-white'
          onClick={() => onSelectPlan(SubscriptionPlan.STARTER, SubscriptionType.MONTHLY)}
          disabled={loading}
        >
          Get Started (7 Days Free Trial)
        </Button>
      </div>
      <div className='rounded-lg border bg-white p-3'>
        <div className='w-fit rounded-md bg-light-purple px-2 py-1.5 text-sm text-dark-purple'>Pro</div>
        <div className='min-h-[190px]'>
          <div className='py-4 text-sm text-sub-text'>
              Designed for clubs that are interested about their player's data and want to
              fully unlock PlayerVista's capabilities.
          </div>
          <div className='py-5 text-[28px] font-medium'>
              &#8358;45,000 <span className='text-sm text-sub-text'>/month</span>
          </div>
        </div>
        <div className='min-h-[390px] border-y border-border-line py-5'>
          <ul className='space-y-4 text-left text-gray-500 dark:text-gray-400'>
            <li className='flex items-center space-x-3 rtl:space-x-reverse'>
              <svg className='size-3.5 shrink-0 text-green-500 dark:text-green-400' aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 16 12'>
                <path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2'
                  d='M1 5.917 5.724 10.5 15 1.5'/>
              </svg>
              <span>Manage up to 5 teams</span>
            </li>
            <li className='flex items-center space-x-3 rtl:space-x-reverse'>
              <svg className='size-3.5 shrink-0 text-green-500 dark:text-green-400' aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 16 12'>
                <path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2'
                  d='M1 5.917 5.724 10.5 15 1.5'/>
              </svg>
              <span>Unlimited players per team</span>
            </li>
            <li className='flex items-center space-x-3 rtl:space-x-reverse'>
              <svg className='size-3.5 shrink-0 text-green-500 dark:text-green-400' aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 16 12'>
                <path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2'
                  d='M1 5.917 5.724 10.5 15 1.5'/>
              </svg>
              <span>Manage up to 10 staff members</span>
            </li>
            <li className='flex items-center space-x-3 rtl:space-x-reverse'>
              <svg className='size-3.5 shrink-0 text-green-500 dark:text-green-400' aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 16 12'>
                <path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2'
                  d='M1 5.917 5.724 10.5 15 1.5'/>
              </svg>
              <span>Unlimited match events</span>
            </li>
            <li className='flex items-center space-x-3 rtl:space-x-reverse'>
              <svg className='size-3.5 shrink-0 text-green-500 dark:text-green-400' aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 16 12'>
                <path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2'
                  d='M1 5.917 5.724 10.5 15 1.5'/>
              </svg>
              <span>Create unlimited roles</span>
            </li>
            <li className='flex items-center space-x-3 rtl:space-x-reverse'>
              <svg className='size-3.5 shrink-0 text-green-500 dark:text-green-400' aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 16 12'>
                <path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2'
                  d='M1 5.917 5.724 10.5 15 1.5'/>
              </svg>
              <span>Live match data linked to dashboard</span>
            </li>
            <li className='flex items-center space-x-3 rtl:space-x-reverse'>
              <svg className='size-3.5 shrink-0 text-green-500 dark:text-green-400' aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 16 12'>
                <path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2'
                  d='M1 5.917 5.724 10.5 15 1.5'/>
              </svg>
              <span>Access to team & player statistics</span>
            </li>
            <li className='flex items-center space-x-3 rtl:space-x-reverse'>
              <svg className='size-3.5 shrink-0 text-green-500 dark:text-green-400' aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 16 12'>
                <path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2'
                  d='M1 5.917 5.724 10.5 15 1.5'/>
              </svg>
              <span>Premium support</span>
            </li>
            <li className='flex items-center space-x-3 rtl:space-x-reverse'>
              <svg className='size-3.5 shrink-0 text-green-500 dark:text-green-400' aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 16 12'>
                <path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2'
                  d='M1 5.917 5.724 10.5 15 1.5'/>
              </svg>
              <span>Public access to player data</span>
            </li>
          </ul>
        </div>
        <Button
          className='my-10 w-full border border-dark-purple bg-white py-1.5 text-dark-purple hover:bg-dark-purple hover:text-white'
          onClick={() => onSelectPlan(SubscriptionPlan.PRO, SubscriptionType.MONTHLY)}
          disabled={loading}
        >
          Get Started (7 Days Free Trial)</Button>
      </div>
      <div className='rounded-lg border bg-light-purple p-3'>
        <div className='w-fit rounded-md bg-dark-purple px-2 py-1.5 text-sm text-white'>Custom</div>
        <div className='min-h-[175px]'>
          <div className='py-4 text-sm text-sub-text'>
              If your club has specific requirements that go beyond our packages, this plan is for you.
              Let’s create a tailored solution that gives you exactly what you need to excel.
          </div>
          <div className='py-5 text-[28px] font-medium'>
              Let's Talk
          </div>
        </div>
        <div className='min-h-[390px] border-y border-dark-purple py-5'>
          <ul className='space-y-4 text-left text-gray-500 dark:text-gray-400'>
            <li className='flex items-center space-x-3 rtl:space-x-reverse'>
              <svg className='size-3.5 shrink-0 text-green-500 dark:text-green-400' aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 16 12'>
                <path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2'
                  d='M1 5.917 5.724 10.5 15 1.5'/>
              </svg>
              <span>Tailored solutions for your specific needs</span>
            </li>
            <li className='flex items-center space-x-3 rtl:space-x-reverse'>
              <svg className='size-3.5 shrink-0 text-green-500 dark:text-green-400' aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 16 12'>
                <path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2'
                  d='M1 5.917 5.724 10.5 15 1.5'/>
              </svg>
              <span>Unlimited players, teams, staff, matches, and roles</span>
            </li>
            <li className='flex items-center space-x-3 rtl:space-x-reverse'>
              <svg className='size-3.5 shrink-0 text-green-500 dark:text-green-400' aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 16 12'>
                <path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2'
                  d='M1 5.917 5.724 10.5 15 1.5'/>
              </svg>
              <span>Access to PlayerVista-trained reporters</span>
            </li>
            <li className='flex items-center space-x-3 rtl:space-x-reverse'>
              <svg className='size-3.5 shrink-0 text-green-500 dark:text-green-400' aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 16 12'>
                <path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2'
                  d='M1 5.917 5.724 10.5 15 1.5'/>
              </svg>
              <span>Priority support</span>
            </li>
            <li className='flex items-center space-x-3 rtl:space-x-reverse'>
              <svg className='size-3.5 shrink-0 text-green-500 dark:text-green-400' aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 16 12'>
                <path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2'
                  d='M1 5.917 5.724 10.5 15 1.5'/>
              </svg>
              <span>Custom pricing based on your requirements</span>
            </li>
          </ul>
        </div>
        <Button className='my-10 w-full bg-dark-purple py-1.5 text-white'>Book a Call</Button>
      </div>
    </div>
  )
}

function YearlyPlan() {
  const [loading, setLoading] = useState(false)

  async function onSelectPlan(plan: SubscriptionPlan, type: SubscriptionType) {
    setLoading(true)
    try {
      const response = await selectSubscription({
        subscriptionPlan: plan,
        planPeriod: type,
      })
      if (response.redirectUrl) {
        window.location.href = response.redirectUrl
      } else {
        console.error('Unexpected error: redirect URL not provided.')
      }
    } catch (err) {
      console.error('An unexpected error occurred. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='mx-auto grid w-4/5 grid-cols-3 gap-5'>
      <div className='rounded-lg border bg-white p-3'>
        <div className='w-fit rounded-md bg-light-purple px-2 py-1.5 text-sm text-dark-purple'>Starter</div>
        <div className='min-h-[190px]'>
          <div className='py-4 text-sm text-sub-text'>
            Designed for clubs with limited resources but the desire to manage their team more
            effectively
          </div>
          <div className='w-fit rounded-lg bg-at-green px-2 py-1.5 text-xs font-medium text-white'>Save 11.11%</div>
          <div className='pb-5 pt-1 text-[28px] font-medium'>
            &#8358;160,000 <span className='text-sm text-sub-text'>/year</span>
          </div>
        </div>
        <div className='min-h-[390px] border-y border-border-line py-5'>
          <ul className='space-y-4 text-left text-gray-500 dark:text-gray-400'>
            <li className='flex items-center space-x-3 rtl:space-x-reverse'>
              <svg className='size-3.5 shrink-0 text-green-500 dark:text-green-400' aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 16 12'>
                <path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2'
                  d='M1 5.917 5.724 10.5 15 1.5'/>
              </svg>
              <span> Manage up to 15 players </span>
            </li>
            <li className='flex items-center space-x-3 rtl:space-x-reverse'>
              <svg className='size-3.5 shrink-0 text-green-500 dark:text-green-400' aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 16 12'>
                <path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2'
                  d='M1 5.917 5.724 10.5 15 1.5'/>
              </svg>
              <span>Manage 1 team</span>
            </li>
            <li className='flex items-center space-x-3 rtl:space-x-reverse'>
              <svg className='size-3.5 shrink-0 text-green-500 dark:text-green-400' aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 16 12'>
                <path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2'
                  d='M1 5.917 5.724 10.5 15 1.5'/>
              </svg>
              <span>2 staff members management</span>
            </li>
            <li className='flex items-center space-x-3 rtl:space-x-reverse'>
              <svg className='size-3.5 shrink-0 text-green-500 dark:text-green-400' aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 16 12'>
                <path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2'
                  d='M1 5.917 5.724 10.5 15 1.5'/>
              </svg>
              <span>Create up to 4 matches per month</span>
            </li>
            <li className='flex items-center space-x-3 rtl:space-x-reverse'>
              <svg className='size-3.5 shrink-0 text-green-500 dark:text-green-400' aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 16 12'>
                <path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2'
                  d='M1 5.917 5.724 10.5 15 1.5'/>
              </svg>
              <span>Create up to 2 roles</span>
            </li>
          </ul>
        </div>
        <Button
          className='my-10 w-full border border-dark-purple bg-white py-1.5 text-dark-purple hover:bg-dark-purple hover:text-white'
          onClick={() => onSelectPlan(SubscriptionPlan.STARTER, SubscriptionType.YEARLY)}
          disabled={loading}
        >
          Get Started (7 Days Free Trial)
        </Button>
      </div>
      <div className='rounded-lg border bg-white p-3'>
        <div className='w-fit rounded-md bg-light-purple px-2 py-1.5 text-sm text-dark-purple'>Pro</div>
        <div className='min-h-[190px]'>
          <div className='py-4 text-sm text-sub-text'>
            Designed for clubs that are interested about their player's data and want to
            fully unlock PlayerVista's capabilities.
          </div>
          <div className='w-fit rounded-lg bg-at-green px-2 py-1.5 text-xs font-medium text-white'>Save 13.89%</div>
          <div className='pb-5 pt-1 text-[28px] font-medium'>
            &#8358;465,000 <span className='text-sm text-sub-text'>/year</span>
          </div>
        </div>
        <div className='min-h-[390px] border-y border-border-line py-5'>
          <ul className='space-y-4 text-left text-gray-500 dark:text-gray-400'>
            <li className='flex items-center space-x-3 rtl:space-x-reverse'>
              <svg className='size-3.5 shrink-0 text-green-500 dark:text-green-400' aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 16 12'>
                <path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2'
                  d='M1 5.917 5.724 10.5 15 1.5'/>
              </svg>
              <span>Manage up to 5 teams</span>
            </li>
            <li className='flex items-center space-x-3 rtl:space-x-reverse'>
              <svg className='size-3.5 shrink-0 text-green-500 dark:text-green-400' aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 16 12'>
                <path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2'
                  d='M1 5.917 5.724 10.5 15 1.5'/>
              </svg>
              <span>Unlimited players per team</span>
            </li>
            <li className='flex items-center space-x-3 rtl:space-x-reverse'>
              <svg className='size-3.5 shrink-0 text-green-500 dark:text-green-400' aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 16 12'>
                <path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2'
                  d='M1 5.917 5.724 10.5 15 1.5'/>
              </svg>
              <span>Manage up to 10 staff members</span>
            </li>
            <li className='flex items-center space-x-3 rtl:space-x-reverse'>
              <svg className='size-3.5 shrink-0 text-green-500 dark:text-green-400' aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 16 12'>
                <path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2'
                  d='M1 5.917 5.724 10.5 15 1.5'/>
              </svg>
              <span>Unlimited match events</span>
            </li>
            <li className='flex items-center space-x-3 rtl:space-x-reverse'>
              <svg className='size-3.5 shrink-0 text-green-500 dark:text-green-400' aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 16 12'>
                <path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2'
                  d='M1 5.917 5.724 10.5 15 1.5'/>
              </svg>
              <span>Create unlimited roles</span>
            </li>
            <li className='flex items-center space-x-3 rtl:space-x-reverse'>
              <svg className='size-3.5 shrink-0 text-green-500 dark:text-green-400' aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 16 12'>
                <path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2'
                  d='M1 5.917 5.724 10.5 15 1.5'/>
              </svg>
              <span>Live match data linked to dashboard</span>
            </li>
            <li className='flex items-center space-x-3 rtl:space-x-reverse'>
              <svg className='size-3.5 shrink-0 text-green-500 dark:text-green-400' aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 16 12'>
                <path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2'
                  d='M1 5.917 5.724 10.5 15 1.5'/>
              </svg>
              <span>Access to team & player statistics</span>
            </li>
            <li className='flex items-center space-x-3 rtl:space-x-reverse'>
              <svg className='size-3.5 shrink-0 text-green-500 dark:text-green-400' aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 16 12'>
                <path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2'
                  d='M1 5.917 5.724 10.5 15 1.5'/>
              </svg>
              <span>Premium support</span>
            </li>
            <li className='flex items-center space-x-3 rtl:space-x-reverse'>
              <svg className='size-3.5 shrink-0 text-green-500 dark:text-green-400' aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 16 12'>
                <path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2'
                  d='M1 5.917 5.724 10.5 15 1.5'/>
              </svg>
              <span>Public access to player data</span>
            </li>
          </ul>
        </div>
        <Button
          className='my-10 w-full border border-dark-purple bg-white py-1.5 text-dark-purple hover:bg-dark-purple hover:text-white'
          onClick={() => onSelectPlan(SubscriptionPlan.PRO, SubscriptionType.YEARLY)}
          disabled={loading}
        >
          Get Started (7 Days Free Trial)
        </Button>
      </div>
      <div className='rounded-lg border bg-light-purple p-3'>
        <div className='w-fit rounded-md bg-dark-purple px-2 py-1.5 text-sm text-white'>Custom</div>
        <div className='min-h-[175px]'>
          <div className='py-4 text-sm text-sub-text'>
            If your club has specific requirements that go beyond our packages, this plan is for you.
            Let’s create a tailored solution that gives you exactly what you need to excel.
          </div>
          <div className='py-5 text-[28px] font-medium'>
            Let's Talk
          </div>
        </div>
        <div className='min-h-[390px] border-y border-dark-purple py-5'>
          <ul className='space-y-4 text-left text-gray-500 dark:text-gray-400'>
            <li className='flex items-center space-x-3 rtl:space-x-reverse'>
              <svg className='size-3.5 shrink-0 text-green-500 dark:text-green-400' aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 16 12'>
                <path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2'
                  d='M1 5.917 5.724 10.5 15 1.5'/>
              </svg>
              <span>Tailored solutions for your specific needs</span>
            </li>
            <li className='flex items-center space-x-3 rtl:space-x-reverse'>
              <svg className='size-3.5 shrink-0 text-green-500 dark:text-green-400' aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 16 12'>
                <path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2'
                  d='M1 5.917 5.724 10.5 15 1.5'/>
              </svg>
              <span>Unlimited players, teams, staff, matches, and roles</span>
            </li>
            <li className='flex items-center space-x-3 rtl:space-x-reverse'>
              <svg className='size-3.5 shrink-0 text-green-500 dark:text-green-400' aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 16 12'>
                <path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2'
                  d='M1 5.917 5.724 10.5 15 1.5'/>
              </svg>
              <span>Access to PlayerVista-trained reporters</span>
            </li>
            <li className='flex items-center space-x-3 rtl:space-x-reverse'>
              <svg className='size-3.5 shrink-0 text-green-500 dark:text-green-400' aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 16 12'>
                <path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2'
                  d='M1 5.917 5.724 10.5 15 1.5'/>
              </svg>
              <span>Priority support</span>
            </li>
            <li className='flex items-center space-x-3 rtl:space-x-reverse'>
              <svg className='size-3.5 shrink-0 text-green-500 dark:text-green-400' aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 16 12'>
                <path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2'
                  d='M1 5.917 5.724 10.5 15 1.5'/>
              </svg>
              <span>Custom pricing based on your requirements</span>
            </li>
          </ul>
        </div>
        <Button className='my-10 w-full bg-dark-purple py-1.5 text-white'>Book a Call</Button>
      </div>
    </div>
  )
}
