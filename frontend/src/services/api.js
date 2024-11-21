import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL;
const API_KEY = process.env.REACT_APP_API_KEY;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-API-KEY': `${API_KEY}`,
  },
});

export const fetchTransactions = async (params) => {
  try {
    if (!params) {
      params = new URLSearchParams();
    }
    const searchParams = params instanceof URLSearchParams 
      ? params 
      : new URLSearchParams(params);

    const response = await apiClient.get(`/transactions?${searchParams.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
};

export const deleteTransactionAPI = async (id) => {
  try {
    await apiClient.delete(`/transactions/${id}`);
  } catch (error) {
    console.error(`Error deleting transaction with ID ${id}:`, error);
    throw error;
  }
};

export const createTransaction = async (transactionData) => {
  try {
    await apiClient.post('/transactions', transactionData);
  } catch (error) {
    console.log("asd:",transactionData);
    console.error('Error creating transaction:', error);
    throw error;
  }
};
