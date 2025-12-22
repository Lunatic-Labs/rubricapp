import { screen, fireEvent } from '@testing-library/react';

export function clickElementWithAriaLabel(ariaLabel) { // given label it will click on it 
    fireEvent.click(screen.getByLabelText(ariaLabel));
}

export function clickFirstElementWithAriaLabel(ariaLabel) { // given label it will click on the first element
    fireEvent.click(screen.getAllByLabelText(ariaLabel)[0]);
}

export function expectElementWithAriaLabelToBeInDocument(ariaLabel) { // ariaLabel is in page itself
    expect(screen.getByLabelText(ariaLabel)).toBeInTheDocument();
}

export function expectElementWithAriaLabelToHaveErrorMessage(ariaLabel, message) { // ariaLabel provides specific message
    expect(screen.getByLabelText(ariaLabel).lastChild.innerHTML).toBe(message);
}

export function changeElementWithAriaLabelWithInput(ariaLabel, input) { // to put text into a label
    fireEvent.change(screen.getByLabelText(ariaLabel).lastChild.firstChild, { target: { value: input } });
}

export function changeElementWithAriaLabelWithCode(ariaLabel, code) { // types in code for validate reset
    let children = screen.getByLabelText(ariaLabel).children;

    for(let index = 0; index < children.length; index++) {
        fireEvent.change(children[index].firstChild.firstChild, { target: { value: code[index] } });
    }
}

export const clickFirstEnabledElementWithAriaLabel = (ariaLabel) => {
    const elements = screen.getAllByLabelText(ariaLabel);
    const enabledElement = elements.find(el => !el.disabled);
    
    if (!enabledElement) {
        throw new Error(`No enabled element found with aria-label: ${ariaLabel}`);
    }
    
    enabledElement.click();
};

export const expectEnabledElementWithAriaLabelToExist = (ariaLabel) => {
    const elements = screen.queryAllByLabelText(ariaLabel);
    const hasEnabledElement = elements.some(el => !el.disabled);
    
    expect(hasEnabledElement).toBe(true);
};