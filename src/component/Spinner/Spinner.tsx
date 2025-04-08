import { FC } from 'react'

import classnames from 'classnames'

import SpinnerIcon from '../../assets/images/icons/spinner-icon.svg'

import './Spinner.scss'

type SpinnerProps = {
  /**
   * The class assignments to the component
   */
  className?: string
  /**
   * The test id is used for testing the component with the `@testing-library/react` library.
   * Check docs: https://testing-library.com/docs/queries/bytestid/
   */
  dataTestId?: string
}

export const Spinner: FC<SpinnerProps> = ({ dataTestId = '', className = '' }) => {
  return (
    <div className={classnames('spinner', className)} data-testid={dataTestId}>
      <img src={SpinnerIcon} className='spinner__media' alt='Icon of loading' />
    </div>
  )
}
