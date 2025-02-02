import AccountBoxIcon from '@mui/icons-material/AccountBox'
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox'
import InfoIcon from '@mui/icons-material/Info'
import { Step, StepIconProps, StepLabel, Stepper } from '@mui/material'
import { FormikConfig, FormikValues } from 'formik'
import React, { FC } from 'react'

import { ColorLibConnector, ColorLibStepIconRoot } from '../../../services/progressBar'

import './CreateTeam.scss'

export interface FormikStepProps extends Pick<FormikConfig<FormikValues>, 'children' | 'validationSchema'> {
  label: string
  title?: string
}

type ProgressBarProps = {
  childrenArray: React.ReactElement<FormikStepProps, string | React.JSXElementConstructor<any>>[]
  step: number
  completed: boolean
}

function ColorLibStepIcon(props: StepIconProps) {
  const { active, completed, className } = props
  const icons: { [index: string]: React.ReactElement } = {
    1: <InfoIcon />,
    2: <AccountBoxIcon />,
    3: <IndeterminateCheckBoxIcon />,
  }

  return (
    <ColorLibStepIconRoot ownerState={{ completed, active }} className={className}>
      {icons[String(props.icon)]}
    </ColorLibStepIconRoot>
  )
}

export const ProgressBar: FC<ProgressBarProps> = props => {
  return (
    <Stepper className='Stepper' alternativeLabel activeStep={props.step} connector={<ColorLibConnector />}>
      {props.childrenArray.map((child, index) => (
        <Step key={child.props.label} className='Stepper__Step' completed={props.step > index || props.completed} >
          <StepLabel className='Stepper__Step-label' StepIconComponent={ColorLibStepIcon}>{child.props.label}</StepLabel>
        </Step>
      ))}
    </Stepper>
  )
}
