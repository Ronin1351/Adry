/**
 * Validation utilities for form inputs and data
 */

/**
 * Validates email address format
 * @param email - Email address to validate
 * @returns true if email is valid, false otherwise
 */
export function validateEmail(email: string): boolean {
  if (!email || typeof email !== 'string') {
    return false;
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates password strength
 * Password must be at least 8 characters and contain:
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 * @param password - Password to validate
 * @returns true if password meets requirements, false otherwise
 */
export function validatePassword(password: string): boolean {
  if (!password || typeof password !== 'string') {
    return false;
  }

  // Minimum 8 characters
  if (password.length < 8) {
    return false;
  }

  // Check for uppercase letter
  if (!/[A-Z]/.test(password)) {
    return false;
  }

  // Check for lowercase letter
  if (!/[a-z]/.test(password)) {
    return false;
  }

  // Check for number
  if (!/[0-9]/.test(password)) {
    return false;
  }

  // Check for special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return false;
  }

  return true;
}

/**
 * Get password strength level
 * @param password - Password to check
 * @returns strength level (weak, medium, strong)
 */
export function getPasswordStrength(password: string): 'weak' | 'medium' | 'strong' {
  if (!password) return 'weak';

  let strength = 0;
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength++;

  if (strength < 3) return 'weak';
  if (strength < 5) return 'medium';
  return 'strong';
}

/**
 * Validates phone number format
 * @param phone - Phone number to validate
 * @returns true if phone number is valid, false otherwise
 */
export function validatePhoneNumber(phone: string): boolean {
  if (!phone || typeof phone !== 'string') {
    return false;
  }
  
  // Remove all non-digit characters except +
  const cleaned = phone.replace(/[^\d+]/g, '');
  
  // Check if it's a valid phone number format
  const phoneRegex = /^(\+?63|0)?[0-9]{10}$/;
  return phoneRegex.test(cleaned);
}

/**
 * Validates required field
 * @param value - Value to validate
 * @returns true if value is not empty, false otherwise
 */
export function validateRequired(value: unknown): boolean {
  if (value === null || value === undefined) {
    return false;
  }
  
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  
  return true;
}

/**
 * Validates string length
 * @param value - String to validate
 * @param min - Minimum length
 * @param max - Maximum length
 * @returns true if length is within bounds, false otherwise
 */
export function validateLength(value: string, min: number, max?: number): boolean {
  if (!value || typeof value !== 'string') {
    return false;
  }
  
  if (value.length < min) {
    return false;
  }
  
  if (max !== undefined && value.length > max) {
    return false;
  }
  
  return true;
}
