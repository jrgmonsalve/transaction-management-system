import React, { useState, useEffect, useCallback } from "react";
import {
  fetchTransactions,
} from "../services/api";
import CreateTransactionForm from "./CreateTransactionForm";
import TransactionFilters from "./TransactionFilters";
import TransactionsTable from "./TransactionsTable";
import Pagination from "./Pagination";

const TransactionsDashboard = () => {
  
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");
  const [accountTypeFromFilter, setAccountTypeFromFilter] = useState("");
  const [accountTypeToFilter, setAccountTypeToFilter] = useState("");
  const [sortDirection, setSortDirection] = useState("desc");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    total: 0,
    perPage: 10,
  });

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({
      ...prev,
      currentPage: newPage,
    }));
  };

  const loadTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.currentPage,
        ...(startDateFilter && { start_date: startDateFilter }),
        ...(endDateFilter && { end_date: endDateFilter }),
        ...(accountTypeFromFilter && {
          account_type_from: accountTypeFromFilter,
        }),
        ...(accountTypeToFilter && { account_type_to: accountTypeToFilter }),
        sort_direction: sortDirection,
      });

      const response = await fetchTransactions(params);
      setTransactions(response.data);
      setPagination({
        currentPage: response.current_page,
        lastPage: response.last_page,
        total: response.total,
        perPage: response.per_page,
      });
    } catch (error) {
      console.error("Failed to load transactions:", error);
    } finally {
      setLoading(false);
    }
  }, [
    startDateFilter,
    endDateFilter,
    accountTypeFromFilter,
    accountTypeToFilter,
    sortDirection,
    pagination.currentPage,
  ]);

  // Filter handlers grouped together
  const handleFiltersChange = {
    onStartDateChange: setStartDateFilter,
    onEndDateChange: setEndDateFilter,
    onAccountTypeFromChange: setAccountTypeFromFilter,
    onAccountTypeToChange: setAccountTypeToFilter,
    onSortDirectionChange: setSortDirection,
  };


  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Create Transaction Form Component */}
      <CreateTransactionForm
        onTransactionCreated={loadTransactions}
      />

      {/* Filters Component */}
      <TransactionFilters
        startDate={startDateFilter}
        endDate={endDateFilter}
        accountTypeFromFilter={accountTypeFromFilter}
        accountTypeToFilter={accountTypeToFilter}
        sortDirection={sortDirection}
        {...handleFiltersChange}
      />

      {/* Transactions Table Component */}
      <TransactionsTable
        transactions={transactions}
        loading={loading}
        onTransactionDeleted={loadTransactions}
      />

      {/* Pagination Component */}
      {!loading && transactions.length > 0 && (
        <Pagination
          currentPage={pagination.currentPage}
          lastPage={pagination.lastPage}
          total={pagination.total}
          onPageChange={handlePageChange}
          className="mt-6"
        />
      )}

    </div>
  );
};

export default TransactionsDashboard;
