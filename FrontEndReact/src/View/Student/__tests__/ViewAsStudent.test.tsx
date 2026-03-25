// <reference types="@testing-library/jest-dom" />

import '@testing-library/jest-dom';
import { render, waitFor, screen, fireEvent, act, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, afterEach, afterAll, test, describe, jest } from "@jest/globals";
import {
    clickElementWithAriaLabel,
    expectElementWithAriaLabelToBeInDocument,
    clickFirstElementWithAriaLabel
} from "../../../testUtilities";

// Mock the API URL BEFORE importing components that use it
jest.mock('../../../App', () => ({
    apiUrl: 'http://localhost:5000/api',
    demoAdminPassword: 'testpassword123',
    superAdminPassword: 'superpassword123',
    demoTaInstructorPassword: 'tapassword123',
    demoStudentPassword: 'studentpassword123',
}));

// Mock universal-cookie BEFORE importing Login
jest.mock('universal-cookie');
import Cookies from 'universal-cookie';

// Now import Login after mocks are set up
import Login from "../../Login/Login";
import { demoAdminPassword } from "../../../App";

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
    let mockCookiesInstance: {
        get: jest.MockedFunction<(name: string) => any>;
        set: jest.MockedFunction<(name: string, value: any, options?: any) => void>;
        remove: jest.MockedFunction<(name: string, options?: any) => void>;
    };

    // Storage for cookie values
    let cookieStore: Record<string, any> = {};

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
    const setupFetchMock = (overrides: Record<string, any> = {}) => {
        (global.fetch as any) = jest.fn((url: string, options?: any) => {
            const urlStr = String(url);
            
            // Handle login endpoint
            if (urlStr.includes('/login')) {
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
            if (urlStr.includes('/test_student_token')) {
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
                            user: [studentUser]
                        }
                    }),
                });
            }

            // Handle logout endpoint
            if (urlStr.includes('/logout')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({ success: true }),
                });
            }

            // Handle courses endpoint
            if (urlStr.includes('/course')) {
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

            // Handle assessment tasks endpoint
            if (urlStr.includes('/assessment_task')) {
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
            if (urlStr.includes('/user')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({
                        success: true,
                        content: {
                            users: [
                                { user_id: 1, email: "test@test.com", first_name: "Test", last_name: "User" }
                            ]
                        }
                    }),
                });
            }

            // Handle rubrics endpoint
            if (urlStr.includes('/rubric')) {
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
            if (urlStr.includes('/team')) {
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
            if (urlStr.includes('/role')) {
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
            if (urlStr.includes('/checkin')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({
                        success: true,
                        content: {
                            checkin: [{}]
                        }
                    }),
                });
            }

            // Handle completed_assessment endpoint
            if (urlStr.includes('/completed_assessment')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({
                        success: true,
                        content: {
                            completed_assessment: [{}]
                        }
                    }),
                });
            }

            // Handle category endpoint
            if (urlStr.includes('/category')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({
                        success: true,
                        content: {
                            category: [{ category_id: 1, category_name: "Test Category" }]
                        }
                    }),
                });
            }

            // Default response - extract resource from URL and return valid structure
            const urlParts: string[] = urlStr.split('/');
            const lastPart: string = urlParts[urlParts.length - 1] ?? 'default';
            const resource: string = lastPart.split('?')[0] ?? 'default';
            
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve({
                    success: true,
                    content: {
                        [resource]: [{}]
                    }
                }),
            });
        });
    };

    // Setup mock cookies with working get/set/remove
    const setupMockCookies = (initialState: 'unauthenticated' | 'admin' | 'student' = 'unauthenticated') => {
        // Reset cookie store
        cookieStore = {};

        // Pre-populate based on initial state
        if (initialState === 'admin') {
            cookieStore = {
                user: adminUser,
                access_token: 'mock_admin_access_token',
                refresh_token: 'mock_admin_refresh_token'
            };
        } else if (initialState === 'student') {
            cookieStore = {
                user: studentUser,
                access_token: 'mock_student_access_token',
                refresh_token: 'mock_student_refresh_token'
            };
        }

        mockCookiesInstance = {
            get: jest.fn((name: string) => {
                return cookieStore[name];
            }) as jest.MockedFunction<(name: string) => any>,
            set: jest.fn((name: string, value: any, options?: any) => {
                cookieStore[name] = value;
            }) as jest.MockedFunction<(name: string, value: any, options?: any) => void>,
            remove: jest.fn((name: string, options?: any) => {
                delete cookieStore[name];
            }) as jest.MockedFunction<(name: string, options?: any) => void>,
        };

        MockedCookies.mockImplementation(() => mockCookiesInstance as any);
    };

    beforeEach(() => {
        // Clear all mocks
        jest.clearAllMocks();

        // Clear storage
        sessionStorage.clear();
        cookieStore = {};

        // Reset window mocks
        (window.location.reload as jest.MockedFunction<() => void>).mockClear();
        (window.alert as jest.MockedFunction<(message?: any) => void>).mockClear();

        // Setup default unauthenticated state
        setupMockCookies('unauthenticated');

        // Setup default fetch mock
        setupFetchMock();
    });

    afterEach(async () => {
        cleanup();
        jest.clearAllMocks();
        jest.clearAllTimers();
        sessionStorage.clear();
        cookieStore = {};

        if (global.fetch) {
            (global.fetch as any).mockReset?.();
        }

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });
    });

    afterAll(() => {
        jest.restoreAllMocks();
        jest.resetModules();
        window.location = originalLocation;

        if (originalFetch) {
            global.fetch = originalFetch;
        }

        window.alert = originalAlert;
        sessionStorage.clear();
    });

    test("ViewAsStudent.test.js Test 1: Should render Login Form component", async () => {
        setupMockCookies('unauthenticated');

        await act(async () => {
            render(<Login />);
        });

        await waitFor(() => {
            expectElementWithAriaLabelToBeInDocument(lf);
        });
    });

    test("ViewAsStudent.test.js Test 2: Should login as admin and see courses page", async () => {
        setupMockCookies('unauthenticated');

        const user = userEvent.setup();

        await act(async () => {
            render(<Login />);
        });

        // Wait for login form to appear
        await waitFor(() => {
            expectElementWithAriaLabelToBeInDocument(lf);
        });

        // Get the input elements
        const emailInput = screen.getByLabelText(ei);
        const passwordInput = screen.getByLabelText(pi);

        // Type credentials
        await user.clear(emailInput);
        await user.type(emailInput, "demoadmin02@skillbuilder.edu");
        await user.clear(passwordInput);
        await user.type(passwordInput, demoAdminPassword as string);

        // Click login button
        await act(async () => {
            clickElementWithAriaLabel(lb);
        });

        // After successful login, verify cookies were set
        await waitFor(() => {
            expect(mockCookiesInstance.set).toHaveBeenCalledWith(
                'user',
                expect.objectContaining({ user_name: "Demo Admin" }),
                expect.any(Object)
            );
        });

        // Wait for courses page to load
        await waitFor(() => {
            expectElementWithAriaLabelToBeInDocument(ct);
        }, { timeout: 10000 });
    });

    test("ViewAsStudent.test.js Test 3: Should show 'View as Student' button on course page", async () => {
        // Start already logged in as admin
        setupMockCookies('admin');

        await act(async () => {
            render(<Login />);
        });

        // Wait for courses page
        await waitFor(() => {
            expectElementWithAriaLabelToBeInDocument(ct);
        }, { timeout: 10000 });

        // Click on a course to view it
        await act(async () => {
            clickFirstElementWithAriaLabel(vcib);
        });

        // Wait for View as Student button
        await waitFor(() => {
            expectElementWithAriaLabelToBeInDocument(vasb);
        }, { timeout: 10000 });
    });

    test("ViewAsStudent.test.js Test 4: Should switch to student view when 'View as Student' is clicked", async () => {
        setupMockCookies('admin');

        await act(async () => {
            render(<Login />);
        });

        // Wait for courses page
        await waitFor(() => {
            expectElementWithAriaLabelToBeInDocument(ct);
        }, { timeout: 10000 });

        // Click on a course
        await act(async () => {
            clickFirstElementWithAriaLabel(vcib);
        });

        // Wait for View as Student button
        await waitFor(() => {
            expectElementWithAriaLabelToBeInDocument(vasb);
        }, { timeout: 10000 });

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
            expect(mockCookiesInstance.set).toHaveBeenCalledWith(
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
        setupMockCookies('student');

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
        }, { timeout: 10000 });

        // Verify Switch Back to Admin button is visible
        await waitFor(() => {
            const switchBackButton = screen.queryByText(/Switch Back to Admin/i);
            expect(switchBackButton).toBeInTheDocument();
        });
    });

    test("ViewAsStudent.test.js Test 6: Should restore admin view when 'Switch Back to Admin' is clicked", async () => {
        setupMockCookies('student');

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
        }, { timeout: 10000 });

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
            expect(mockCookiesInstance.remove).toHaveBeenCalledWith('access_token', expect.any(Object));
            expect(mockCookiesInstance.remove).toHaveBeenCalledWith('refresh_token', expect.any(Object));
            expect(mockCookiesInstance.remove).toHaveBeenCalledWith('user', expect.any(Object));
        });

        // Verify admin cookies were restored
        await waitFor(() => {
            expect(mockCookiesInstance.set).toHaveBeenCalledWith(
                'user',
                adminData.user,
                expect.any(Object)
            );
            expect(mockCookiesInstance.set).toHaveBeenCalledWith(
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

        setupMockCookies('admin');

        await act(async () => {
            render(<Login />);
        });

        // Wait for courses page
        await waitFor(() => {
            expectElementWithAriaLabelToBeInDocument(ct);
        }, { timeout: 10000 });

        // Click on a course
        await act(async () => {
            clickFirstElementWithAriaLabel(vcib);
        });

        // Wait for View as Student button
        await waitFor(() => {
            expectElementWithAriaLabelToBeInDocument(vasb);
        }, { timeout: 10000 });

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
        setupMockCookies('admin');

        await act(async () => {
            render(<Login />);
        });

        // Wait for courses page
        await waitFor(() => {
            expectElementWithAriaLabelToBeInDocument(ct);
        }, { timeout: 10000 });

        // Click on a course
        await act(async () => {
            clickFirstElementWithAriaLabel(vcib);
        });

        // Wait for View as Student button
        await waitFor(() => {
            expectElementWithAriaLabelToBeInDocument(vasb);
        }, { timeout: 10000 });

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
                String(call[0]).includes('/test_student_token')
            );
            expect(fetchCalls.length).toBe(1);
        });
    });
});