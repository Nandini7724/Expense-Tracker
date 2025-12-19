package com.expensetracker.repository;

import com.expensetracker.model.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    
    List<Expense> findByDateBetween(LocalDate startDate, LocalDate endDate);
    
    List<Expense> findByCategory(String category);
    
    @Query("SELECT e FROM Expense e WHERE YEAR(e.date) = :year AND MONTH(e.date) = :month")
    List<Expense> findByYearAndMonth(@Param("year") int year, @Param("month") int month);
    
    @Query("SELECT e.category, SUM(e.amount) FROM Expense e WHERE YEAR(e.date) = :year AND MONTH(e.date) = :month GROUP BY e.category")
    List<Object[]> getMonthlyCategoryTotals(@Param("year") int year, @Param("month") int month);
}

