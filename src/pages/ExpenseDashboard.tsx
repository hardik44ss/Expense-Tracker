import React, { useState, useEffect } from 'react';
import { format, subMonths } from 'date-fns';
import { Wallet } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { ExpenseForm } from '../components/ExpenseForm';
import { ExpenseList } from '../components/ExpenseList';
import { ExpenseCharts } from '../components/ExpenseCharts';
import type { Expense, ExpensesByCategory, MonthlyExpenses } from '../types';

// Sample data for the last 3 months
const generateSampleData = (): Expense[] => {
  const now = new Date();
  return [
    // Current Month
    {
      id: crypto.randomUUID(),
      description: 'Grocery Shopping',
      amount: 156.75,
      category: 'Food',
      date: format(now, 'yyyy-MM-dd')
    },
    // ...remaining sample data
    {
      id: crypto.randomUUID(),
      description: 'Concert Tickets',
      amount: 150.00,
      category: 'Entertainment',
      date: format(subMonths(now, 2), 'yyyy-MM-dd')
    }
  ];
};

const ExpenseDashboard: React.FC = () => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem(`expenses-${user?.id || 'guest'}`);
    return saved ? JSON.parse(saved) : generateSampleData();
  });

  useEffect(() => {
    localStorage.setItem(`expenses-${user?.id || 'guest'}`, JSON.stringify(expenses));
  }, [expenses, user?.id]);

  const handleAddExpense = (newExpense: Omit<Expense, 'id'>) => {
    const expense: Expense = {
      ...newExpense,
      id: crypto.randomUUID()
    };
    setExpenses([expense, ...expenses]);
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  const expensesByCategory = expenses.reduce<ExpensesByCategory>((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  const monthlyExpenses: MonthlyExpenses[] = expenses.reduce<MonthlyExpenses[]>((acc, expense) => {
    const monthYear = format(new Date(expense.date), 'MMM yyyy');
    const existingMonth = acc.find(item => item.date === monthYear);
    
    if (existingMonth) {
      existingMonth.amount += expense.amount;
    } else {
      acc.push({ date: monthYear, amount: expense.amount });
    }
    
    return acc;
  }, []).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Calculate total with INR conversion applied only once
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalExpensesINR = totalExpenses;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Wallet className="h-8 w-8 text-blue-600 mr-3" />
          <h1 className="text-2xl font-bold text-gray-900">Personal Expense Tracker</h1>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Total Expenses</p>
          <p className="text-2xl font-bold text-blue-600">₹{totalExpensesINR.toFixed(2)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <ExpenseForm onAddExpense={handleAddExpense} />
        </div>
        
        <div className="lg:col-span-2 space-y-8">
          <ExpenseCharts
            expensesByCategory={expensesByCategory}
            monthlyExpenses={monthlyExpenses}
          />
          
          <ExpenseList
            expenses={expenses}
            onDeleteExpense={handleDeleteExpense}
          />
        </div>
      </div>
    </div>
  );
};

export default ExpenseDashboard;
