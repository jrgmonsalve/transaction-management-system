import React, { useState } from "react";
import Modal from "./Modal";
import { deleteTransactionAPI } from "../services/api";

const TransactionsTable = ({ transactions, loading, onTransactionDeleted }) => {
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });
  const handleDeleteClick = (id) => {
    setDeleteModal({ isOpen: true, id });
  };
  const handleDelete = async () => {
    try {
      await deleteTransactionAPI(deleteModal.id);
      setDeleteModal({ isOpen: false, id: null });
      if (onTransactionDeleted) {
        onTransactionDeleted();
      }
    } catch (error) {
      console.error("Failed to delete transaction:", error);
    }
  };

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              From
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              To
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Amount
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Reference
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {loading ? (
            <tr>
              <td colSpan="7" className="px-6 py-4 text-center">
                Loading...
              </td>
            </tr>
          ) : (
            transactions.map((transaction) => (
              <tr key={transaction.transactionID}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {transaction.creationDate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {transaction.accountNumberFrom}
                  <br />
                  <span className="text-sm text-gray-500">
                    {transaction.accountNumberTypeFrom}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {transaction.accountNumberTo}
                  <br />
                  <span className="text-sm text-gray-500">
                    {transaction.accountNumberTypeTo}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  ${transaction.amount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {transaction.reference}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleDeleteClick(transaction.transactionID)}
                    className="text-red-600 hover:text-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 rounded-md px-3 py-1"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null })}
        onConfirm={handleDelete}
        title="Delete Transaction"
        message="Are you sure you want to delete this transaction? This action cannot be undone."
        icon="delete"
        confirmText="Delete"
        confirmButtonClass="bg-red-600 hover:bg-red-700 focus:ring-red-500"
      />
    </div>
  );
};

export default TransactionsTable;
