import { screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Declare expect as global for Jest environment
declare const expect: any;

export function clickElementWithAriaLabel(ariaLabel: any) { // given label it will click on it 
    fireEvent.click(screen.getByLabelText(ariaLabel));
}

export function clickFirstElementWithAriaLabel(ariaLabel: any) { // given label it will click on the first element
    const elements = screen.getAllByLabelText(ariaLabel);
    const el = elements[0];
    if (!el) {
        throw new Error(`No element found with aria-label: ${ariaLabel}`);
    }
    fireEvent.click(el);
}

export function expectElementWithAriaLabelToBeInDocument(ariaLabel: any) { // ariaLabel is in page itself
    expect(screen.getByLabelText(ariaLabel)).toBeInTheDocument();
}

export function expectElementWithAriaLabelToHaveErrorMessage(ariaLabel: any, message: any) { // ariaLabel provides specific message
    const el = screen.getByLabelText(ariaLabel);
    const last = el.lastChild as HTMLElement | null;
    if (!last || !(last instanceof HTMLElement)) {
        throw new Error(`No lastChild HTMLElement found for aria-label: ${ariaLabel}`);
    }
    expect(last.innerHTML).toBe(message);
}

export function changeElementWithAriaLabelWithInput(ariaLabel: any, input: any) { // to put text into a label
    const el = screen.getByLabelText(ariaLabel) as Element;
    const inputEl = el.querySelector('input, textarea') as HTMLInputElement | HTMLTextAreaElement | null;
    if (!inputEl) {
        throw new Error(`No input or textarea found for aria-label: ${ariaLabel}`);
    }
    fireEvent.change(inputEl, { target: { value: input } });
}

export function changeElementWithAriaLabelWithCode(ariaLabel: any, code: any) { // types in code for validate reset
    const el = screen.getByLabelText(ariaLabel) as Element;
    const children = el.children;

    for (let index = 0; index < children.length; index++) {
        const child = children[index] as Element;
        const inputEl = child.querySelector('input, textarea') as HTMLInputElement | HTMLTextAreaElement | null;
        if (!inputEl) {
            throw new Error(`No input or textarea found in child ${index} for aria-label: ${ariaLabel}`);
        }
        const value = Array.isArray(code) ? code[index] : code;
        fireEvent.change(inputEl, { target: { value } });
    }
}

export const clickFirstEnabledElementWithAriaLabel = (ariaLabel: any) => {
    const elements = screen.getAllByLabelText(ariaLabel);
    const enabledElement = elements.find(el => !(el as HTMLButtonElement).disabled);
    
    if (!enabledElement) {
        throw new Error(`No enabled element found with aria-label: ${ariaLabel}`);
    }
    
    enabledElement.click();
};

export const expectEnabledElementWithAriaLabelToExist = (ariaLabel: any) => {
    const elements = screen.queryAllByLabelText(ariaLabel);
    const hasEnabledElement = elements.some(el => !(el as HTMLButtonElement).disabled);
    
    expect(hasEnabledElement).toBe(true);
};