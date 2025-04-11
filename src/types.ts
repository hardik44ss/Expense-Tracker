export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
}

export interface ExpensesByCategory {
  [category: string]: number;
}

export interface MonthlyExpenses {
  date: string;
  amount: number;
}