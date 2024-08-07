import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from './context/AuthContext';

const Transactions = () => {
  const { user } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch('http://localhost:3001/transactions');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const allTransactions = await response.json();
        const userTransactions = allTransactions.filter(tx => tx.accountNumber === user.accountNumber);
        setTransactions(userTransactions);
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
      }
    };

    if (user && user.accountNumber) {
      fetchTransactions();
    }
  }, [user]);

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Recent Transactions</h2>
      {transactions.length === 0 ? (
        <p>No transactions available.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>{transaction.date}</td>
                <td>{transaction.description}</td>
                <td>{transaction.amount}</td>
                <td>{transaction.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Transactions;
