import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'

import { Popup } from '../Popup'

describe('Popup renders correctly', () => {
  it('without errors and displays content', () => {
    render(
      <Popup onClose={() => {}}>
        <div>Popup Content</div>
      </Popup>,
    )

    // Ensure the component renders without errors
    expect(screen.getByText('Popup Content')).toBeInTheDocument()
  })

  it('calls onClose when the overlay is clicked', () => {
    const onClose = jest.fn()
    render(<Popup onClose={onClose}/>)

    // Simulate a click on the overlay
    fireEvent.click(screen.getByRole('button'))

    // Ensure onClose is called
    expect(onClose).toHaveBeenCalled()
  })

  it('calls onClose when the Escape key is pressed', () => {
    const onClose = jest.fn()
    render(<Popup onClose={onClose}/>)

    // Simulate an Escape key press event
    fireEvent.keyDown(document.body, { key: 'Escape' })

    // Ensure onClose is called
    expect(onClose).toHaveBeenCalled()
  })

  it('does not call onClose when isCloseFunctionDisabled is true', () => {
    const onClose = jest.fn()
    render(<Popup onClose={onClose} isCloseFunctionDisabled={true}/>)

    // Simulate a click on the overlay
    fireEvent.click(screen.getByRole('button'))

    // Simulate an Escape key press event
    fireEvent.keyDown(document.body, { key: 'Escape' })

    // Ensure onClose is not called
    expect(onClose).not.toHaveBeenCalled()
  })
})
