import { useField, useFormikContext } from 'formik'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs'

export const CustomFormikDatePicker = ({ ...props }) => {
  const [field] = useField(props.field)
  const { setFieldValue } = useFormikContext()

  return <DatePicker {...props} value={dayjs(field.value)} onChange={(val) => setFieldValue(field.name, val)} />
}
