import classnames from 'classnames'
import React, { HTMLInputAutoCompleteAttribute, HTMLInputTypeAttribute } from 'react'
import { Control, FieldPath, FieldValues } from 'react-hook-form'

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form.tsx'
import { Input } from '@/components/ui/input.tsx'


interface InputFormFieldProps<
  TName extends FieldPath<TFieldValues>,
  TFieldValues extends FieldValues = FieldValues,
> {
  control: Control<TFieldValues> | Control<TFieldValues, never>;
  name: TName;
  label?: string;
  placeholder: string;
  type?: HTMLInputTypeAttribute;
  description?: string;
  className?: string;
  autoComplete?: HTMLInputAutoCompleteAttribute;
  inputClassName?: string;
  disabled?: boolean;
  readOnly?: boolean;
}

export default function InputFormField<
  TName extends FieldPath<TFieldValues>, TFieldValues extends FieldValues = FieldValues>(
  props: InputFormFieldProps<TName, TFieldValues>,
) {
  return (
    <FormField
      control={props.control as Control<TFieldValues>}
      name={props.name}
      render={({ field }) => (
        <FormItem className='flex flex-col'>
          {props.label && <FormLabel htmlFor={props.name}>{props.label}</FormLabel>}
          <FormControl>
            <Input
              {...field}
              id={props.name}
              className={classnames('w-full', props.inputClassName)}
              placeholder={props.placeholder}
              type={props.type}
              autoComplete={props.autoComplete}
              disabled={props.disabled}
              readOnly={props.readOnly}
            />
          </FormControl>
          {props.description && <FormDescription>{props.description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
