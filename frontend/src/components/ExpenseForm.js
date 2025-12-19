import React, { useState, useEffect } from 'react';
import './ExpenseForm.css';

const ExpenseForm = ({ expense, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (expense) {
      setFormData({
        description: expense.description || '',
        amount: expense.amount || '',
        category: expense.category || '',
        date: expense.date || new Date().toISOString().split('T')[0],
      });
    }
  }, [expense]);

  const categories = [
    'Food',
    'Transportation',
    'Shopping',
    'Bills',
    'Entertainment',
    'Healthcare',
    'Education',
    'Travel',
    'Other',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.description || !formData.amount || !formData.category || !formData.date) {
      alert('Please fill in all fields');
      return;
    }

    const expenseData = {
      description: formData.description.trim(),
      amount: parseFloat(formData.amount),
      category: formData.category,
      date: formData.date, // yyyy-MM-dd
    };

    onSave(expenseData);
    setFormData({
      description: '',
      amount: '',
      category: '',
      date: new Date().toISOString().split('T')[0],
    });
  };

  return (
    <div className="expense-form-container">
      <form className="expense-form" onSubmit={handleSubmit}>
        <h2>{expense ? 'Edit Expense' : 'Add New Expense'}</h2>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter expense description"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="amount">Amount ($)</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0.01"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {expense ? 'Update Expense' : 'Add Expense'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExpenseForm;

