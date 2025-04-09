import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';
import type { ExpensesByCategory, MonthlyExpenses } from '../types';

interface ExpenseChartsProps {
  expensesByCategory: ExpensesByCategory;
  monthlyExpenses: MonthlyExpenses[];
}

// Colors for the pie chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A259FF', '#FF6B6B', '#54A0FF'];

export function ExpenseCharts({ expensesByCategory, monthlyExpenses }: ExpenseChartsProps) {
  // Format data for pie chart with consistent conversion
  const pieData = Object.entries(expensesByCategory).map(([name, value]) => ({
    name,
    value: value, // Apply INR conversion for display
  }));

  // Sort by amount (largest first)
  pieData.sort((a, b) => b.value - a.value);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Expenses by Category</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={false} // Turn off the default labels on the border
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [`₹${value.toFixed(2)}`, 'Amount']}
              />
              <Legend 
                layout="horizontal" 
                verticalAlign="bottom" 
                align="center"
                iconType="circle"
                wrapperStyle={{ paddingTop: '20px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Monthly Expenses</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={monthlyExpenses.map(item => ({
                ...item, 
                amount: item.amount  // Apply INR conversion consistently
              }))}
              margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis 
                tickFormatter={(value) => `₹${value}`}
              />
              <Tooltip 
                formatter={(value: number) => [`₹${value.toFixed(2)}`, 'Amount']}
              />
              <Bar dataKey="amount" fill="#4F46E5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}