import { screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

// Declare expect as global for Jest environment
declare const expect: any;

export function clickElementWithTestId(testId: string) { // given a data-testid it will click on it
    fireEvent.click(screen.getByTestId(testId));
}

export function clickFirstElementWithTestId(testId: string) { // given a data-testid it will click on the first element
    const elements = screen.getAllByTestId(testId);
    const el = elements[0];
    if (!el) {
        throw new Error(`No element found with data-testid: ${testId}`);
    }
    fireEvent.click(el);
}

export function expectElementWithTestIdToBeInDocument(testId: string) { // data-testid is in page itself
    expect(screen.getByTestId(testId)).toBeInTheDocument();
}

export function expectElementWithTestIdToHaveErrorMessage(testId: string, message: string) { // data-testid provides specific message
    const el = screen.getByTestId(testId);
    const last = el.lastChild as HTMLElement | null;
    if (!last || !(last instanceof HTMLElement)) {
        throw new Error(`No lastChild HTMLElement found for data-testid: ${testId}`);
    }
    expect(last.innerHTML).toBe(message);
}

export function changeElementWithTestIdWithInput(testId: string, input: string) { // to put text into an element
    const el = screen.getByTestId(testId) as HTMLElement;

    // If getByTestId returns the actual input/textarea, use it directly.
    if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
        fireEvent.change(el, { target: { value: input } });
        return;
    }

    // Otherwise assume it's a container and find the nested input.
    const inputEl = el.querySelector('input, textarea') as
    | HTMLInputElement
    | HTMLTextAreaElement
    | null;


    if (!inputEl) {
        throw new Error(`No input or textarea found for data-testid: ${testId}`);
    }

    fireEvent.change(inputEl, { target: { value: input } });
}

export function changeElementWithTestIdWithCode(testId: string, code: string | string[]) { // types in code for validate reset
    const el = screen.getByTestId(testId) as Element;
    const children = el.children;

    for (let index = 0; index < children.length; index++) {
        const child = children[index] as Element;
        const inputEl = child.querySelector('input, textarea') as HTMLInputElement | HTMLTextAreaElement | null;
        if (!inputEl) {
            throw new Error(`No input or textarea found in child ${index} for data-testid: ${testId}`);
        }
        const value = Array.isArray(code) ? code[index] : code;
        fireEvent.change(inputEl, { target: { value } });
    }
}

export const clickFirstEnabledElementWithTestId = (testId: string) => {
    const elements = screen.getAllByTestId(testId);
    const enabledElement = elements.find(el => !(el as HTMLButtonElement).disabled);

    if (!enabledElement) {
        throw new Error(`No enabled element found with data-testid: ${testId}`);
    }

    enabledElement.click();
};

export async function selectDropdownOptionWithTestId(testId: string, optionText: string) {
    const user = userEvent.setup();
    await user.click(screen.getByTestId(testId));
    const option = await screen.findByRole('option', { name: optionText });
    await user.click(option);
};

export const expectEnabledElementWithTestIdToExist = (testId: string) => {
    const elements = screen.queryAllByTestId(testId);
    const hasEnabledElement = elements.some(el => !(el as HTMLButtonElement).disabled);

    expect(hasEnabledElement).toBe(true);
};

export async function selectComboBoxMenuItem(accessibleName: string, optionText: string){
    const user = userEvent.setup();

    const selectButton = screen.getByRole("combobox", {name : accessibleName});
    await user.click(selectButton);

    const option = await screen.findByRole("option", {name : optionText});
    await user.click(option);
}
