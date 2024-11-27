import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form.tsx'
import classnames from 'classnames'
import { Control, FieldPath, FieldValues } from 'react-hook-form'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.tsx'
import { CalendarIcon } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar.tsx'
import { Button } from '@/components/ui/button.tsx'
import { format } from 'date-fns'

export interface DatePickerFieldProps<
  TName extends FieldPath<TFieldValues>,
  TFieldValues extends FieldValues = FieldValues,
> {
  control: Control<TFieldValues> | Control<TFieldValues, never>;
  name: TName;
  label?: string;
  placeholder?: string;
  description?: string;
  className?: string;
  inputClassName?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
}

export default function DatePickerField<
  TName extends FieldPath<TFieldValues>,
  TFieldValues extends FieldValues = FieldValues,
>({
  control,
  name,
  label,
  description,
  inputClassName,
}: DatePickerFieldProps<TName, TFieldValues>) {
  return (
    <FormField
      control={control as Control<TFieldValues>}
      name={name}
      render={({ field }) => (
        <FormItem className='flex flex-col'>
          {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
          <FormControl>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    id='date'
                    variant={'outline'}
                    className={classnames(
                      'w-64 h-10 justify-start text-left font-normal',
                      !field.value && 'text-muted-foreground', inputClassName,
                    )}
                  >
                    <CalendarIcon />
                    {field.value?.from ? (
                      field.value.to ? (
                        <>
                          {format(field.value.from, 'LLL dd, y')} -{' '}
                          {format(field.value.to, 'LLL dd, y')}
                        </>
                      ) : (
                        format(field.value.from, 'LLL dd, y')
                      )
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className='w-auto p-0' align='start'>
                <Calendar
                  mode='range'
                  defaultMonth={field.value?.from}
                  selected={field.value}
                  onSelect={field.onChange}
                  numberOfMonths={2}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
