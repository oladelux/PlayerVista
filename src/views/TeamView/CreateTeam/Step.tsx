import { Children, PropsWithChildren, useState } from 'react'

import { Form, Formik, FormikConfig, FormikValues } from 'formik'

import LoadingButton from '@/component/LoadingButton/LoadingButton.tsx'

import { FormikStepProps, ProgressBar } from './ProgressBar'

export const FormikStep = ({ children }: FormikStepProps) => {
  return { children }
}

export const FormikStepper = ({
  children,
  ...props
}: PropsWithChildren<FormikConfig<FormikValues>>) => {
  const childrenArray = Children.toArray(children) as React.ReactElement<FormikStepProps>[]
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
    <Formik
      {...props}
      onSubmit={async (values, helpers) => {
        if (isLastStep()) {
          await props.onSubmit(values, helpers)
          setCompleted(true)
        } else {
          setStep(s => s + 1)
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form autoComplete='off' className='Formik-stepper'>
          <ProgressBar step={step} childrenArray={childrenArray} completed={completed} />
          {currentChild}
          <div className='Formik-stepper__btn'>
            {step > 0 ? (
              <LoadingButton
                isLoading={isSubmitting}
                className='border border-dark-purple bg-white text-dark-purple hover:bg-white'
                type='button'
                onClick={() => setStep(s => s - 1)}
              >
                Back
              </LoadingButton>
            ) : (
              <div></div>
            )}
            <LoadingButton
              isLoading={isSubmitting}
              className='bg-dark-purple hover:bg-dark-purple'
              type='submit'
            >
              {isLastStep() && isUpdatePage() ? 'Update' : isLastStep() ? 'Submit' : 'Next'}
            </LoadingButton>
          </div>
        </Form>
      )}
    </Formik>
  )
}
