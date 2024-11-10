import { ReactNode } from 'react'
import { Control, FieldPath, FieldValues } from 'react-hook-form'
import { FormField, FormItem, FormMessage } from '@/components/ui/form.tsx'
import { Checkbox } from '@/components/ui/checkbox.tsx'

interface CheckboxFormFieldProps<
  TName extends FieldPath<TFieldValues>,
  TFieldValues extends FieldValues = FieldValues,
> {
  control: Control<TFieldValues> | Control<TFieldValues, never>;
  name: TName;
  className?: string;
  disabled?: boolean;
  children?: ReactNode;
  value?: string;
  defaultChecked?: boolean;
}

export default function CheckboxFormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  disabled,
  children,
  value,
}: CheckboxFormFieldProps<TName, TFieldValues>) {
  return (
    <FormField
      control={control as Control<TFieldValues>}
      name={name}
      render={({ field }) => {
        const isChecked = field.value.includes(value) || false

        const handleCheckedChange = (checked: boolean) => {
          const updatedPermissions = checked
            ? [...(field.value || []), value]
            : field.value?.filter((perm: string) => perm !== value) || []

          field.onChange(updatedPermissions)
        }
        return (
          <FormItem>
            <div className='flex items-start gap-2'>
              <Checkbox
                onCheckedChange={handleCheckedChange}
                checked={isChecked}
                disabled={disabled}
                value={value}
              />
              <div className='text-sm'>{children}</div>
            </div>
            <FormMessage/>
          </FormItem>
        )
      }}
    />
  )
}
