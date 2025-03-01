import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'

import { InputField } from '../InputField'

describe('InputField renders correctly', () => {
  it('without errors', () => {
    render(
      <InputField
        placeholder='Test Placeholder'
        value=''
        onChange={() => {}}
      />,
    )
    // Ensure the component renders without errors
    expect(screen.getByPlaceholderText('Test Placeholder')).toBeInTheDocument()
  })

  it('displays an error message when provided with an error', () => {
    render(
      <InputField
        placeholder='Test Placeholder'
        value=''
        onChange={() => {}}
        error='This field is required'
      />,
    )
    // Ensure the error message is displayed
    expect(screen.getByText('This field is required')).toBeInTheDocument()
  })

  it('calls the onChange callback when the input value changes', () => {
    const handleChange = jest.fn()
    render(
      <InputField
        placeholder='Test Placeholder'
        value=''
        onChange={handleChange}
      />,
    )
    // Simulate input value change
    fireEvent.change(screen.getByPlaceholderText('Test Placeholder'), {
      target: { value: 'New Value' },
    })
    // Ensure the onChange callback is called
    expect(handleChange).toHaveBeenCalledWith(expect.any(Object))
  })
})
