import { Form, Formik, FormikConfig, FormikValues } from 'formik'
import React, { PropsWithChildren, useState } from 'react'
import { FormikStepProps, ProgressBar } from './ProgressBar'
import { Button } from '../../../component/Button/Button'

export const FormikStep = ({ children }: FormikStepProps) => {
  return <>{children}</>
}

export const FormikStepper =
  ({ children, ...props }: PropsWithChildren<FormikConfig<FormikValues>>) => {

    const childrenArray = React.Children.toArray(children) as React.ReactElement<FormikStepProps>[]
    const [step, setStep] = useState(0)
    const currentChild = childrenArray[step]
    const [completed, setCompleted] = useState(false)

    function isUpdatePage() {
      return childrenArray.some(item => item.props.title === 'update')
    }

    function isLastStep() {
      return step === childrenArray.length - 1
    }

    return (
      <Formik {...props} onSubmit={async(values, helpers) => {
        if(isLastStep()) {
          await props.onSubmit(values, helpers)
          setCompleted(true)
        } else {
          setStep(s => s + 1)
        }
      }}>
        {({ isSubmitting }) => (
          <Form autoComplete='off' className='Formik-stepper'>
            <ProgressBar step={step} childrenArray={childrenArray} completed={completed} />
            { currentChild }
            <div className='Formik-stepper__btn'>
              {step > 0 ?
                <Button
                  className='Formik-stepper__btn--back'
                  disabled={isSubmitting}
                  type='button'
                  onClick={() => setStep(s => s - 1)}
                >Back</Button> : <div></div>
              }
              <Button
                className='Formik-stepper__btn--submit'
                disabled={isSubmitting}
                type='submit'
              >
                {isLastStep() && isUpdatePage() ? 'Update' : isLastStep() ? 'Submit' : 'Next'}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    )
  }
