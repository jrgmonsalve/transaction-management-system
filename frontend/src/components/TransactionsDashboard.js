import React, { useState, useEffect } from 'react';
import { fetchTransactions, deleteTransactionAPI, createTransaction } from '../services/api';

const TransactionsDashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [accountTypeFromFilter, setAccountTypeFromFilter] = useState('');
  const [accountTypeToFilter, setAccountTypeToFilter] = useState('');
  const [sortDirection, setSortDirection] = useState('desc');
  const [newTransaction, setNewTransaction] = useState({
    accountNumberFrom: '',
    accountNumberTypeFrom: 'Savings',
    accountNumberTo: '',
    accountNumberTypeTo: 'Savings',
    amount: '',
    description: '',
    reference: ''
  });

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const response = await fetchTransactions();
      setTransactions(response.data);
    } catch (error) {
      console.error('Failed to load transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTransactionAPI(id);
      loadTransactions();
    } catch (error) {
      console.error('Failed to delete transaction:', error);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      setNewTransaction({...newTransaction, creationDate: new Date().toISOString()});
      await createTransaction(newTransaction);
      setNewTransaction({
        accountNumberFrom: '',
        accountNumberTypeFrom: 'Savings',
        accountNumberTo: '',
        accountNumberTypeTo: 'Savings',
        amount: '',
        description: '',
        reference: '',
      });
      loadTransactions();
    } catch (error) {
      console.error('Failed to create transaction:', error);
    }
  };

  const filteredTransactions = transactions
    .filter(t => !startDate || t.creationDate >= startDate)
    .filter(t => !endDate || t.creationDate <= endDate)
    .filter(t => !accountTypeFromFilter || t.accountTypeFromFilter === accountTypeFromFilter)
    .filter(t => !accountTypeToFilter || t.accountTypeToFilter === accountTypeToFilter)
    .sort((a, b) => {
      const dateA = new Date(a.creationDate);
      const dateB = new Date(b.creationDate);
      return sortDirection === 'desc' ? dateB - dateA : dateA - dateB;
    });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Create Transaction Form */}
      <form onSubmit={handleCreate} className="mb-8 space-y-4 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Create New Transaction</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="From Account Number"
            value={newTransaction.accountNumberFrom}
            onChange={e => setNewTransaction({...newTransaction, accountNumberFrom: e.target.value})}
            className="border rounded p-2"
          />
          <select
            value={newTransaction.accountNumberTypeFrom}
            onChange={e => setNewTransaction({...newTransaction, accountNumberTypeFrom: e.target.value})}
            className="border rounded p-2"
          >
            <option value="Savings">Savings</option>
            <option value="Checking">Checking</option>
            <option value="Credit">Credit</option>
          </select>
          <input
            type="text"
            placeholder="To Account Number"
            value={newTransaction.accountNumberTo}
            onChange={e => setNewTransaction({...newTransaction, accountNumberTo: e.target.value})}
            className="border rounded p-2"
          />
          <select
            value={newTransaction.accountNumberTypeTo}
            onChange={e => setNewTransaction({...newTransaction, accountNumberTypeTo: e.target.value})}
            className="border rounded p-2"
          >
            <option value="Savings">Savings</option>
            <option value="Checking">Checking</option>
            <option value="Credit">Credit</option>
          </select>
          <input
            type="number"
            placeholder="Amount"
            value={newTransaction.amount}
            onChange={e => setNewTransaction({...newTransaction, amount: e.target.value})}
            className="border rounded p-2"
          />
          <input
            type="text"
            placeholder="Description"
            value={newTransaction.description}
            onChange={e => setNewTransaction({...newTransaction, description: e.target.value})}
            className="border rounded p-2"
          />
          <input
            type="text"
            placeholder="Reference"
            value={newTransaction.reference}
            onChange={e => setNewTransaction({...newTransaction, reference: e.target.value})}
            className="border rounded p-2"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Create Transaction
        </button>
      </form>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4 bg-white p-4 rounded-lg shadow">
        <input
          type="date"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
          className="border rounded p-2"
        />
        <input
          type="date"
          value={endDate}
          onChange={e => setEndDate(e.target.value)}
          className="border rounded p-2"
        />
        <select
          value={accountTypeFromFilter}
          onChange={e => setAccountTypeFromFilter(e.target.value)}
          className="border rounded p-2"
        >
          <option value="">All Types</option>
          <option value="Savings">Savings</option>
          <option value="Checking">Checking</option>
          <option value="Credit">Credit</option>
        </select>
        <select
          value={accountTypeToFilter}
          onChange={e => setAccountTypeToFilter(e.target.value)}
          className="border rounded p-2"
        >
          <option value="">All Types</option>
          <option value="Savings">Savings</option>
          <option value="Checking">Checking</option>
          <option value="Credit">Credit</option>
        </select>
        <button
          onClick={() => setSortDirection(prev => prev === 'desc' ? 'asc' : 'desc')}
          className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
        >
          Sort Date {sortDirection === 'desc' ? '↓' : '↑'}
        </button>
      </div>

      {/* Transactions Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center">Loading...</td>
              </tr>
            ) : (
              filteredTransactions.map(transaction => (
                <tr key={transaction.transactionID}>
                  <td className="px-6 py-4 whitespace-nowrap">{transaction.creationDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {transaction.accountNumberFrom}
                    <br />
                    <span className="text-sm text-gray-500">{transaction.accountNumberTypeFrom}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {transaction.accountNumberTo}
                    <br />
                    <span className="text-sm text-gray-500">{transaction.accountNumberTypeTo}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">${transaction.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{transaction.reference}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleDelete(transaction.transactionID)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionsDashboard;