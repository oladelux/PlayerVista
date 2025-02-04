import { StepConnector, stepConnectorClasses } from '@mui/material'
import { styled } from '@mui/material/styles'

export const ColorLibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.root}`]: {
    left: 'calc(-50% + 35px)',
    right: 'calc(50% + 35px)',
  },
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: 'rgb(55, 0, 60)',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: 'rgb(55, 0, 60)',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor:
      theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
    borderRadius: 1,
  },
}))

export const ColorLibStepIconRoot = styled('div')<{
  ownerState: { completed?: boolean; active?: boolean };
}>(({ ownerState }) => ({
  backgroundColor: 'rgba(170, 172, 175, 0.14)',
  zIndex: 1,
  color: 'rgb(170, 172, 175)',
  width: 50,
  height: 50,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  ...(ownerState.active && {
    backgroundColor: 'rgb(207, 194, 208)',
    color: 'rgb(55, 0, 60)',
  }),
  ...(ownerState.completed && {
    backgroundColor: 'rgba(55, 0, 60, 0.24)',
    color: 'rgb(55, 0, 60)',
  }),
}))
