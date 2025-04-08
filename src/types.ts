export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
}

export type ExpensesByCategory = {
  [key: string]: number;
};

export type MonthlyExpenses = {
  date: string;
  amount: number;
};