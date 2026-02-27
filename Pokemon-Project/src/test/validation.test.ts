import { describe, it, expect, vi } from 'vitest';
import { validateSignUpForm, calculatePasswordStrength } from '../components/pages/SignUp/hooks/validation';

// ─── calculatePasswordStrength ────────────────────────────────────────────────

describe('calculatePasswordStrength', () => {
  it('returns 0 for empty string', () => {
    expect(calculatePasswordStrength('')).toBe(0);
  });

  it('returns 1 for a short lowercase-only password', () => {
    expect(calculatePasswordStrength('abc')).toBe(1); // lowercase only
  });

  it('returns 3 for a password meeting length + upper + lower', () => {
    expect(calculatePasswordStrength('Abcdefgh')).toBe(3); // length + lower + upper
  });

  it('returns 4 for password with length + upper + lower + number', () => {
    expect(calculatePasswordStrength('Abcdefg1')).toBe(4);
  });

  it('returns 5 for a fully strong password', () => {
    expect(calculatePasswordStrength('Abcdefg1!')).toBe(5);
  });
});

// ─── validateSignUpForm ───────────────────────────────────────────────────────

describe('validateSignUpForm', () => {
  const makeSetErrors = () => vi.fn();

  it('returns false and sets errors when all fields are empty', () => {
    const setErrors = makeSetErrors();
    const result = validateSignUpForm({}, setErrors);
    expect(result).toBe(false);
    const errors = setErrors.mock.calls[0][0];
    expect(errors.username).toBeDefined();
    expect(errors.email).toBeDefined();
    expect(errors.password).toBeDefined();
  });

  it('returns false when username is too short', () => {
    const setErrors = makeSetErrors();
    const result = validateSignUpForm(
      { username: 'ab', email: 'test@test.com', password: 'Abcdef1!', confirmPassword: 'Abcdef1!' },
      setErrors
    );
    expect(result).toBe(false);
    expect(setErrors.mock.calls[0][0].username).toBeTruthy();
  });

  it('returns false for an invalid email format', () => {
    const setErrors = makeSetErrors();
    const result = validateSignUpForm(
      { username: 'Ash', email: 'not-an-email', password: 'Abcdef1!', confirmPassword: 'Abcdef1!' },
      setErrors
    );
    expect(result).toBe(false);
    expect(setErrors.mock.calls[0][0].email).toBeTruthy();
  });

  it('returns false when password is too short', () => {
    const setErrors = makeSetErrors();
    const result = validateSignUpForm(
      { username: 'Ash', email: 'ash@pokemon.com', password: 'Ab1!', confirmPassword: 'Ab1!' },
      setErrors
    );
    expect(result).toBe(false);
    expect(setErrors.mock.calls[0][0].password).toBeTruthy();
  });

  it('returns false when password lacks required character types', () => {
    const setErrors = makeSetErrors();
    const result = validateSignUpForm(
      { username: 'Ash', email: 'ash@pokemon.com', password: 'alllowercase', confirmPassword: 'alllowercase' },
      setErrors
    );
    expect(result).toBe(false);
    expect(setErrors.mock.calls[0][0].password).toBeTruthy();
  });

  it('returns false when passwords do not match', () => {
    const setErrors = makeSetErrors();
    const result = validateSignUpForm(
      { username: 'Ash', email: 'ash@pokemon.com', password: 'Abcdef1!', confirmPassword: 'Different1!' },
      setErrors
    );
    expect(result).toBe(false);
    expect(setErrors.mock.calls[0][0].confirmPassword).toBeTruthy();
  });

  it('returns true when all fields are valid', () => {
    const setErrors = makeSetErrors();
    const result = validateSignUpForm(
      { username: 'Ash', email: 'ash@pokemon.com', password: 'Abcdef1!', confirmPassword: 'Abcdef1!' },
      setErrors
    );
    expect(result).toBe(true);
    expect(setErrors.mock.calls[0][0]).toEqual({});
  });
});
