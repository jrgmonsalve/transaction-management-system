import {act} from 'react';
import { renderHook } from '@testing-library/react';
import { waitFor } from '@testing-library/react';

import useTransactionForm from './useTransactionForm';

describe('useTransactionForm', () => {
  // Test initial state
  test('should initialize with default values', () => {
    const { result } = renderHook(() => useTransactionForm());
    
    expect(result.current.formData).toEqual({
      accountNumberFrom: "",
      accountNumberTypeFrom: "Savings",
      accountNumberTo: "",
      accountNumberTypeTo: "Savings",
      amount: "",
      description: "",
      reference: ""
    });
    expect(result.current.errors).toEqual({});
  });

  // Test handleInputChange
  test('should update form data when handleInputChange is called', () => {
    const { result } = renderHook(() => useTransactionForm());
    
    act(() => {
      result.current.handleInputChange({
        target: { name: 'accountNumberFrom', value: '12345', type: 'text' }
      });
    });

    expect(result.current.formData.accountNumberFrom).toBe('12345');
  });

  // Test number input handling
  test('should handle number inputs correctly', () => {
    const { result } = renderHook(() => useTransactionForm());
    
    act(() => {
      result.current.handleInputChange({
        target: { name: 'amount', value: '100', type: 'number' }
      });
    });

    expect(result.current.formData.amount).toBe(100);
  });

  // Test form validation
  describe('validateForm', () => {
    test('should validate required fields', () => {
      const { result } = renderHook(() => useTransactionForm());
      
      act(() => {
        result.current.validateForm();
      });

      expect(result.current.errors.accountNumberFrom).toBe('Account number from is required');
      expect(result.current.errors.accountNumberTo).toBe('Account number to is required');
      expect(result.current.errors.amount).toBe('Amount is required');
      expect(result.current.errors.description).toBe('Description is required');
      expect(result.current.errors.reference).toBe('Reference is required');
    });

    test('should validate account number format', async () => {
      const { result } = renderHook(() => useTransactionForm());
      
      act(() => {
        result.current.handleInputChange({
          target: { name: 'accountNumberFrom', value: '1234', type: 'text' }
        });
      });
    
      await waitFor(() => {
        expect(result.current.formData.accountNumberFrom).toBe('1234');
      });
    
      act(() => {
        result.current.validateForm();
      });

      expect(result.current.errors.accountNumberFrom).toBe('Account number must be between 5 and 15 digits');
    });

    test('should validate amount is greater than 0', async () => {
      const { result } = renderHook(() => useTransactionForm());
      
      act(() => {
        result.current.handleInputChange({
          target: { name: 'amount', value: '0', type: 'number' }
        });
      });

      await waitFor(() => {
        expect(result.current.formData.amount).toBe(0);
      });
    
      act(() => {
        result.current.validateForm();
      });

      expect(result.current.errors.amount).toBe('Amount must be greater than 0');
    });

    test('should pass validation with valid data', () => {
      const { result } = renderHook(() => useTransactionForm());
      
      act(() => {
        result.current.setFormData({
          accountNumberFrom: "12345",
          accountNumberTypeFrom: "Savings",
          accountNumberTo: "12346",
          accountNumberTypeTo: "Savings",
          amount: "100",
          description: "Test transfer",
          reference: "REF123"
        });
      });

      let isValid;
      act(() => {
        isValid = result.current.validateForm();
      });

      expect(isValid).toBe(true);
      expect(result.current.errors).toEqual({});
    });
  });

  // Test resetForm
  test('should reset form to initial values', () => {
    const { result } = renderHook(() => useTransactionForm());
    
    act(() => {
      result.current.setFormData({
        accountNumberFrom: "12345",
        amount: "100"
      });
      result.current.resetForm();
    });

    expect(result.current.formData).toEqual({
      accountNumberFrom: "",
      accountNumberTypeFrom: "Savings",
      accountNumberTo: "",
      accountNumberTypeTo: "Savings",
      amount: "",
      description: "",
      reference: ""
    });
    expect(result.current.errors).toEqual({});
  });
});