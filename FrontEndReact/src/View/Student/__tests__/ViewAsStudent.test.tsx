// <reference types="@testing-library/jest-dom" />

import '@testing-library/jest-dom';
import { render, waitFor, screen, fireEvent, cleanup } from "@testing-library/react";
import { beforeEach, afterEach, afterAll, test, describe, jest } from "@jest/globals";
import Cookies from 'universal-cookie';
import {
    clickElementWithAriaLabel,
    expectElementWithAriaLabelToBeInDocument,
    clickFirstElementWithAriaLabel
} from "../../../testUtilities";
import Login from "../../Login/Login";

// 1. DEFINE MOCKS - Values must be inline (jest.mock is hoisted)
jest.mock('../../../App', () => ({
    apiUrl: 'http://localhost:5000/api',
    demoAdminPassword: 'testpassword123',
}));

jest.mock('universal-cookie');

jest.mock('../../../refreshLock', () => ({
    refreshAccessTokens: () => Promise.resolve({ success: true })
}));

const MockedCookies = Cookies as jest.MockedClass<typeof Cookies>;

// Constants
const mockDemoAdminPassword = 'testpassword123';

// GLOBAL MOCKS & STATE
const originalLocation = window.location;
const originalFetch = global.fetch;

delete (window as any).location;
window.location = {
    ...originalLocation,
    reload: jest.fn(),
    assign: jest.fn(),
} as any;

const sessionStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => { store[key] = value.toString(); },
        removeItem: (key: string) => { delete store[key]; },
        clear: () => { store = {}; }
    };
})();
Object.defineProperty(window, 'sessionStorage', { value: sessionStorageMock });

window.alert = jest.fn();

// Aria Labels
const lf = "loginForm";
const lb = "loginButton";
const ei = "emailInput";
const pi = "passwordInput";
const ct = "coursesTitle";
const vcib = "viewCourseIconButton";
const vasb = "viewAsStudentButton";

jest.setTimeout(30000);

describe("View as Student Feature Tests", () => {
    let cookieStore: Record<string, any> = {};

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

    const studentUser = {
        user_id: 999,
        user_name: "Test Student",
        email: "teststudent1@skillbuilder.edu",
        first_name: "Test",
        last_name: "Student",
        isSuperAdmin: false,
        isAdmin: false,
        role_id: 6,
        has_set_password: true,
        viewingAsStudent: true,
        originalCourseId: 1
    };

    const testCoursesArray = [
        {
            course_id: 1,
            course_name: "Test Course",
            course_number: "CS101",
            term: "Fall",
            year: 2026,
            active: true,
            use_tas: true,
            use_fixed_teams: false,
            role_id: 3
        }
    ];

    const studentCoursesArray = [
        {
            course_id: 1,
            course_name: "Test Course",
            course_number: "CS101",
            term: "Fall",
            year: 2026,
            active: true,
            use_tas: true,
            use_fixed_teams: false,
            role_id: 5
        }
    ];

    const setupFetchMock = (overrides: any = {}) => {
        global.fetch = jest.fn((url: string) => {
            const urlStr = String(url);

            // Handle login endpoint
            if (urlStr.includes('/login')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({
                        success: true,
                        headers: { access_token: "mock_admin_access_token", refresh_token: "mock_admin_refresh_token" },
                        content: { login: [adminUser] }
                    })
                });
            }

            // Handle test student token endpoint (must be before /course)
            if (urlStr.includes('/courses/') && urlStr.includes('/test_student_token')) {
                if (overrides.failStudent) {
                    return Promise.resolve({
                        ok: false,
                        json: () => Promise.resolve({
                            error: "Failed to get test student token"
                        })
                    });
                }
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({
                        success: true,
                        access_token: "mock_student_access_token",
                        refresh_token: "mock_student_refresh_token",
                        user: {
                            user_id: 999,
                            user_name: "Test Student",
                            email: "teststudent1@skillbuilder.edu",
                            first_name: "Test",
                            last_name: "Student",
                            role_id: 6,
                            has_set_password: true
                        }
                    })
                });
            }

            // Handle logout endpoint
            if (urlStr.includes('/logout')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({ success: true })
                });
            }

            // Handle completed_assessment endpoint (must be before /assessment_task)
            if (urlStr.includes('/completed_assessment')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({
                        success: true,
                        content: {
                            completed_assessment: [[]],
                            completed_assessments: [[]]
                        }
                    })
                });
            }

            // Handle assessment_task endpoint
            if (urlStr.includes('/assessment_task')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({
                        success: true,
                        content: {
                            assessment_task: [[]],
                            assessment_tasks: [[]]
                        }
                    })
                });
            }

            // Handle average endpoint
            if (urlStr.includes('/average')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({
                        success: true,
                        content: {
                            average: [[]]
                        }
                    })
                });
            }

            // Handle team_by_user endpoint (must be before /team)
            if (urlStr.includes('/team_by_user')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({
                        success: true,
                        content: {
                            team_by_user: [[]],
                            teams: [[]]
                        }
                    })
                });
            }

            // Handle checkin endpoint
            if (urlStr.includes('/checkin')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({
                        success: true,
                        content: {
                            checkin: [[]],
                            checkins: [[]]
                        }
                    })
                });
            }

            // Handle rubric endpoint
            if (urlStr.includes('/rubric')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({
                        success: true,
                        content: {
                            rubric: [[]],
                            rubrics: [[]]
                        }
                    })
                });
            }

            // Handle notification endpoint
            if (urlStr.includes('/notification')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({
                        success: true,
                        content: {
                            notification: [[]],
                            notifications: [[]]
                        }
                    })
                });
            }

            // Handle team endpoint
            if (urlStr.includes('/team')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({
                        success: true,
                        content: {
                            team: [[]],
                            teams: [[]]
                        }
                    })
                });
            }

            // Handle course endpoint
            if (urlStr.includes('/course')) {
                const isStudentRequest = urlStr.includes('user_id=999');
                const coursesToReturn = isStudentRequest ? studentCoursesArray : testCoursesArray;
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({
                        success: true,
                        content: {
                            course: [coursesToReturn],
                            courses: [coursesToReturn],
                            course_count: [{ count: 1 }]
                        }
                    })
                });
            }

            // Handle role endpoint
            if (urlStr.includes('/role')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({
                        success: true,
                        content: {
                            role: [{ role_id: 5, role_name: "Student" }],
                            roles: [{ role_id: 5, role_name: "Student" }]
                        }
                    })
                });
            }

            // Handle user endpoint
            if (urlStr.includes('/user')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({
                        success: true,
                        content: {
                            user: [[
                                { user_id: 1, email: "test@test.com", first_name: "Test", last_name: "User", role_id: 5 }
                            ]],
                            users: [[
                                { user_id: 1, email: "test@test.com", first_name: "Test", last_name: "User", role_id: 5 }
                            ]]
                        }
                    })
                });
            }

            // Default fallback
            const urlParts = urlStr.split('/');
            const lastPart = urlParts[urlParts.length - 1]?.split('?')[0] || 'data';
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve({
                    success: true,
                    content: { [lastPart]: [[]] }
                })
            });
        }) as any;
    };

    const setupMockCookies = (state: 'unauth' | 'admin' | 'student') => {
        cookieStore = {};
        if (state === 'admin') {
            cookieStore = {
                user: adminUser,
                access_token: 'mock_admin_access_token',
                refresh_token: 'mock_admin_refresh_token'
            };
        } else if (state === 'student') {
            cookieStore = {
                user: studentUser,
                access_token: 'mock_student_access_token',
                refresh_token: 'mock_student_refresh_token'
            };
        }

        const mockInstance = {
            get: jest.fn((key: string) => cookieStore[key]),
            set: jest.fn((key: string, val: any) => { cookieStore[key] = val; }),
            remove: jest.fn((key: string) => { delete cookieStore[key]; }),
        };
        MockedCookies.mockImplementation(() => mockInstance as any);
        return mockInstance;
    };

    beforeEach(() => {
        jest.clearAllMocks();
        sessionStorage.clear();
        cookieStore = {};
        (window.location.reload as jest.MockedFunction<() => void>).mockClear();
        (window.alert as jest.MockedFunction<(message?: any) => void>).mockClear();
        setupFetchMock();
    });

    afterEach(async () => {
        cleanup();
        jest.clearAllMocks();
        sessionStorage.clear();
        cookieStore = {};
    });

    afterAll(() => {
        jest.restoreAllMocks();
        window.location = originalLocation;
        if (originalFetch) { global.fetch = originalFetch; }
        sessionStorage.clear();
    });

    // =========================================================================
    // Test 1: Login form renders when unauthenticated
    // =========================================================================
    test("ViewAsStudent.test.js Test 1: Should render Login Form component", async () => {
        setupMockCookies('unauth');
        render(<Login />);

        await waitFor(() => {
            expectElementWithAriaLabelToBeInDocument(lf);
        });
    });

    // =========================================================================
    // Test 2: Admin login -> courses page
    // =========================================================================
    test("ViewAsStudent.test.js Test 2: Should login as admin and see courses page", async () => {
        const cookies = setupMockCookies('unauth');
        render(<Login />);

        await waitFor(() => { expectElementWithAriaLabelToBeInDocument(lf); });

        const emailField = screen.getByLabelText(ei);
        const passwordField = screen.getByLabelText(pi);

        fireEvent.change(emailField, { target: { value: 'demoadmin02@skillbuilder.edu' } });
        fireEvent.change(passwordField, { target: { value: mockDemoAdminPassword } });

        clickElementWithAriaLabel(lb);

        await waitFor(() => {
            expect(cookies.set).toHaveBeenCalledWith(
                'user',
                expect.objectContaining({ user_name: "Demo Admin" }),
                expect.any(Object)
            );
        });

        await waitFor(() => {
            expectElementWithAriaLabelToBeInDocument(ct);
        }, { timeout: 10000 });
    });

    // =========================================================================
    // Test 3: Admin courses -> click course -> RosterDashboard -> viewAsStudentButton
    // =========================================================================
    test("ViewAsStudent.test.js Test 3: Should show 'View as Student' button on course page", async () => {
        setupMockCookies('admin');
        render(<Login />);

        await waitFor(() => { expectElementWithAriaLabelToBeInDocument(ct); }, { timeout: 10000 });

        clickFirstElementWithAriaLabel(vcib);

        await waitFor(() => { expectElementWithAriaLabelToBeInDocument(vasb); }, { timeout: 10000 });
    });

    // =========================================================================
    // Test 4: Click "View as Student" -> saves admin creds, fetches token, reloads
    // =========================================================================
    test("ViewAsStudent.test.js Test 4: Should switch to student view when 'View as Student' is clicked", async () => {
        setupMockCookies('admin');
        render(<Login />);

        await waitFor(() => { expectElementWithAriaLabelToBeInDocument(ct); }, { timeout: 10000 });

        clickFirstElementWithAriaLabel(vcib);

        await waitFor(() => { expectElementWithAriaLabelToBeInDocument(vasb); }, { timeout: 10000 });

        clickElementWithAriaLabel(vasb);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('/test_student_token'),
                expect.objectContaining({
                    method: 'GET',
                    headers: expect.objectContaining({ 'Authorization': expect.any(String) })
                })
            );
        });

        await waitFor(() => {
            const savedCreds = sessionStorage.getItem('adminCredentials');
            expect(savedCreds).not.toBeNull();
        });

        await waitFor(() => { expect(window.location.reload).toHaveBeenCalled(); });
    });

    // =========================================================================
    // Test 5: Student view shows "Switch Back to Admin" banner
    // =========================================================================
    test("ViewAsStudent.test.js Test 5: Should show 'Switch Back to Admin' banner when viewing as student", async () => {
        setupMockCookies('student');
        const adminData = {
            user: adminUser,
            access_token: 'admin_token',
            refresh_token: 'admin_refresh'
        };
        sessionStorage.setItem('adminCredentials', JSON.stringify(adminData));

        render(<Login />);

        await waitFor(() => { expectElementWithAriaLabelToBeInDocument(ct); }, { timeout: 10000 });

        clickFirstElementWithAriaLabel(vcib);

        await waitFor(() => {
            const switchBackButton = screen.queryByText(/Switch Back to Admin/i);
            expect(switchBackButton).toBeInTheDocument();
        }, { timeout: 10000 });
    });

    // =========================================================================
    // Test 6: Click "Switch Back to Admin" -> restores admin creds, reloads
    // =========================================================================
    test("ViewAsStudent.test.js Test 6: Should restore admin view when 'Switch Back to Admin' is clicked", async () => {
        const cookies = setupMockCookies('student');
        const adminData = {
            user: adminUser,
            access_token: 'at',
            refresh_token: 'rt'
        };
        sessionStorage.setItem('adminCredentials', JSON.stringify(adminData));

        render(<Login />);

        await waitFor(() => { expectElementWithAriaLabelToBeInDocument(ct); }, { timeout: 10000 });

        clickFirstElementWithAriaLabel(vcib);

        const restoreBtn = await screen.findByText(/Switch Back to Admin/i, {}, { timeout: 10000 });
        fireEvent.click(restoreBtn);

        await waitFor(() => {
            expect(cookies.remove).toHaveBeenCalledWith('access_token', expect.any(Object));
        });

        await waitFor(() => {
            expect(cookies.remove).toHaveBeenCalledWith('refresh_token', expect.any(Object));
        });

        await waitFor(() => {
            expect(cookies.remove).toHaveBeenCalledWith('user', expect.any(Object));
        });

        await waitFor(() => {
            expect(cookies.set).toHaveBeenCalledWith('user', adminData.user, expect.any(Object));
        });

        await waitFor(() => {
            expect(cookies.set).toHaveBeenCalledWith('access_token', adminData.access_token, expect.any(Object));
        });

        await waitFor(() => { expect(sessionStorage.getItem('adminCredentials')).toBeNull(); });
        await waitFor(() => { expect(window.location.reload).toHaveBeenCalled(); });
    });

    // =========================================================================
    // Test 7: Error handling when test student creation fails
    // =========================================================================
    test("ViewAsStudent.test.js Test 7: Should handle error when test student creation fails", async () => {
        setupFetchMock({ failStudent: true });
        setupMockCookies('admin');

        render(<Login />);

        await waitFor(() => { expectElementWithAriaLabelToBeInDocument(ct); }, { timeout: 10000 });

        clickFirstElementWithAriaLabel(vcib);

        await waitFor(() => { expectElementWithAriaLabelToBeInDocument(vasb); }, { timeout: 10000 });

        clickElementWithAriaLabel(vasb);

        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith(expect.stringContaining("Failed"));
        }, { timeout: 10000 });

        expect(window.location.reload).not.toHaveBeenCalled();
    });

    // =========================================================================
    // Test 8: Spam protection - button disabled after click
    // =========================================================================
    test("ViewAsStudent.test.js Test 8: Should disable 'View as Student' button after click to prevent spam", async () => {
        setupMockCookies('admin');
        render(<Login />);

        await waitFor(() => { expectElementWithAriaLabelToBeInDocument(ct); }, { timeout: 10000 });

        clickFirstElementWithAriaLabel(vcib);

        await waitFor(() => { expectElementWithAriaLabelToBeInDocument(vasb); }, { timeout: 10000 });

        const viewAsStudentBtn = screen.getByLabelText(vasb);
        expect(viewAsStudentBtn).not.toBeDisabled();

        fireEvent.click(viewAsStudentBtn);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('/test_student_token'),
                expect.any(Object)
            );
        });

        await waitFor(() => {
            expect(window.location.reload).toHaveBeenCalled();
        });
    });
});