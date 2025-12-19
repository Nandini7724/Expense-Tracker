import React, { useState } from 'react';
import './ExpenseList.css';

const ExpenseList = ({ expenses, onEdit, onDelete, selectedMonth, selectedYear }) => {
  const [filterCategory, setFilterCategory] = useState('');

  const filteredExpenses = expenses
    .filter(exp => {
      const expDate = new Date(exp.date);
      const matchesMonth = expDate.getMonth() + 1 === selectedMonth;
      const matchesYear = expDate.getFullYear() === selectedYear;
      const matchesCategory = !filterCategory || exp.category === filterCategory;
      return matchesMonth && matchesYear && matchesCategory;
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const categories = [...new Set(expenses.map(exp => exp.category))].sort();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="expense-list-container">
      <div className="expense-list-header">
        <h2>Expenses</h2>
        {categories.length > 0 && (
          <select
            className="category-filter"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        )}
      </div>

      {filteredExpenses.length === 0 ? (
        <div className="empty-state">
          <p>No expenses found for the selected period.</p>
        </div>
      ) : (
        <div className="expense-list">
          {filteredExpenses.map(expense => (
            <div key={expense.id} className="expense-item">
              <div className="expense-item-main">
                <div className="expense-info">
                  <h3 className="expense-description">{expense.description}</h3>
                  <div className="expense-meta">
                    <span className="expense-category">{expense.category}</span>
                    <span className="expense-date">{formatDate(expense.date)}</span>
                  </div>
                </div>
                <div className="expense-amount">${parseFloat(expense.amount).toFixed(2)}</div>
              </div>
              <div className="expense-actions">
                <button
                  className="btn btn-secondary btn-small"
                  onClick={() => onEdit(expense)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-small"
                  onClick={() => onDelete(expense.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExpenseList;

