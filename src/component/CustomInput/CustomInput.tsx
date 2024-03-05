import React, {FC} from "react";
import {FieldProps} from "formik";
import {Checkbox, NumberInput, NumberInputField} from "@chakra-ui/react";

export const CheckboxComponent: FC<FieldProps> = ({
   field, // { name, value, onChange, onBlur }
   form,// also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
   ...props
  }) => (
    <Checkbox {...field} {...props} name='publish'>Check to submit data</Checkbox>
)
