// @ts-expect-error TS(2307): Cannot find module '@testing-library/react' or its... Remove this comment to see the full error message
import { screen, fireEvent } from '@testing-library/react';

export function clickElementWithAriaLabel(ariaLabel: any) { // given label it will click on it 
    fireEvent.click(screen.getByLabelText(ariaLabel));
}

export function clickFirstElementWithAriaLabel(ariaLabel: any) { // given label it will click on the first element
    fireEvent.click(screen.getAllByLabelText(ariaLabel)[0]);
}

export function expectElementWithAriaLabelToBeInDocument(ariaLabel: any) { // ariaLabel is in page itself
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(screen.getByLabelText(ariaLabel)).toBeInTheDocument();
}

export function expectElementWithAriaLabelToHaveErrorMessage(ariaLabel: any, message: any) { // ariaLabel provides specific message
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    expect(screen.getByLabelText(ariaLabel).lastChild.innerHTML).toBe(message);
}

export function changeElementWithAriaLabelWithInput(ariaLabel: any, input: any) { // to put text into a label
    fireEvent.change(screen.getByLabelText(ariaLabel).lastChild.firstChild, { target: { value: input } });
}

export function changeElementWithAriaLabelWithCode(ariaLabel: any, code: any) { // types in code for validate reset
    let children = screen.getByLabelText(ariaLabel).children;

    for(let index = 0; index < children.length; index++) {
        fireEvent.change(children[index].firstChild.firstChild, { target: { value: code[index] } });
    }
}