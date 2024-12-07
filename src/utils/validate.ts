// Regular expressions for validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+\d{10,15}$/; // Example format: +1234567890

// Validation functions
export const validateEmail = (email: string): boolean => {
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  // Enforce at least 8 characters, including one letter and one number
  return (
    password.length >= 8 && /[a-zA-Z]/.test(password) && /\d/.test(password)
  );
};

export const validateName = (name: string): boolean => {
  // Ensure the name is at least 2 characters long
  return name.trim().length >= 2;
};

export const validatePhoneNumber = (phoneNumber: string): boolean => {
  return phoneRegex.test(phoneNumber);
};

export const validatePrice = (price: number): boolean => {
  return !isNaN(price);
};
