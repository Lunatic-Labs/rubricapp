/// <reference types="@testing-library/jest-dom" />

import '@testing-library/jest-dom';
import { render, waitFor, screen, fireEvent, act, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, afterEach, afterAll, test, describe, jest } from "@jest/globals";
import Login from "../../Login/Login";
import {
    clickElementWithAriaLabel,
    expectElementWithAriaLabelToBeInDocument,
    clickFirstElementWithAriaLabel
} from "../../../testUtilities";
import { demoAdminPassword } from "../../../App";

// Mock universal-cookie
jest.mock('universal-cookie');
import Cookies from 'universal-cookie';

// Type the mocked Cookies
const MockedCookies = Cookies as jest.MockedClass<typeof Cookies>;

// Store original values for restoration
const originalLocation = window.location;
const originalFetch = global.fetch;
const originalAlert = window.alert;

// Mock window.location.reload
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

// Increase default timeout for all tests
jest.setTimeout(15000);

describe("View as Student Feature Tests", () => {
    let mockCookies: {
        get: jest.MockedFunction<(name: string) => any>;
        set: jest.MockedFunction<(name: string, value: any, options?: any) => void>;
        remove: jest.MockedFunction<(name: string, options?: any) => void>;
    };

    // Admin user data matching your app's expected format from Login.tsx
    const adminUser = {
        user_id: 2,
        user_name: "Demo Admin",
        email: "demoadmin02@skillbuilder.edu",
        first_name: "Demo",
        last_name: "Admin",
        isSuperAdmin: false,
        isAdmin: true,
        role_id: 3,
        has_set_password: true
    };

    // Student user data
    const studentUser = {
        user_id: 999,
        user_name: "Test Student",
        email: "teststudent1@skillbuilder.edu",
        first_name: "Test",
        last_name: "Student",
        isSuperAdmin: false,
        isAdmin: false,
        role_id: 5,
        has_set_password: true,
        viewingAsStudent: true
    };

    // Helper function to setup fetch mock with all necessary endpoints
    // IMPORTANT: utility.ts expects result.content[resource][0] format
    const setupFetchMock = (overrides: Record<string, any> = {}) => {
        (global.fetch as any) = jest.fn((url: string, options?: any) => {
            // Handle login endpoint
            if (url.includes('/login')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({
                        success: true,
                        headers: {
                            access_token: "mock_admin_access_token",
                            refresh_token: "mock_admin_refresh_token"
                        },
                        content: {
                            login: [adminUser]
                        }
                    }),
                });
            }

            // Handle test student token endpoint
            if (url.includes('/test_student_token')) {
                if (overrides.testStudentToken) {
                    return overrides.testStudentToken();
                }
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({
                        success: true,
                        headers: {
                            access_token: "mock_student_access_token",
                            refresh_token: "mock_student_refresh_token"
                        },
                        content: {
                            user: [studentUser]  // Array format for utility.ts
                        }
                    }),
                });
            }

            // Handle logout endpoint
            if (url.includes('/logout')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({ success: true }),
                });
            }

            // Handle courses endpoint - utility.ts expects content.courses[0]
            if (url.includes('/courses')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({
                        success: true,
                        content: {
                            courses: [
                                { course_id: 1, course_name: "Test Course", course_number: "CS101" }
                            ]
                        }
                    }),
                });
            }

            // Handle assessment tasks endpoint - utility.ts expects content.assessment_tasks[0]
            if (url.includes('/assessment_task')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({
                        success: true,
                        content: {
                            assessment_task: [
                                { assessment_task_id: 1, assessment_task_name: "Test Task" }
                            ]
                        }
                    }),
                });
            }

            // Handle users endpoint
            if (url.includes('/users')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({
                        success: true,
                        content: {
                            users: [
                                { user_id: 1, email: "test@test.com" }
                            ]
                        }
                    }),
                });
            }

            // Handle rubrics endpoint
            if (url.includes('/rubric')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({
                        success: true,
                        content: {
                            rubric: [
                                { rubric_id: 1, rubric_name: "Test Rubric" }
                            ]
                        }
                    }),
                });
            }

            // Handle teams endpoint
            if (url.includes('/team')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({
                        success: true,
                        content: {
                            team: [
                                { team_id: 1, team_name: "Test Team" }
                            ]
                        }
                    }),
                });
            }

            // Handle role endpoint
            if (url.includes('/role')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({
                        success: true,
                        content: {
                            role: [
                                { role_id: 5, role_name: "Student" }
                            ]
                        }
                    }),
                });
            }

            // Handle checkin endpoint
            if (url.includes('/checkin')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({
                        success: true,
                        content: {
                            checkin: []
                        }
                    }),
                });
            }

            // Handle completed_assessment endpoint
            if (url.includes('/completed_assessment')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({
                        success: true,
                        content: {
                            completed_assessment: []
                        }
                    }),
                });
            }

            // Default response - return empty array for any resource
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ 
                    success: true, 
                    content: {} 
                }),
            });
        });
    };

    beforeEach(() => {
        // Clear all mocks
        jest.clearAllMocks();
        
        // Clear storage
        sessionStorage.clear();
        
        // Reset window mocks
        (window.location.reload as jest.MockedFunction<() => void>).mockClear();
        (window.alert as jest.MockedFunction<(message?: any) => void>).mockClear();

        // Setup mock cookies instance - start unauthenticated
        mockCookies = {
            get: jest.fn().mockReturnValue(undefined),
            set: jest.fn(),
            remove: jest.fn(),
        };
        MockedCookies.mockImplementation(() => mockCookies as any);

        // Setup default fetch mock
        setupFetchMock();
    });

    afterEach(async () => {
        // IMPORTANT: Force cleanup of all rendered components
        cleanup();
        
        // Clear all mocks
        jest.clearAllMocks();
        
        // Clear all timers
        jest.clearAllTimers();
        
        // Clear storage
        sessionStorage.clear();
        
        // Reset fetch mock
        if (global.fetch) {
            (global.fetch as any).mockReset?.();
        }
        
        // Wait for any pending promises/state updates
        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });
    });

    // Restore everything after all tests complete
    afterAll(() => {
        // Restore all mocks to original implementations
        jest.restoreAllMocks();
        
        // Reset modules to clear any cached imports
        jest.resetModules();
        
        // Restore original window.location
        window.location = originalLocation;
        
        // Restore original fetch if it existed
        if (originalFetch) {
            global.fetch = originalFetch;
        }
        
        // Restore original alert
        window.alert = originalAlert;
        
        // Final storage clear
        sessionStorage.clear();
    });

    test("ViewAsStudent.test.js Test 1: Should render Login Form component", async () => {
        // No cookies = show login form
        mockCookies.get.mockReturnValue(undefined);

        await act(async () => {
            render(<Login />);
        });

        await waitFor(() => {
            expectElementWithAriaLabelToBeInDocument(lf);
        });
    });

    test("ViewAsStudent.test.js Test 2: Should login as admin and see courses page", async () => {
        // Start with no cookies (unauthenticated)
        mockCookies.get.mockReturnValue(undefined);

        const user = userEvent.setup();

        await act(async () => {
            render(<Login />);
        });

        // Wait for login form to appear
        await waitFor(() => {
            expectElementWithAriaLabelToBeInDocument(lf);
        });

        // Get the actual input elements inside the MUI TextFields
        const emailTextField = screen.getByLabelText(ei);
        const passwordTextField = screen.getByLabelText(pi);
        
        // Find the actual input elements
        const emailInput = emailTextField.querySelector('input') || emailTextField;
        const passwordInput = passwordTextField.querySelector('input') || passwordTextField;

        // Use userEvent for better MUI compatibility
        await user.clear(emailInput);
        await user.type(emailInput, "demoadmin02@skillbuilder.edu");
        await user.clear(passwordInput);
        await user.type(passwordInput, demoAdminPassword as string);

        // Click login button
        await act(async () => {
            clickElementWithAriaLabel(lb);
        });

        // After successful login, cookies should be set
        await waitFor(() => {
            expect(mockCookies.set).toHaveBeenCalledWith(
                'access_token',
                'mock_admin_access_token',
                { sameSite: 'strict' }
            );
            expect(mockCookies.set).toHaveBeenCalledWith(
                'refresh_token',
                'mock_admin_refresh_token',
                { sameSite: 'strict' }
            );
            expect(mockCookies.set).toHaveBeenCalledWith(
                'user',
                adminUser,
                { sameSite: 'strict' }
            );
        });

        // Now mock that user is authenticated
        mockCookies.get.mockImplementation((name: string) => {
            if (name === 'user') return adminUser;
            if (name === 'access_token') return 'mock_admin_access_token';
            if (name === 'refresh_token') return 'mock_admin_refresh_token';
            return undefined;
        });

        // Wait for courses page
        await waitFor(() => {
            expectElementWithAriaLabelToBeInDocument(ct);
        }, { timeout: 5000 });
    });

    test("ViewAsStudent.test.js Test 3: Should show 'View as Student' button on course page", async () => {
        // Start already logged in as admin
        mockCookies.get.mockImplementation((name: string) => {
            if (name === 'user') return adminUser;
            if (name === 'access_token') return 'mock_admin_access_token';
            if (name === 'refresh_token') return 'mock_admin_refresh_token';
            return undefined;
        });

        await act(async () => {
            render(<Login />);
        });

        // Wait for courses page
        await waitFor(() => {
            expectElementWithAriaLabelToBeInDocument(ct);
        }, { timeout: 5000 });

        // Click on a course to view it
        await act(async () => {
            clickFirstElementWithAriaLabel(vcib);
        });

        // Wait for View as Student button
        await waitFor(() => {
            expectElementWithAriaLabelToBeInDocument(vasb);
        }, { timeout: 5000 });
    });

    test("ViewAsStudent.test.js Test 4: Should switch to student view when 'View as Student' is clicked", async () => {
        // Start already logged in as admin
        mockCookies.get.mockImplementation((name: string) => {
            if (name === 'user') return adminUser;
            if (name === 'access_token') return 'mock_admin_access_token';
            if (name === 'refresh_token') return 'mock_admin_refresh_token';
            return undefined;
        });

        await act(async () => {
            render(<Login />);
        });

        // Wait for courses page
        await waitFor(() => {
            expectElementWithAriaLabelToBeInDocument(ct);
        }, { timeout: 5000 });

        // Click on a course
        await act(async () => {
            clickFirstElementWithAriaLabel(vcib);
        });

        // Wait for View as Student button
        await waitFor(() => {
            expectElementWithAriaLabelToBeInDocument(vasb);
        }, { timeout: 5000 });

        // Click View as Student button
        await act(async () => {
            clickElementWithAriaLabel(vasb);
        });

        // Verify API call was made
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
        });

        // Verify admin credentials were saved
        await waitFor(() => {
            const savedCreds = sessionStorage.getItem('adminCredentials');
            expect(savedCreds).not.toBeNull();
        });

        // Verify cookies were set with student data
        await waitFor(() => {
            expect(mockCookies.set).toHaveBeenCalledWith(
                'user',
                expect.objectContaining({
                    viewingAsStudent: true
                }),
                expect.any(Object)
            );
        });

        // Verify page reload was triggered
        await waitFor(() => {
            expect(window.location.reload).toHaveBeenCalled();
        });
    });

    test("ViewAsStudent.test.js Test 5: Should show 'Switch Back to Admin' banner when viewing as student", async () => {
        // Setup: User is already viewing as student
        mockCookies.get.mockImplementation((name: string) => {
            if (name === 'user') return studentUser;
            if (name === 'access_token') return 'mock_student_access_token';
            if (name === 'refresh_token') return 'mock_student_refresh_token';
            return undefined;
        });

        // Store admin credentials in session storage
        const adminData = {
            user: adminUser,
            access_token: 'admin_token',
            refresh_token: 'admin_refresh'
        };
        sessionStorage.setItem('adminCredentials', JSON.stringify(adminData));

        await act(async () => {
            render(<Login />);
        });

        // Wait for student view to load
        await waitFor(() => {
            expectElementWithAriaLabelToBeInDocument(mat);
        }, { timeout: 5000 });

        // Verify Switch Back to Admin button is visible
        await waitFor(() => {
            const switchBackButton = screen.queryByText(/Switch Back to Admin/i);
            expect(switchBackButton).toBeInTheDocument();
        });
    });

    test("ViewAsStudent.test.js Test 6: Should restore admin view when 'Switch Back to Admin' is clicked", async () => {
        // Setup: User is viewing as student
        mockCookies.get.mockImplementation((name: string) => {
            if (name === 'user') return studentUser;
            if (name === 'access_token') return 'mock_student_access_token';
            if (name === 'refresh_token') return 'mock_student_refresh_token';
            return undefined;
        });

        // Store admin credentials
        const adminData = {
            user: adminUser,
            access_token: 'admin_token',
            refresh_token: 'admin_refresh'
        };
        sessionStorage.setItem('adminCredentials', JSON.stringify(adminData));

        await act(async () => {
            render(<Login />);
        });

        // Wait for student view
        await waitFor(() => {
            expectElementWithAriaLabelToBeInDocument(mat);
        }, { timeout: 5000 });

        // Find and click Switch Back to Admin button
        const switchBackButton = await screen.findByText(/Switch Back to Admin/i);

        await act(async () => {
            fireEvent.click(switchBackButton);
        });

        // Verify logout was called
        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('/logout'),
                expect.objectContaining({
                    method: 'POST'
                })
            );
        });

        // Verify cookies were removed
        await waitFor(() => {
            expect(mockCookies.remove).toHaveBeenCalledWith('access_token', expect.any(Object));
            expect(mockCookies.remove).toHaveBeenCalledWith('refresh_token', expect.any(Object));
            expect(mockCookies.remove).toHaveBeenCalledWith('user', expect.any(Object));
        });

        // Verify admin cookies were restored
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

        // Verify session storage was cleared
        await waitFor(() => {
            expect(sessionStorage.getItem('adminCredentials')).toBeNull();
        });

        // Verify page reload
        await waitFor(() => {
            expect(window.location.reload).toHaveBeenCalled();
        });
    });

    test("ViewAsStudent.test.js Test 7: Should handle error when test student creation fails", async () => {
        // Setup fetch to fail for test student endpoint
        setupFetchMock({
            testStudentToken: () => Promise.resolve({
                ok: false,
                json: () => Promise.resolve({
                    success: false,
                    message: "Failed to create test student"
                }),
            })
        });

        // Start already logged in as admin
        mockCookies.get.mockImplementation((name: string) => {
            if (name === 'user') return adminUser;
            if (name === 'access_token') return 'mock_admin_access_token';
            if (name === 'refresh_token') return 'mock_admin_refresh_token';
            return undefined;
        });

        await act(async () => {
            render(<Login />);
        });

        // Wait for courses page
        await waitFor(() => {
            expectElementWithAriaLabelToBeInDocument(ct);
        }, { timeout: 5000 });

        // Click on a course
        await act(async () => {
            clickFirstElementWithAriaLabel(vcib);
        });

        // Wait for View as Student button
        await waitFor(() => {
            expectElementWithAriaLabelToBeInDocument(vasb);
        }, { timeout: 5000 });

        // Click View as Student button
        await act(async () => {
            clickElementWithAriaLabel(vasb);
        });

        // Verify error alert was shown
        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith(
                expect.stringContaining("Failed to switch to student view")
            );
        });

        // Verify admin credentials were NOT saved
        expect(sessionStorage.getItem('adminCredentials')).toBeNull();

        // Verify page was NOT reloaded
        expect(window.location.reload).not.toHaveBeenCalled();
    });

    test("ViewAsStudent.test.js Test 8: Should prevent multiple clicks on 'View as Student' button", async () => {
        // Start already logged in as admin
        mockCookies.get.mockImplementation((name: string) => {
            if (name === 'user') return adminUser;
            if (name === 'access_token') return 'mock_admin_access_token';
            if (name === 'refresh_token') return 'mock_admin_refresh_token';
            return undefined;
        });

        await act(async () => {
            render(<Login />);
        });

        // Wait for courses page
        await waitFor(() => {
            expectElementWithAriaLabelToBeInDocument(ct);
        }, { timeout: 5000 });

        // Click on a course
        await act(async () => {
            clickFirstElementWithAriaLabel(vcib);
        });

        // Wait for View as Student button
        await waitFor(() => {
            expectElementWithAriaLabelToBeInDocument(vasb);
        }, { timeout: 5000 });

        // Get the button and click it multiple times rapidly
        const viewAsStudentBtn = screen.getByLabelText(vasb);

        await act(async () => {
            fireEvent.click(viewAsStudentBtn);
            fireEvent.click(viewAsStudentBtn);
            fireEvent.click(viewAsStudentBtn);
        });

        // Wait for potential calls to complete
        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 500));
        });

        // Verify only one API call was made
        await waitFor(() => {
            const fetchCalls = (global.fetch as any).mock.calls.filter((call: any) =>
                call[0].includes('/test_student_token')
            );
            expect(fetchCalls.length).toBe(1);
        });
    });
});
