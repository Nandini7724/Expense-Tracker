import React, { useState, useEffect } from 'react';
import ExpenseForm from './ExpenseForm';
import ExpenseList from './ExpenseList';
import MonthlyReport from './MonthlyReport';
import { expenseService } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showForm, setShowForm] = useState(false);
  const [reportReloadToken, setReportReloadToken] = useState(0);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await expenseService.getAllExpenses();
      setExpenses(response.data);
    } catch (error) {
      console.error('Error fetching expenses:', error?.response || error);
      alert(error?.response?.data?.message || 'Failed to fetch expenses');
    }
  };

  const handleAddExpense = async (expense) => {
    try {
      const response = await expenseService.createExpense(expense);
      setExpenses([...expenses, response.data]);
      setShowForm(false);
      setReportReloadToken((t) => t + 1);
    } catch (error) {
      console.error('Error adding expense:', error?.response || error);
      alert(error?.response?.data?.message || 'Failed to add expense');
    }
  };

  const handleUpdateExpense = async (id, expense) => {
    try {
      const response = await expenseService.updateExpense(id, expense);
      setExpenses(expenses.map(exp => exp.id === id ? response.data : exp));
      setEditingExpense(null);
      setShowForm(false);
      setReportReloadToken((t) => t + 1);
    } catch (error) {
      console.error('Error updating expense:', error?.response || error);
      alert(error?.response?.data?.message || 'Failed to update expense');
    }
  };

  const handleDeleteExpense = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await expenseService.deleteExpense(id);
        setExpenses(expenses.filter(exp => exp.id !== id));
        setReportReloadToken((t) => t + 1);
      } catch (error) {
        console.error('Error deleting expense:', error?.response || error);
        alert(error?.response?.data?.message || 'Failed to delete expense');
      }
    }
  };

  const handleEditClick = (expense) => {
    setEditingExpense(expense);
    setShowForm(true);
  };

  const handleCancelEdit = () => {
    setEditingExpense(null);
    setShowForm(false);
  };

  const currentMonthExpenses = expenses.filter(exp => {
    const expDate = new Date(exp.date);
    return expDate.getMonth() + 1 === selectedMonth && expDate.getFullYear() === selectedYear;
  });

  const totalAmount = currentMonthExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);

  return (
    <div className="dashboard">
      <div className="container">
        <header className="dashboard-header">
          <h1>💰 Expense Tracker</h1>
          <button 
            className="btn btn-primary" 
            onClick={() => {
              setEditingExpense(null);
              setShowForm(!showForm);
            }}
          >
            {showForm ? 'Cancel' : '+ Add Expense'}
          </button>
        </header>

        {showForm && (
          <ExpenseForm
            expense={editingExpense}
            onSave={editingExpense ? 
              (expense) => handleUpdateExpense(editingExpense.id, expense) : 
              handleAddExpense
            }
            onCancel={handleCancelEdit}
          />
        )}

        <div className="dashboard-content">
          <div className="dashboard-main">
            <div className="stats-container">
              <div className="stat-card">
                <h3>Total Expenses</h3>
                <p className="stat-value">${totalAmount.toFixed(2)}</p>
                <span className="stat-label">This Month</span>
              </div>
              <div className="stat-card">
                <h3>Number of Expenses</h3>
                <p className="stat-value">{currentMonthExpenses.length}</p>
                <span className="stat-label">This Month</span>
              </div>
            </div>

            <MonthlyReport
              year={selectedYear}
              month={selectedMonth}
              onYearChange={setSelectedYear}
              onMonthChange={setSelectedMonth}
              reloadToken={reportReloadToken}
            />

            <ExpenseList
              expenses={expenses}
              onEdit={handleEditClick}
              onDelete={handleDeleteExpense}
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

