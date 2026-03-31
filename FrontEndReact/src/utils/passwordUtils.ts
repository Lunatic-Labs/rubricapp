import { MAX_PASSWORD_LENGTH } from '../Constants/password';

/**
 * Password strength levels
 */
export type PasswordStrength = 'STRONG' | 'MEDIUM' | 'WEAK';

/**
 * Result of password validation
 */
export interface ValidationResult {
    isValid: boolean;
    errorMessage?: string;
    errors?: {
        password?: string;
        confirmationPassword?: string;
    };
}

/**
 * Validates a single password field for empty and length constraints
 * @param fieldId - The ID of the field being validated
 * @param value - The value to validate
 * @returns Error message if validation fails, empty string otherwise
 */
export function validatePasswordField(fieldId: string, value: string): string {
    if (value.trim() === '') {
        return `${fieldId.charAt(0).toUpperCase() + fieldId.slice(1)} cannot be empty`;
    }
    if ((fieldId === 'password' || fieldId === 'confirmationPassword') && value.length > MAX_PASSWORD_LENGTH) {
        return `Password cannot exceed ${MAX_PASSWORD_LENGTH} characters`;
    }
    return '';
}

/**
 * Validates password length against MAX_PASSWORD_LENGTH
 * @param password - The password to validate
 * @returns True if valid, false otherwise
 */
export function validatePasswordLength(password: string): boolean {
    return password.length <= MAX_PASSWORD_LENGTH;
}

/**
 * Computes password strength using criteria including:
 * - Minimum length (8 characters)
 * - Uppercase letters
 * - Lowercase letters
 * - Numbers
 * - Special characters
 * @param password - The password to test
 * @returns The password strength level: "STRONG", "MEDIUM", or "WEAK"
 */
export function testPasswordStrength(password: string): PasswordStrength {
    if (!password) return 'WEAK';

    const atLeastMinimumLength = (password: string) => new RegExp(/(?=.{8,})/).test(password);
    const atLeastOneUppercaseLetter = (password: string) => new RegExp(/(?=.*?[A-Z])/).test(password);
    const atLeastOneLowercaseLetter = (password: string) => new RegExp(/(?=.*?[a-z])/).test(password);
    const atLeastOneNumber = (password: string) => new RegExp(/(?=.*?[0-9])/).test(password);
    const atLeastOneSpecialChar = (password: string) => new RegExp(/(?=.*?[#?!@$%^&*-])/).test(password);

    let points = 0;

    if (atLeastMinimumLength(password)) points += 1;
    if (atLeastOneUppercaseLetter(password)) points += 1;
    if (atLeastOneLowercaseLetter(password)) points += 1;
    if (atLeastOneNumber(password)) points += 1;
    if (atLeastOneSpecialChar(password)) points += 1;

    if (points >= 5) return 'STRONG';
    if (points >= 3) return 'MEDIUM';

    return 'WEAK';
}

/**
 * Returns the appropriate password strength icon component name
 * @param strength - The strength level
 * @returns The icon component name: 'CheckIcon' or 'ErrorOutlineIcon'
 */
export function getPasswordStrengthIcon(strength: PasswordStrength): string {
    switch (strength) {
        case 'STRONG':
            return 'CheckIcon';
        case 'WEAK':
        case 'MEDIUM':
            return 'ErrorOutlineIcon';
        default:
            return 'ErrorOutlineIcon';
    }
}

/**
 * Color constants for password strength visualization
 */
export const PASSWORD_STRENGTH_COLORS = {
    NEUTRAL: '#E2E2E2',
    WEAK: '#B40314',
    MEDIUM: '#D39323',
    STRONG: '#387b44',
} as const;

/**
 * Returns the appropriate strength bar colors for UI visualization
 * @param strength - The strength level
 * @returns Array of 4 color codes for the strength indicator bars
 */
export function generatePasswordStrengthColors(strength: PasswordStrength): string[] {
    switch (strength) {
        case 'STRONG':
            return [
                PASSWORD_STRENGTH_COLORS.STRONG,
                PASSWORD_STRENGTH_COLORS.STRONG,
                PASSWORD_STRENGTH_COLORS.STRONG,
                PASSWORD_STRENGTH_COLORS.STRONG
            ];
        case 'WEAK':
            return [
                PASSWORD_STRENGTH_COLORS.WEAK,
                PASSWORD_STRENGTH_COLORS.NEUTRAL,
                PASSWORD_STRENGTH_COLORS.NEUTRAL,
                PASSWORD_STRENGTH_COLORS.NEUTRAL
            ];
        case 'MEDIUM':
            return [
                PASSWORD_STRENGTH_COLORS.MEDIUM,
                PASSWORD_STRENGTH_COLORS.MEDIUM,
                PASSWORD_STRENGTH_COLORS.NEUTRAL,
                PASSWORD_STRENGTH_COLORS.NEUTRAL
            ];
        default:
            return [
                PASSWORD_STRENGTH_COLORS.WEAK,
                PASSWORD_STRENGTH_COLORS.NEUTRAL,
                PASSWORD_STRENGTH_COLORS.NEUTRAL,
                PASSWORD_STRENGTH_COLORS.NEUTRAL
            ];
    }
}

/**
 * Comprehensive validation for password reset/change operations
 * Validates:
 * - Password cannot be empty
 * - Confirmation password cannot be empty
 * - Password cannot exceed MAX_PASSWORD_LENGTH
 * - Confirmation password cannot exceed MAX_PASSWORD_LENGTH
 * - Passwords must match
 * - Password must be STRONG
 * 
 * @param password - The new password
 * @param confirmationPassword - The confirmation password
 * @returns ValidationResult with success status and any error messages
 */
export function validatePasswordReset(password: string, confirmationPassword: string): ValidationResult {
    // Validate password is not empty
    if (password === '') {
        return {
            isValid: false,
            errorMessage: 'Password cannot be empty'
        };
    }

    // Validate confirmation password is not empty
    if (confirmationPassword === '') {
        return {
            isValid: false,
            errorMessage: 'Confirm Password cannot be empty'
        };
    }

    // Validate password length
    if (!validatePasswordLength(password)) {
        return {
            isValid: false,
            errorMessage: `Password cannot exceed ${MAX_PASSWORD_LENGTH} characters`
        };
    }

    // Validate confirmation password length
    if (!validatePasswordLength(confirmationPassword)) {
        return {
            isValid: false,
            errorMessage: `Password cannot exceed ${MAX_PASSWORD_LENGTH} characters`
        };
    }

    // Validate passwords match
    if (password !== confirmationPassword) {
        return {
            isValid: false,
            errorMessage: 'Passwords do not match',
            errors: {
                password: 'Passwords do not match',
                confirmationPassword: 'Passwords do not match'
            }
        };
    }

    // Validate password strength
    if (testPasswordStrength(password) !== 'STRONG') {
        return {
            isValid: false,
            errorMessage: 'Please verify your password strength'
        };
    }

    return { isValid: true };
}

/**
 * Submits a password change request to the backend API
 * @param apiUrl - The base API URL
 * @param email - The user's email address
 * @param password - The new password
 * @returns Promise with the API response
 */
export async function submitPasswordChange(apiUrl: string, email: string, password: string): Promise<any> {
    const response = await fetch(
        apiUrl + "/password",
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        }
    );

    return await response.json();
}
