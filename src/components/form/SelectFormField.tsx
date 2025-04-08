import classnames from 'classnames'
import { Control, FieldPath, FieldValues } from 'react-hook-form'

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form.tsx'

export interface SelectFormFieldProps<
  TName extends FieldPath<TFieldValues>,
  TFieldValues extends FieldValues = FieldValues,
> {
  control: Control<TFieldValues> | Control<TFieldValues, never>
  name: TName
  label?: string
  placeholder?: string
  options: { value: string; label: string }[]
  description?: string
  className?: string
  inputClassName?: string
  disabled?: boolean
  onChange?: (value: string) => void
}

export default function SelectFormField<
  TName extends FieldPath<TFieldValues>,
  TFieldValues extends FieldValues = FieldValues,
>({
  control,
  name,
  label,
  options,
  description,
  inputClassName,
  onChange,
  disabled,
}: SelectFormFieldProps<TName, TFieldValues>) {
  return (
    <FormField
      control={control as Control<TFieldValues>}
      name={name}
      render={({ field }) => (
        <FormItem className='flex flex-col'>
          {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
          <FormControl>
            <select
              {...field}
              className={classnames(
                'focus-visible:ring-offset-dark-purple/50 border border-border-line capitalize disabled:text-muted-foreground' +
                  ' ring-offset-at-brand bg-background placeholder:text-muted-foreground flex h-10 w-full' +
                  ' cursor-pointer items-center justify-between rounded-md pl-3 pr-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-offset-0 disabled:cursor-not-allowed [&>span]:line-clamp-1',
                !field.value && 'text-muted-foreground hover:text-muted-foreground',
                inputClassName,
              )}
              value={field.value ?? ''}
              onChange={e => {
                field.onChange(e)
                onChange?.(e.target.value)
              }}
              disabled={disabled}
            >
              {options.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
