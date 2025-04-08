import { ReactNode } from 'react'

import { Control, FieldPath, FieldValues } from 'react-hook-form'

import { Checkbox } from '@/components/ui/checkbox.tsx'
import { FormField, FormItem, FormMessage } from '@/components/ui/form.tsx'

interface SingleCheckboxFormFieldProps<
  TName extends FieldPath<TFieldValues>,
  TFieldValues extends FieldValues = FieldValues,
> {
  control: Control<TFieldValues> | Control<TFieldValues, never>
  name: TName
  className?: string
  disabled?: boolean
  children?: ReactNode
}

export default function SingleCheckboxFormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ control, name, disabled, children }: SingleCheckboxFormFieldProps<TName, TFieldValues>) {
  return (
    <FormField
      control={control as Control<TFieldValues>}
      name={name}
      render={({ field }) => (
        <FormItem>
          <div className='flex items-start gap-2'>
            <Checkbox
              onCheckedChange={e => field.onChange(e)}
              checked={field.value || false}
              disabled={disabled}
            />
            <div className='text-sm'>{children}</div>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
