import { Field } from 'formik'
import {ChangeEvent, FC} from 'react'

type SelectPlayerPositionProps = {
  /**
   * The className for information block
   */
  className?: string,
  /**
   * The name of this select box
   */
  name: string
  /**
   * Function which is called if the value was changed.
   */
  onChange?: (event: ChangeEvent<HTMLSelectElement>) => void
  value?: string
}

export const SelectPlayerPosition:FC<SelectPlayerPositionProps> = props => {
  return (
    <select
      className={props.className}
      name={props.name}
      onChange={props.onChange}
      value={props.value}
    >
      <option>Select Position</option>
      <option value='GK'>GK</option>
      <option value='CB'>CB</option>
      <option value='RB'>RB</option>
      <option value='LB'>LB</option>
      <option value='WRB'>WRB</option>
      <option value='WLB'>WLB</option>
      <option value='CDM'>CDM</option>
      <option value='CM'>CM</option>
      <option value='RM'>RM</option>
      <option value='LM'>LM</option>
      <option value='CAM'>CAM</option>
      <option value='ST'>ST</option>
      <option value='CF'>CF</option>
    </select>
  )
}

export const SelectPlayerPositionWithFormik:FC<SelectPlayerPositionProps> = props => {
  return (
    <Field
      className={props.className}
      as='select'
      name={props.name}

    >
      <option>Select Position</option>
      <option value='GK'>GK</option>
      <option value='CB'>CB</option>
      <option value='RB'>RB</option>
      <option value='LB'>LB</option>
      <option value='WRB'>WRB</option>
      <option value='WLB'>WLB</option>
      <option value='CDM'>CDM</option>
      <option value='CM'>CM</option>
      <option value='RM'>RM</option>
      <option value='LM'>LM</option>
      <option value='CAM'>CAM</option>
      <option value='ST'>ST</option>
      <option value='CF'>CF</option>
    </Field>
  )
}
