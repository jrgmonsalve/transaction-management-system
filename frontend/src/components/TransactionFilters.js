import React from 'react';

const TransactionFilters = ({
  startDate,
  endDate,
  accountTypeFromFilter,
  accountTypeToFilter,
  sortDirection,
  onStartDateChange,
  onEndDateChange,
  onAccountTypeFromChange,
  onAccountTypeToChange,
  onSortDirectionChange,
}) => {
  return (
    <div className="mb-6 flex flex-wrap gap-4 bg-white p-4 rounded-lg shadow">
      <input
        type="date"
        value={startDate}
        onChange={(e) => onStartDateChange(e.target.value)}
        className="border rounded p-2"
      />
      <input
        type="date"
        value={endDate}
        onChange={(e) => onEndDateChange(e.target.value)}
        className="border rounded p-2"
      />
      <select
        value={accountTypeFromFilter}
        onChange={(e) => onAccountTypeFromChange(e.target.value)}
        className="border rounded p-2"
      >
        <option value="">All Types</option>
        <option value="Savings">Savings</option>
        <option value="Checking">Checking</option>
        <option value="Credit">Credit</option>
      </select>
      <select
        value={accountTypeToFilter}
        onChange={(e) => onAccountTypeToChange(e.target.value)}
        className="border rounded p-2"
      >
        <option value="">All Types</option>
        <option value="Savings">Savings</option>
        <option value="Checking">Checking</option>
        <option value="Credit">Credit</option>
      </select>
      <button
        onClick={() => onSortDirectionChange(sortDirection === "desc" ? "asc" : "desc")}
        className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
      >
        Sort Date {sortDirection === "desc" ? "↓" : "↑"}
      </button>
    </div>
  );
};

export default TransactionFilters;