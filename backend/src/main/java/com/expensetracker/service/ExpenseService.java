package com.expensetracker.service;

import com.expensetracker.model.Expense;
import com.expensetracker.repository.ExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ExpenseService {
    
    @Autowired
    private ExpenseRepository expenseRepository;
    
    public List<Expense> getAllExpenses() {
        return expenseRepository.findAll();
    }
    
    public Expense getExpenseById(Long id) {
        return expenseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Expense not found with id: " + id));
    }
    
    public Expense createExpense(Expense expense) {
        return expenseRepository.save(expense);
    }
    
    public Expense updateExpense(Long id, Expense expenseDetails) {
        Expense expense = getExpenseById(id);
        expense.setDescription(expenseDetails.getDescription());
        expense.setAmount(expenseDetails.getAmount());
        expense.setCategory(expenseDetails.getCategory());
        expense.setDate(expenseDetails.getDate());
        return expenseRepository.save(expense);
    }
    
    public void deleteExpense(Long id) {
        Expense expense = getExpenseById(id);
        expenseRepository.delete(expense);
    }
    
    public List<Expense> getExpensesByMonth(int year, int month) {
        return expenseRepository.findByYearAndMonth(year, month);
    }
    
    public Map<String, Double> getMonthlyCategoryTotals(int year, int month) {
        List<Object[]> results = expenseRepository.getMonthlyCategoryTotals(year, month);
        return results.stream()
                .collect(Collectors.toMap(
                    result -> (String) result[0],
                    result -> ((java.math.BigDecimal) result[1]).doubleValue()
                ));
    }
    
    public List<String> getAllCategories() {
        return expenseRepository.findAll().stream()
                .map(Expense::getCategory)
                .distinct()
                .collect(Collectors.toList());
    }
}

