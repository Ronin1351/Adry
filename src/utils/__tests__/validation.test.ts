import { validateEmail, validatePassword, validatePhoneNumber } from '../validation';

describe('validation utilities', () => {
  describe('validateEmail', () => {
    it('should return true for valid email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
      expect(validateEmail('user+tag@example.org')).toBe(true);
    });

    it('should return false for invalid email addresses', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('')).toBe(false);
      expect(validateEmail('test@.com')).toBe(false);
    });

    it('should handle edge cases', () => {
      expect(validateEmail('test@example')).toBe(false);
      expect(validateEmail('test.example@domain')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('should return true for valid passwords', () => {
      expect(validatePassword('password123')).toBe(true);
      expect(validatePassword('MySecurePass1!')).toBe(true);
      expect(validatePassword('12345678')).toBe(true);
    });

    it('should return false for passwords that are too short', () => {
      expect(validatePassword('12345')).toBe(false);
      expect(validatePassword('')).toBe(false);
    });

    it('should return false for passwords with only letters', () => {
      expect(validatePassword('password')).toBe(false);
      expect(validatePassword('abcdefgh')).toBe(false);
    });
  });

  describe('validatePhoneNumber', () => {
    it('should return true for valid phone numbers', () => {
      expect(validatePhoneNumber('+639123456789')).toBe(true);
      expect(validatePhoneNumber('09123456789')).toBe(true);
      expect(validatePhoneNumber('+1-555-123-4567')).toBe(true);
    });

    it('should return false for invalid phone numbers', () => {
      expect(validatePhoneNumber('123')).toBe(false);
      expect(validatePhoneNumber('abc123')).toBe(false);
      expect(validatePhoneNumber('')).toBe(false);
    });
  });
});
