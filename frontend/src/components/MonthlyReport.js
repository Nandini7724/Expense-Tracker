import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { expenseService } from '../services/api';
import './MonthlyReport.css';

const MonthlyReport = ({ year, month, onYearChange, onMonthChange, reloadToken = 0 }) => {
  const [categoryTotals, setCategoryTotals] = useState([]);
  const [loading, setLoading] = useState(false);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const COLORS = [
    '#60a5fa', '#22d3ee', '#a78bfa', '#f472b6', '#34d399',
    '#facc15', '#fb7185', '#38bdf8', '#c084fc', '#2dd4bf'
  ];

  useEffect(() => {
    fetchCategoryTotals();
  }, [year, month, reloadToken]);

  const fetchCategoryTotals = async () => {
    setLoading(true);
    try {
      const response = await expenseService.getMonthlyCategoryTotals(year, month);
      const data = Object.entries(response.data).map(([category, amount]) => ({
        category,
        // ensure numeric value for Recharts Pie (strings break the pie)
        amount: Number(amount),
      }));
      setCategoryTotals(data);
    } catch (error) {
      console.error('Error fetching category totals:', error);
      setCategoryTotals([]);
    } finally {
      setLoading(false);
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  return (
    <div className="monthly-report-container">
      <div className="report-header">
        <h2>Monthly Report</h2>
        <div className="date-selectors">
          <select
            className="date-select"
            value={month}
            onChange={(e) => onMonthChange(parseInt(e.target.value))}
          >
            {months.map((m, i) => (
              <option key={i} value={i + 1}>{m}</option>
            ))}
          </select>
          <select
            className="date-select"
            value={year}
            onChange={(e) => onYearChange(parseInt(e.target.value))}
          >
            {years.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">Loading...</div>
      ) : categoryTotals.length === 0 ? (
        <div className="empty-chart">
          <p>No data available for the selected month.</p>
        </div>
      ) : (
        <div className="charts-container">
          <div className="chart-wrapper">
            <h3>Expenses by Category (Bar Chart)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryTotals}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value}`} />
                <Legend />
                <Bar dataKey="amount" fill="#60a5fa" name="Amount ($)" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-wrapper">
            <h3>Expenses by Category (Pie Chart)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryTotals}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ category, percent }) => `${category}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="amount"
                >
                  {categoryTotals.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthlyReport;

