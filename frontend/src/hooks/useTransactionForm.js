import { useState } from 'react';

const useTransactionForm = (initialState = {}) => {
  const [formData, setFormData] = useState({
    accountNumberFrom: "",
    accountNumberTypeFrom: "Savings",
    accountNumberTo: "",
    accountNumberTypeTo: "Savings",
    amount: "",
    description: "",
    reference: "",
    ...initialState
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    
    const processedValue = type === 'number' ? 
      (value === '' ? '' : Number(value)) : 
      value;

    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.accountNumberFrom) {
      newErrors.accountNumberFrom = "Account number from is required";
    } else if (!/^\d{5,15}$/.test(formData.accountNumberFrom)) {
      newErrors.accountNumberFrom = "Account number must be between 5 and 15 digits";
    }

    if (!formData.accountNumberTo) {
      newErrors.accountNumberTo = "Account number to is required";
    } else if (!/^\d{5,15}$/.test(formData.accountNumberTo)) {
      newErrors.accountNumberTo = "Account number must be between 5 and 15 digits";
    }

    if (!formData.amount) {
      newErrors.amount = "Amount is required";
    } else if (parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    }

    if (!formData.description) {
      newErrors.description = "Description is required";
    } else if (formData.description.length < 3) {
      newErrors.description = "Description must be at least 3 characters long";
    }

    if (!formData.reference) {
      newErrors.reference = "Reference is required";
    } else if (formData.reference.length < 3) {
      newErrors.reference = "Reference must be at least 3 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      accountNumberFrom: "",
      accountNumberTypeFrom: "Savings",
      accountNumberTo: "",
      accountNumberTypeTo: "Savings",
      amount: "",
      description: "",
      reference: ""
    });
    setErrors({});
  };

  return {
    formData,
    errors,
    setFormData,
    validateForm,
    handleInputChange,
    resetForm
  };
};

export default useTransactionForm;