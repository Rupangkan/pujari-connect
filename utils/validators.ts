/**
 * Validators — Input validation utility functions
 */

/**
 * Validate an Indian mobile phone number (10 digits, starting with 6-9).
 * @example isValidPhone('9876543210') → true
 * @example isValidPhone('1234567890') → false
 * @example isValidPhone('98765')      → false
 */
export const isValidPhone = (phone: string): boolean => {
  return /^[6-9]\d{9}$/.test(phone);
};

/**
 * Validate a 6-digit OTP.
 * @example isValidOtp('123456') → true
 * @example isValidOtp('12345')  → false
 * @example isValidOtp('abcdef') → false
 */
export const isValidOtp = (otp: string): boolean => {
  return /^\d{6}$/.test(otp);
};

/**
 * Validate an email address using a standard pattern.
 * @example isValidEmail('user@example.com') → true
 * @example isValidEmail('user@.com')        → false
 */
export const isValidEmail = (email: string): boolean => {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
};

/**
 * Validate an Indian PIN code (6 digits, first digit 1-9).
 * @example isValidPinCode('110001') → true
 * @example isValidPinCode('012345') → false
 * @example isValidPinCode('1234')   → false
 */
export const isValidPinCode = (pin: string): boolean => {
  return /^[1-9]\d{5}$/.test(pin);
};
