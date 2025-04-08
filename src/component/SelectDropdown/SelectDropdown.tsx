import { FC, useState } from 'react'

import classnames from 'classnames'

import './SelectDropdown.scss'

type SelectButtonProps = {
  options: string[]
  classNames?: string
}

export const SelectDropdown: FC<SelectButtonProps> = ({ options, classNames }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState(options[0])

  const handleButtonClick = () => {
    setIsOpen(!isOpen)
  }

  const onSelectOption = async (val: string) => {
    await setSelectedOption(val)
    setIsOpen(false)
  }

  return (
    <div className={classnames(`select-dropdown ${classNames}`)}>
      <button className='select-dropdown__btn' type='button' onClick={handleButtonClick}>
        {selectedOption}
        <svg
          className='select-dropdown__btn-arrow'
          aria-hidden='true'
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 10 6'
        >
          <path
            stroke='currentColor'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='m1 1 4 4 4-4'
          />
        </svg>
      </button>
      {isOpen && (
        <div className='select-dropdown__options'>
          {options.map(option => (
            <button
              onClick={() => onSelectOption(option)}
              key={option}
              className='select-dropdown__options-btn'
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
