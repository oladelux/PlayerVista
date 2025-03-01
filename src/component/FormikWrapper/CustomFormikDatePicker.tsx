import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs'
import { useField, useFormikContext } from 'formik'

export const CustomFormikDatePicker = ({ ...props }) => {
  const [field] = useField(props.field)
  const { setFieldValue } = useFormikContext()

  return <DatePicker {...props} value={dayjs(field.value)} onChange={(val) => setFieldValue(field.name, val)} />
}
