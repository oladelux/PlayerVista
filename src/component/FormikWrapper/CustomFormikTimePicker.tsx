import { useField, useFormikContext } from 'formik'
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker'
import dayjs from 'dayjs'

export const CustomFormikTimePicker = ({ ...props }) => {
  const [field] = useField(props.field)
  const { setFieldValue } = useFormikContext()

  return <MobileTimePicker {...props} value={dayjs(field.value)} onChange={(val) => setFieldValue(field.name, val)} />
}
