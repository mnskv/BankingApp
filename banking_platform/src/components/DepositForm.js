import React, { useContext, useState } from 'react';
import { AuthContext } from './context/AuthContext';

const DepositForm = () => {
  const { user, login } = useContext(AuthContext);
  const [amount, setAmount] = useState('');
  const [transactionType, setTransactionType] = useState('Credit'); 
  const [message, setMessage] = useState('');

  const handleTransaction = async (event) => {
    event.preventDefault();
    
    if (transactionType === 'Debit' && parseFloat(amount) > user.initialDeposit) {
      setMessage('Insufficient balance for this transaction.');
      return;
    }

    try {
      const newBalance = transactionType === 'Credit'
        ? user.initialDeposit + parseFloat(amount)
        : user.initialDeposit - parseFloat(amount);

      const response = await fetch(`http://localhost:3001/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          initialDeposit: newBalance,
          lastLogin: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const updatedUser = await response.json();
      login(updatedUser); 
      const transactionResponse = await fetch('http://localhost:3001/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: user.id,
          accountNumber: updatedUser.accountNumber,
          date: new Date().toISOString().split('T')[0], 
          description: transactionType === 'Credit' ? 'Deposit' : 'Withdrawal',
          amount: parseFloat(amount),
          type: transactionType
        })
      });

      if (!transactionResponse.ok) {
        throw new Error('Transaction logging failed');
      }

      setAmount('');
      setMessage('Transaction successful!');
      
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
      setMessage('Transaction failed. Please try again.');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Add Transaction</h2>
      <form onSubmit={handleTransaction}>
        <div className="mb-3">
          <label htmlFor="amount" className="form-label">Amount</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="transactionType" className="form-label">Transaction Type</label>
          <select
            id="transactionType"
            value={transactionType}
            onChange={(e) => setTransactionType(e.target.value)}
            className="form-select"
            required
          >
            <option value="Credit">Deposit</option>
            <option value="Debit">Withdrawal</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
      
      {message && <p>{message}</p>}
    </div>
  );
};

export default DepositForm;
