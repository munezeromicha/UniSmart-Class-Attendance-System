import { useState, useCallback } from 'react';
import { validateForm } from '../utils/validation';

export interface ValidationRules {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  email?: boolean;
  match?: string;
}

interface UseFormProps<T> {
  initialValues: T;
  validationRules?: { [K in keyof T]?: ValidationRules };
  onSubmit: (values: T) => void | Promise<void>;
}

export function useForm<T extends { [key: string]: string | number | boolean }>({
  initialValues,
  validationRules = {},
  onSubmit,
}: UseFormProps<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<{ [K in keyof T]?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback(
    (name: keyof T) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setValues((prev) => ({ ...prev, [name]: value }));
      
      if (errors[name]) {
        const rule = validationRules[name];
        if (rule) {
          const newErrors = validateForm({ [name]: value }, { [name]: rule });
          setErrors((prev) => ({ ...prev, [name]: newErrors[name as string] }));
        }
      }
    },
    [errors, validationRules]
  );

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    const newErrors = validateForm(values, validationRules as { [key: string]: ValidationRules });
    setErrors(newErrors as { [K in keyof T]?: string });

    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
  };

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    reset,
  };
}