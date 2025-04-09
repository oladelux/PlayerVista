import * as React from 'react'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { DayPicker, MonthChangeEventHandler } from 'react-day-picker'

import { buttonVariants } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState<Date>(props.defaultMonth || new Date())

  // Handler for month changes
  const handleMonthChange: MonthChangeEventHandler = month => {
    setCurrentMonth(month)
    props.onMonthChange?.(month)
  }

  // Generate years (10 years back, 10 years ahead)
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 46 }, (_, i) => currentYear - 45 + i)

  // Generate all months
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]

  // Handle year selection
  const handleYearSelect = (year: string) => {
    const newDate = new Date(currentMonth)
    newDate.setFullYear(parseInt(year))
    handleMonthChange(newDate)
  }

  // Handle month selection
  const handleMonthSelect = (monthIndex: string) => {
    const newDate = new Date(currentMonth)
    newDate.setMonth(parseInt(monthIndex))
    handleMonthChange(newDate)
  }

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-3 pointer-events-auto', className)}
      classNames={{
        months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
        month: 'space-y-4',
        caption: 'flex justify-center pt-1 relative items-center gap-1',
        caption_label: 'hidden', // Hide default caption label
        nav: 'space-x-1 flex items-center',
        nav_button: cn(
          buttonVariants({ variant: 'outline' }),
          'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
        ),
        nav_button_previous: 'absolute left-1',
        nav_button_next: 'absolute right-1',
        table: 'w-full border-collapse space-y-1',
        head_row: 'flex',
        head_cell: 'text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]',
        row: 'flex w-full mt-2',
        cell: 'h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
        day: cn(
          buttonVariants({ variant: 'ghost' }),
          'h-9 w-9 p-0 font-normal aria-selected:opacity-100',
        ),
        day_range_end: 'day-range-end',
        day_selected:
          'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
        day_today: 'bg-accent text-accent-foreground',
        day_outside:
          'day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30',
        day_disabled: 'text-muted-foreground opacity-50',
        day_range_middle: 'aria-selected:bg-accent aria-selected:text-accent-foreground',
        day_hidden: 'invisible',
        ...classNames,
      }}
      components={{
        IconLeft: () => <ChevronLeft className='size-4' />,
        IconRight: () => <ChevronRight className='size-4' />,
        Caption: ({ displayMonth }) => (
          <div className='relative flex w-full items-center justify-center gap-1 py-2'>
            {/* Month selector */}
            <Select value={displayMonth.getMonth().toString()} onValueChange={handleMonthSelect}>
              <SelectTrigger className='h-7 w-[110px] text-xs font-medium'>
                <SelectValue>{months[displayMonth.getMonth()]}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {months.map((month, index) => (
                  <SelectItem key={month} value={index.toString()} className='text-sm'>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Year selector */}
            <Select value={displayMonth.getFullYear().toString()} onValueChange={handleYearSelect}>
              <SelectTrigger className='h-7 w-[80px] text-xs font-medium'>
                <SelectValue>{displayMonth.getFullYear()}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {years.map(year => (
                  <SelectItem key={year} value={year.toString()} className='text-sm'>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Today button */}
            <button
              onClick={() => handleMonthChange(new Date())}
              className={cn(
                buttonVariants({ variant: 'ghost', size: 'sm' }),
                'h-7 text-xs px-2 rounded-sm ml-auto',
              )}
              title='Go to today'
            >
              Today
            </button>
          </div>
        ),
      }}
      month={currentMonth}
      onMonthChange={handleMonthChange}
      {...props}
    />
  )
}
Calendar.displayName = 'Calendar'

export { Calendar }
