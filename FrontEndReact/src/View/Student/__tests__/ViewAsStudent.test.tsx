/// <reference types="@testing-library/jest-dom" />
import { render, waitFor, screen, fireEvent } from "@testing-library/react";
import { beforeEach, afterEach, test, describe, jest, expect} from "@jest/globals";
import Login from "../../Login/Login";
import {
    clickElementWithAriaLabel,
    expectElementWithAriaLabelToBeInDocument,
    changeElementWithAriaLabelWithInput,
    clickFirstElementWithAriaLabel
} from "../../../testUtilities";
import { demoAdminPassword } from "../../../App";
import '@testing-library/jest-dom';

// Mock universal-cookie
jest.mock('universal-cookie');
import Cookies from 'universal-cookie';

// Type the mocked Cookies
const MockedCookies = Cookies as jest.MockedClass<typeof Cookies>;

// Mock window.location.reload
const originalLocation = window.location;
delete (window as any).location;
window.location = { 
    ...originalLocation, 
    reload: jest.fn() as jest.MockedFunction<() => void>
};

// Mock sessionStorage
const sessionStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: (key: string): string | null => store[key] || null,
        setItem: (key: string, value: string): void => { store[key] = value.toString(); },
        removeItem: (key: string): void => { delete store[key]; },
        clear: (): void => { store = {}; }
    };
})();
Object.defineProperty(window, 'sessionStorage', { value: sessionStorageMock });

// Mock window.alert
window.alert = jest.fn() as jest.MockedFunction<(message?: any) => void>;

// Test labels
const lf = "loginForm";
const lb = "loginButton";
const ei = "emailInput";
const pi = "passwordInput";
const ct = "coursesTitle";
const vcib = "viewCourseIconButton";
const vasb = "viewAsStudentButton";
const sbab = "switchBackToAdminButton";
const mat = "myAssessmentTasksTitle";

describe("View as Student Feature Tests", () => {
    let mockCookies: {
        get: jest.MockedFunction<(name: string) => any>;
        set: jest.MockedFunction<(name: string, value: any, options?: any) => void>;
        remove: jest.MockedFunction<(name: string, options?: any) => void>;
    };

    beforeEach(() => {
        jest.clearAllMocks();
        sessionStorage.clear();
        (window.location.reload as jest.MockedFunction<() => void>).mockClear();
        
        // Setup mock cookies instance
        mockCookies = {
            get: jest.fn(),
            set: jest.fn(),
            remove: jest.fn(),
        };
        MockedCookies.mockImplementation(() => mockCookies as any);

        // Mock successful test student token response
        (global.fetch as any) = jest.fn((url: any) => {
            if (url.includes('/courses/') && url.includes('/test_student_token')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({
                        success: true,
                        user: {
                            user_id: 999,
                            email: "teststudent1@skillbuilder.edu",
                            first_name: "Test",
                            last_name: "Student",
                            role_id: 5,
                            viewingAsStudent: true
                        },
                        access_token: "mock_student_access_token",
                        refresh_token: "mock_student_refresh_token"
                    }),
                });
            }
            if (url.includes('/logout')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({ success: true }),
                });
            }
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve({}),
            });
        });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test("ViewAsStudent.test.js Test 1: Should render Login Form component", () => {
        render(<Login />);
        expectElementWithAriaLabelToBeInDocument(lf);
    });

    test("ViewAsStudent.test.js Test 2: Should login as admin and see courses page", async () => {
        mockCookies.get.mockReturnValue({ 
            user_id: 2, 
            email: "demoadmin02@skillbuilder.edu",
            isAdmin: true,
            role_id: 3
        });

        render(<Login />);

        changeElementWithAriaLabelWithInput(ei, "demoadmin02@skillbuilder.edu");
        changeElementWithAriaLabelWithInput(pi, demoAdminPassword);
        clickElementWithAriaLabel(lb);

        await waitFor(() => {
            expectElementWithAriaLabelToBeInDocument(ct);
        }, { timeout: 5000 });
    });

    test("ViewAsStudent.test.js Test 3: Should show 'View as Student' button on course page", async () => {
        mockCookies.get.mockReturnValue({ 
            user_id: 2,
            isAdmin: true,
            role_id: 3
        });

        render(<Login />);

        changeElementWithAriaLabelWithInput(ei, "demoadmin02@skillbuilder.edu");
        changeElementWithAriaLabelWithInput(pi, demoAdminPassword);
        clickElementWithAriaLabel(lb);

        await waitFor(() => {
            expectElementWithAriaLabelToBeInDocument(ct);
        });

        clickFirstElementWithAriaLabel(vcib);

        await waitFor(() => {
            expectElementWithAriaLabelToBeInDocument(vasb);
        }, { timeout: 3000 });
    });

    test("ViewAsStudent.test.js Test 4: Should switch to student view when 'View as Student' is clicked", async () => {
        mockCookies.get.mockReturnValue({ 
            user_id: 2,
            email: "demoadmin02@skillbuilder.edu",
            isAdmin: true,
            role_id: 3
        });

        render(<Login />);

        changeElementWithAriaLabelWithInput(ei, "demoadmin02@skillbuilder.edu");
        changeElementWithAriaLabelWithInput(pi, demoAdminPassword);
        clickElementWithAriaLabel(lb);

        await waitFor(() => {
            expectElementWithAriaLabelToBeInDocument(ct);
        });

        clickFirstElementWithAriaLabel(vcib);

        await waitFor(() => {
            expectElementWithAriaLabelToBeInDocument(vasb);
        });

        clickElementWithAriaLabel(vasb);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('/test_student_token'),
                expect.objectContaining({
                    method: 'GET',
                    headers: expect.objectContaining({
                        'Authorization': expect.any(String)
                    })
                })
            );
        }, { timeout: 5000 });

        await waitFor(() => {
            const savedCreds = sessionStorage.getItem('adminCredentials');
            expect(savedCreds).not.toBeNull();
        });

        await waitFor(() => {
            expect(mockCookies.set).toHaveBeenCalledWith(
                'user',
                expect.objectContaining({ 
                    viewingAsStudent: true,
                    role_id: 5
                }),
                expect.any(Object)
            );
            expect(mockCookies.set).toHaveBeenCalledWith(
                'access_token',
                'mock_student_access_token',
                expect.any(Object)
            );
        });

        await waitFor(() => {
            expect(window.location.reload).toHaveBeenCalled();
        });
    });

    test("ViewAsStudent.test.js Test 5: Should show 'Switch Back to Admin' banner when viewing as student", async () => {
        mockCookies.get.mockReturnValue({ 
            user_id: 999,
            email: "teststudent1@skillbuilder.edu",
            viewingAsStudent: true,
            role_id: 5
        });

        const adminData = {
            user: { 
                user_id: 2,
                email: "demoadmin02@skillbuilder.edu",
                isAdmin: true,
                role_id: 3
            },
            access_token: 'admin_token',
            refresh_token: 'admin_refresh'
        };
        sessionStorage.setItem('adminCredentials', JSON.stringify(adminData));

        render(<Login />);

        await waitFor(() => {
            expectElementWithAriaLabelToBeInDocument(mat);
        }, { timeout: 5000 });

        await waitFor(() => {
            const switchBackButton = screen.queryByText(/Switch Back to Admin/i);
            expect(switchBackButton).toBeInTheDocument();
        });
    });

    test("ViewAsStudent.test.js Test 6: Should restore admin view when 'Switch Back to Admin' is clicked", async () => {
        mockCookies.get.mockReturnValue({ 
            user_id: 999,
            email: "teststudent1@skillbuilder.edu",
            viewingAsStudent: true,
            role_id: 5
        });
        
        const adminData = {
            user: { 
                user_id: 2,
                email: "demoadmin02@skillbuilder.edu",
                isAdmin: true,
                role_id: 3
            },
            access_token: 'admin_token',
            refresh_token: 'admin_refresh'
        };
        sessionStorage.setItem('adminCredentials', JSON.stringify(adminData));

        render(<Login />);

        await waitFor(() => {
            expectElementWithAriaLabelToBeInDocument(mat);
        });

        const switchBackButton = await screen.findByText(/Switch Back to Admin/i);
        fireEvent.click(switchBackButton);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('/logout'),
                expect.objectContaining({
                    method: 'POST'
                })
            );
        });

        await waitFor(() => {
            expect(mockCookies.remove).toHaveBeenCalledWith('access_token', expect.any(Object));
            expect(mockCookies.remove).toHaveBeenCalledWith('refresh_token', expect.any(Object));
            expect(mockCookies.remove).toHaveBeenCalledWith('user', expect.any(Object));
        });

        await waitFor(() => {
            expect(mockCookies.set).toHaveBeenCalledWith(
                'user',
                adminData.user,
                expect.any(Object)
            );
            expect(mockCookies.set).toHaveBeenCalledWith(
                'access_token',
                adminData.access_token,
                expect.any(Object)
            );
        });

        await waitFor(() => {
            expect(sessionStorage.getItem('adminCredentials')).toBeNull();
        });

        await waitFor(() => {
            expect(window.location.reload).toHaveBeenCalled();
        });
    });

    test("ViewAsStudent.test.js Test 7: Should handle error when test student creation fails", async () => {
        mockCookies.get.mockReturnValue({ 
            user_id: 2,
            isAdmin: true,
            role_id: 3
        });

        (global.fetch as any) = jest.fn(() => 
            Promise.resolve({
                ok: false,
                json: () => Promise.resolve({
                    success: false,
                    error: "Failed to create test student"
                }),
            })
        );

        render(<Login />);

        changeElementWithAriaLabelWithInput(ei, "demoadmin02@skillbuilder.edu");
        changeElementWithAriaLabelWithInput(pi, demoAdminPassword);
        clickElementWithAriaLabel(lb);

        await waitFor(() => {
            expectElementWithAriaLabelToBeInDocument(ct);
        });

        clickFirstElementWithAriaLabel(vcib);

        await waitFor(() => {
            expectElementWithAriaLabelToBeInDocument(vasb);
        });

        clickElementWithAriaLabel(vasb);

        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith(
                expect.stringContaining("Failed to switch to student view")
            );
        }, { timeout: 5000 });

        expect(sessionStorage.getItem('adminCredentials')).toBeNull();
        expect(window.location.reload).not.toHaveBeenCalled();
    });

    test("ViewAsStudent.test.js Test 8: Should prevent multiple clicks on 'View as Student' button", async () => {
        mockCookies.get.mockReturnValue({ 
            user_id: 2,
            isAdmin: true,
            role_id: 3
        });

        render(<Login />);

        changeElementWithAriaLabelWithInput(ei, "demoadmin02@skillbuilder.edu");
        changeElementWithAriaLabelWithInput(pi, demoAdminPassword);
        clickElementWithAriaLabel(lb);

        await waitFor(() => {
            expectElementWithAriaLabelToBeInDocument(ct);
        });

        clickFirstElementWithAriaLabel(vcib);

        await waitFor(() => {
            expectElementWithAriaLabelToBeInDocument(vasb);
        });

        const viewAsStudentBtn = screen.getByLabelText(vasb);
        fireEvent.click(viewAsStudentBtn);
        fireEvent.click(viewAsStudentBtn);
        fireEvent.click(viewAsStudentBtn);

        await waitFor(() => {
            const fetchCalls = (global.fetch as any).mock.calls.filter((call: any) => 
                call[0].includes('/test_student_token')
            );
            expect(fetchCalls.length).toBe(1);
        }, { timeout: 5000 });
    });
});