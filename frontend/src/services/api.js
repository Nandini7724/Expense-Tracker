import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/expenses';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const expenseService = {
  getAllExpenses: () => api.get(''),
  getExpenseById: (id) => api.get(`${id}`),
  createExpense: (expense) => api.post('', expense),
  updateExpense: (id, expense) => api.put(`${id}`, expense),
  deleteExpense: (id) => api.delete(`${id}`),
  getMonthlyExpenses: (year, month) => api.get('monthly', { params: { year, month } }),
  getMonthlyCategoryTotals: (year, month) => api.get('monthly/category-totals', { params: { year, month } }),
  getAllCategories: () => api.get('categories'),
};

export default api;

