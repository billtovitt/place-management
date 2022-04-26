const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
const PHONE_NUMBER_REGEX = /^\(*\+*[1-9]{0,3}\)*-*[1-9]{0,3}[-. /]*\(*[2-9]\d{2}\)*[-. /]*\d{3}[-. /]*\d{4} *e*x*t*\.* *\d{0,4}$/;
const USERNAME_REGEX = /[^a-z|^A-Z|@]/;

export const required = (value) => value || value === 0 ? undefined : 'Required';

export const maxLength = (max) => (value) =>
  value && value.length > max ? `Must be ${max} characters or less` : undefined;

export const minLength = (min) => (value) =>
  value && value.length < min ? `Must be at least ${min} characters` : undefined;

export const password = minLength(8);

export const number = (value) => value && isNaN(Number(value)) ? 'Must be a number' : undefined;

export const minValue = (min) => (value) =>
  value && value < min ? `Must be at least ${min}` : undefined;

export const email = (value) =>
  value && !EMAIL_REGEX.test(value) ? 'Invalid email address' : undefined;

export const phoneNumber = (value) =>
  value && !PHONE_NUMBER_REGEX.test(value) ? 'Invalid phone number' : undefined;

export const confirmation = (field, message = 'don\'t match') => (value, allValues) =>
  value && value != allValues[field] ? message : undefined;

export const isEmail = (value) => value && EMAIL_REGEX.test(value);

export const username = (value) =>
  value && USERNAME_REGEX.test(value) ? 'Invalid username' : undefined;
