import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import { Button } from '../Button'

describe('Button renders correctly with `type`', () => {
  it('passing `type=submit` works correctly', () => {
    render(<Button type='submit'/>)

    // The button has the `submit` type
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit')
  })

  it('passing `type=button` works correctly', () => {
    render(<Button type='button'/>)

    // The button has the `button` type
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button')
  })
})

describe('Button renders correctly with `onClick`', () => {
  it('`onClick` prop works correctly', () => {
    const onClick = jest.fn()

    render(<Button onClick={onClick}/>)

    const button = screen.getByRole('button')

    // By default, the click function is not called
    expect(onClick).not.toHaveBeenCalled()

    fireEvent.click(button)

    // After click on the button the function has been called once
    expect(onClick).toHaveBeenCalled()
    expect(onClick).toHaveBeenCalledTimes(1)

    fireEvent.click(button)
    // After one more click on the button the function has been called twice
    expect(onClick).toHaveBeenCalledTimes(2)
  })
})

describe('Button renders correctly with `disabled`', () => {
  it('passing `disabled=true` works correctly', () => {
    const onClick = jest.fn()

    render(<Button disabled={true} onClick={onClick}/>)

    const button = screen.getByRole('button')

    // The button is disabled
    expect(button).toHaveAttribute('disabled', '')
    // The button has the special class
    expect(button).toHaveClass('button__disabled')

    // By default, the click function is not called
    expect(onClick).not.toHaveBeenCalled()

    fireEvent.click(button)

    // Even after click the function is not called because the button is disabled
    expect(onClick).not.toHaveBeenCalled()
  })

  it('not passing `disabled` works correctly', () => {
    const onClick = jest.fn()

    render(<Button onClick={onClick}/>)

    const button = screen.getByRole('button')

    // The button is not disabled
    expect(button).not.toHaveAttribute('disabled', '')
    // The button does not have the special class
    expect(button).not.toHaveClass('button__disabled')

    // By default, the click function is not called
    expect(onClick).not.toHaveBeenCalled()

    fireEvent.click(button)

    // After click the function is called because the button is not disabled
    expect(onClick).toHaveBeenCalled()
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})

describe('Button renders correctly with `children`', () => {
  it('passing `children` works correctly', () => {
    render(<Button>content</Button>)

    // The button uses the same value as a child element
    expect(screen.getByText(/content/i)).toBeInTheDocument()
  })
})
