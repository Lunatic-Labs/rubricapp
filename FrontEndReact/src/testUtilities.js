import { screen, fireEvent } from '@testing-library/react';

export function clickElementWithAriaLabel(ariaLabel) {
    fireEvent.click(screen.getByLabelText(ariaLabel));
}

export function expectElementWithAriaLabelToBeInDocument(ariaLabel) {
    expect(screen.getByLabelText(ariaLabel)).toBeInTheDocument();
}

export function expectElementWithAriaLabelToHaveErrorMessage(ariaLabel, message) {
    expect(screen.getByLabelText(ariaLabel).lastChild.innerHTML).toBe(message);
}

export function changeElementWithAriaLabelWithInput(ariaLabel, input) {
    fireEvent.change(screen.getByLabelText(ariaLabel).lastChild.firstChild, { target: { value: input}});
}