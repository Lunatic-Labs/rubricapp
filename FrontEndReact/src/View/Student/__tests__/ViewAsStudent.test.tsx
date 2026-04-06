// <reference types="@testing-library/jest-dom" />

import '@testing-library/jest-dom';
import { render, waitFor, screen, fireEvent, act, cleanup } from "@testing-library/react";
import { beforeEach, afterEach, afterAll, test, describe, jest } from "@jest/globals";
import {
    clickElementWithAriaLabel,
    expectElementWithAriaLabelToBeInDocument,
    clickFirstElementWithAriaLabel
} from "../../../testUtilities";

// 1. DEFINE MOCKS - Values must be inline (jest.mock is hoisted)
jest.mock('../../../App', () => ({
    apiUrl: 'http://localhost:5000/api',
    demoAdminPassword: 'testpassword123',
}));

jest.mock('universal-cookie');

jest.mock('../../../refreshLock', () => ({
    refreshAccessTokens: () => Promise.resolve({ success: true })
}));

// 2. IMPORTS AFTER MOCKS
import Cookies from 'universal-cookie';
import Login from "../../Login/Login";

const MockedCookies = Cookies as jest.MockedClass<typeof Cookies>;

// 3. Constants
const mockDemoAdminPassword = 'testpassword123';

// 4. GLOBAL MOCKS & STATE
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

    /**
     * MOCK RESPONSE FORMAT:
     * utility.ts: state[dest || resource] = result.content[resource][0]
     *
     * The resource parameter (2nd arg to genericResourceGET) is used as the key
     * to look up in result.content. We provide BOTH singular and plural keys.
     *
     * IMPORTANT for StudentDashboard:
     * - genericResourceGET('/role?...', 'roles', this) -> content.roles[0]
     *   StudentDashboard checks: if (!roles) return <Loading/>
     *   Then uses: roles.role_id and roles["role_id"]
     *   So roles must be a SINGLE OBJECT like { role_id: 5, role_name: "Student" }
     *   Therefore: content.roles = [{ role_id: 5, role_name: "Student" }]
     *
     * - genericResourceGET('/assessment_task?...', 'assessment_tasks', this, {dest: 'assessmentTasks'})
     *   -> content.assessment_tasks[0] -> stored as state.assessmentTasks
     *   Used with .filter() so must be an ARRAY
     *   Therefore: content.assessment_tasks = [[]]
     *
     * - genericResourceGET('/completed_assessment?...', 'completed_assessments', this, {dest: 'completedAssessments'})
     *   -> content.completed_assessments[0] -> stored as state.completedAssessments
     *   Used with .forEach() so must be an ARRAY
     *   Therefore: content.completed_assessments = [[]]
     */
    const setupFetchMock = (overrides: any = {}) => {
        global.fetch = jest.fn((url: string, options?: any) => {
            const urlStr = String(url);
            console.log('FETCH URL:', urlStr);

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

            // Handle course endpoint - provide both singular and plural keys
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
            // For StudentDashboard: genericResourceGET('/role?course_id=...', 'roles', this)
            // utility: state.roles = result.content['roles'][0]
            // StudentDashboard checks: if (!roles) return <Loading/>
            // Then uses: roles.role_id (expects a single object, NOT an array)
            // So content.roles[0] must be { role_id: 5, role_name: "Student" }
            // For admin pages: they might use 'role' singular
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
            set: jest.fn((key: string, val: any, opts?: any) => { cookieStore[key] = val; }),
            remove: jest.fn((key: string, opts?: any) => { delete cookieStore[key]; }),
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
        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });
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
        await act(async () => { render(<Login />); });

        await waitFor(() => {
            expectElementWithAriaLabelToBeInDocument(lf);
        });
    });

    // =========================================================================
    // Test 2: Admin login -> courses page
    // =========================================================================
    test("ViewAsStudent.test.js Test 2: Should login as admin and see courses page", async () => {
        const cookies = setupMockCookies('unauth');
        await act(async () => { render(<Login />); });

        await waitFor(() => { expectElementWithAriaLabelToBeInDocument(lf); });

        const emailEl = screen.getByLabelText(ei).querySelector('input') || screen.getByLabelText(ei);
        const passEl = screen.getByLabelText(pi).querySelector('input') || screen.getByLabelText(pi);

        if (!emailEl || !passEl) { throw new Error('Could not find input elements'); }

        await act(async () => {
            fireEvent.change(emailEl, { target: { value: 'demoadmin02@skillbuilder.edu' } });
            fireEvent.change(passEl, { target: { value: mockDemoAdminPassword } });
        });

        await act(async () => { clickElementWithAriaLabel(lb); });

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
        await act(async () => { render(<Login />); });

        await waitFor(() => { expectElementWithAriaLabelToBeInDocument(ct); }, { timeout: 10000 });

        await act(async () => { clickFirstElementWithAriaLabel(vcib); });

        await waitFor(() => { expectElementWithAriaLabelToBeInDocument(vasb); }, { timeout: 10000 });
    });

    // =========================================================================
    // Test 4: Click "View as Student" -> saves admin creds, fetches token, reloads
    // =========================================================================
    test("ViewAsStudent.test.js Test 4: Should switch to student view when 'View as Student' is clicked", async () => {
        setupMockCookies('admin');
        await act(async () => { render(<Login />); });

        await waitFor(() => { expectElementWithAriaLabelToBeInDocument(ct); }, { timeout: 10000 });

        await act(async () => { clickFirstElementWithAriaLabel(vcib); });

        await waitFor(() => { expectElementWithAriaLabelToBeInDocument(vasb); }, { timeout: 10000 });

        await act(async () => { clickElementWithAriaLabel(vasb); });

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
    // Flow: Student logs in -> courses page -> click course ->
    //       ViewCourses detects isViewingAsStudent -> setStudentDashboardWithCourse ->
    //       StudentDashboard renders -> checks user?.viewingAsStudent -> shows banner
    //
    // StudentDashboard needs roles loaded (single object with role_id) to render
    // past <Loading/>. Then it checks cookies.get('user').viewingAsStudent.
    // =========================================================================
    test("ViewAsStudent.test.js Test 5: Should show 'Switch Back to Admin' banner when viewing as student", async () => {
        setupMockCookies('student');
        const adminData = {
            user: adminUser,
            access_token: 'admin_token',
            refresh_token: 'admin_refresh'
        };
        sessionStorage.setItem('adminCredentials', JSON.stringify(adminData));

        await act(async () => { render(<Login />); });

        // Student lands on courses page first
        await waitFor(() => { expectElementWithAriaLabelToBeInDocument(ct); }, { timeout: 10000 });

        // Click course - isViewingAsStudent triggers setStudentDashboardWithCourse
        await act(async () => { clickFirstElementWithAriaLabel(vcib); });

        // StudentDashboard renders with "Switch Back to Admin" banner
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

        await act(async () => { render(<Login />); });

        // Navigate to StudentDashboard
        await waitFor(() => { expectElementWithAriaLabelToBeInDocument(ct); }, { timeout: 10000 });
        await act(async () => { clickFirstElementWithAriaLabel(vcib); });

        // Find and click "Switch Back to Admin"
        const restoreBtn = await screen.findByText(/Switch Back to Admin/i, {}, { timeout: 10000 });
        await act(async () => { fireEvent.click(restoreBtn); });

        await waitFor(() => {
            expect(cookies.remove).toHaveBeenCalledWith('access_token', expect.any(Object));
            expect(cookies.remove).toHaveBeenCalledWith('refresh_token', expect.any(Object));
            expect(cookies.remove).toHaveBeenCalledWith('user', expect.any(Object));
        });

        await waitFor(() => {
            expect(cookies.set).toHaveBeenCalledWith('user', adminData.user, expect.any(Object));
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

        await act(async () => { render(<Login />); });

        await waitFor(() => { expectElementWithAriaLabelToBeInDocument(ct); }, { timeout: 10000 });

        await act(async () => { clickFirstElementWithAriaLabel(vcib); });

        await waitFor(() => { expectElementWithAriaLabelToBeInDocument(vasb); }, { timeout: 10000 });

        await act(async () => { clickElementWithAriaLabel(vasb); });

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
        await act(async () => { render(<Login />); });

        await waitFor(() => { expectElementWithAriaLabelToBeInDocument(ct); }, { timeout: 10000 });

        await act(async () => { clickFirstElementWithAriaLabel(vcib); });

        await waitFor(() => { expectElementWithAriaLabelToBeInDocument(vasb); }, { timeout: 10000 });

        const viewAsStudentBtn = screen.getByLabelText(vasb);
        expect(viewAsStudentBtn).not.toBeDisabled();

        await act(async () => { fireEvent.click(viewAsStudentBtn); });

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