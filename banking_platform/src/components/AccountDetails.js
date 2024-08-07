import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from './context/AuthContext';

const AccountDetails = () => {
  const { user } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:3001/users/${user.id}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
      }
    };

    if (user && user.id) {
      fetchUserData();
    }
  }, [user]);

  if (!userData) {
    return <p>Loading...</p>;
  }

  const { accountNumber, fullName, email, phone, address, city, state, zip, country, dob, initialDeposit, accountType, lastLogin } = userData;

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Account Details</h2>
      <p><strong>Account Number:</strong> {accountNumber}</p>
      <p><strong>Full Name:</strong> {fullName}</p>
      <p><strong>Email:</strong> {email}</p>
      <p><strong>Phone:</strong> {phone}</p>
      <p><strong>Address:</strong> {address}, {city}, {state}, {zip}, {country}</p>
      <p><strong>Date of Birth:</strong> {dob}</p>
      <p><strong>Account Balance:</strong> ${initialDeposit}</p>
      <p><strong>Account Type:</strong> {accountType}</p>
      <p><strong>Last Login:</strong> {new Date(lastLogin).toLocaleString()}</p>
    </div>
  );
};

export default AccountDetails;
