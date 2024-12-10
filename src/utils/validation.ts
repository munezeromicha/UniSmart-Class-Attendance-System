interface ValidationRules {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    email?: boolean;
    match?: string;
  }
  
  interface ValidationErrors {
    [key: string]: string;
  }
  
  export const validateForm = (
    values: { [key: string]: string | number | boolean },
    rules: { [key: string]: ValidationRules }
  ): ValidationErrors => {
    const errors: ValidationErrors = {};
  
    Object.keys(rules).forEach((field) => {
      const value = values[field];
      const fieldRules = rules[field];
  
      if (fieldRules.required && !value) {
        errors[field] = 'This field is required';
      }
  
      if (value && fieldRules.minLength && typeof value === 'string' && value.length < fieldRules.minLength) {
        errors[
          field
        ] = `This field must be at least ${fieldRules.minLength} characters`;
      }
  
      if (value && fieldRules.maxLength && typeof value === 'string' && value.length > fieldRules.maxLength) {
        errors[
          field
        ] = `This field must be no more than ${fieldRules.maxLength} characters`;
      }
  
      if (value && fieldRules.pattern && typeof value === 'string' && !fieldRules.pattern.test(value)) {
        errors[field] = 'This field format is invalid';
      }
  
      if (value && fieldRules.email && typeof value === 'string') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          errors[field] = 'Invalid email address';
        }
      }
      if (
        value &&
        fieldRules.match &&
        value !== values[fieldRules.match]
      ) {
        errors[field] = 'Fields do not match';
      }
    });
  
    return errors;
  };