import React from 'react';
import FormInput from './FormInput';
import useTransactionForm from '../hooks/useTransactionForm';

const CreateTransactionForm = ({ onSubmit }) => {
  const {
    formData,
    errors,
    handleInputChange,
    validateForm,
    resetForm
  } = useTransactionForm();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await onSubmit({
        ...formData,
        creationDate: new Date().toISOString()
      });
      resetForm();
    } catch (error) {
      console.error("Failed to create transaction:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 space-y-4 bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Create New Transaction</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          name="accountNumberFrom"
          placeholder="From Account Number (5-15 digits)"
          value={formData.accountNumberFrom}
          onChange={handleInputChange}
          error={errors.accountNumberFrom}
          maxLength={15}
        />
        <select
          name="accountNumberTypeFrom"
          value={formData.accountNumberTypeFrom}
          onChange={handleInputChange}
          className="border rounded p-2"
        >
          <option value="Savings">Savings</option>
          <option value="Checking">Checking</option>
          <option value="Credit">Credit</option>
        </select>

        <FormInput
          name="accountNumberTo"
          placeholder="To Account Number (5-15 digits)"
          value={formData.accountNumberTo}
          onChange={handleInputChange}
          error={errors.accountNumberTo}
          maxLength={15}
        />
        <select
          name="accountNumberTypeTo"
          value={formData.accountNumberTypeTo}
          onChange={handleInputChange}
          className="border rounded p-2"
        >
          <option value="Savings">Savings</option>
          <option value="Checking">Checking</option>
          <option value="Credit">Credit</option>
        </select>

        <FormInput
          name="amount"
          type="number"
          placeholder="Amount"
          value={formData.amount}
          onChange={handleInputChange}
          error={errors.amount}
        />

        <FormInput
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleInputChange}
          error={errors.description}
        />

        <FormInput
          name="reference"
          placeholder="Reference"
          value={formData.reference}
          onChange={handleInputChange}
          error={errors.reference}
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Create Transaction
      </button>
    </form>
  );
};

export default CreateTransactionForm;