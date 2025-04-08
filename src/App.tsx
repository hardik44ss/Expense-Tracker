import React, { useState, useEffect } from 'react';
import { format, subMonths } from 'date-fns';
import { Wallet } from 'lucide-react';
import { ExpenseForm } from './components/ExpenseForm';
import { ExpenseList } from './components/ExpenseList';
import { ExpenseCharts } from './components/ExpenseCharts';
import { NavigationBar } from './components/NavigationBar';
import { Auth } from './components/Auth';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import type { Expense, ExpensesByCategory, MonthlyExpenses } from './types';

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
    {
      id: crypto.randomUUID(),
      description: 'Movie Night',
      amount: 45.00,
      category: 'Entertainment',
      date: format(subMonths(now, 0), 'yyyy-MM-dd')
    },
    {
      id: crypto.randomUUID(),
      description: 'Electricity Bill',
      amount: 120.50,
      category: 'Bills',
      date: format(subMonths(now, 0), 'yyyy-MM-dd')
    },
    // Last Month
    {
      id: crypto.randomUUID(),
      description: 'Internet Bill',
      amount: 79.99,
      category: 'Bills',
      date: format(subMonths(now, 1), 'yyyy-MM-dd')
    },
    {
      id: crypto.randomUUID(),
      description: 'Restaurant Dinner',
      amount: 85.50,
      category: 'Food',
      date: format(subMonths(now, 1), 'yyyy-MM-dd')
    },
    {
      id: crypto.randomUUID(),
      description: 'Bus Pass',
      amount: 60.00,
      category: 'Transportation',
      date: format(subMonths(now, 1), 'yyyy-MM-dd')
    },
    // Two Months Ago
    {
      id: crypto.randomUUID(),
      description: 'Shopping Mall',
      amount: 245.75,
      category: 'Shopping',
      date: format(subMonths(now, 2), 'yyyy-MM-dd')
    },
    {
      id: crypto.randomUUID(),
      description: 'Gas Bill',
      amount: 95.25,
      category: 'Bills',
      date: format(subMonths(now, 2), 'yyyy-MM-dd')
    },
    {
      id: crypto.randomUUID(),
      description: 'Concert Tickets',
      amount: 150.00,
      category: 'Entertainment',
      date: format(subMonths(now, 2), 'yyyy-MM-dd')
    }
  ];
};

function ExpenseApp() {
  const { user, loading } = useAuth();
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
  const totalExpensesINR = totalExpenses * 75;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg font-medium text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <NavigationBar />
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
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ExpenseApp />
    </AuthProvider>
  );
}

export default App;