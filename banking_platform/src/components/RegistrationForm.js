import React, { useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { AuthContext } from './context/AuthContext';

const RegistrationForm = () => {
  const { login } = useContext(AuthContext);

  const formik = useFormik({
    initialValues: {
      accountNumber: uuidv4(),
      fullName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      country: '',
      dob: '',
      initialDeposit: '',
      password: '',
      accountType:'',
    },
    validationSchema: Yup.object({
      fullName: Yup.string().required('Full Name is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      phone: Yup.string().required('Phone Number is required'),
      address: Yup.string().required('Address is required'),
      city: Yup.string().required('City is required'),
      state: Yup.string().required('State is required'),
      zip: Yup.string().required('Zip Code is required'),
      country: Yup.string().required('Country is required'),
      dob: Yup.date().required('Date of Birth is required'),
      initialDeposit: Yup.number().required('Initial Deposit is required').typeError('Initial Deposit must be a number'),
      password: Yup.string().required('Password is required'),
      accountType: Yup.string().required('Account Type is required'),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await fetch('http://localhost:3001/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(values)
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        login(data);
        console.log('Form data submitted:', data);
        resetForm();
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="container mt-5">
      <center className="mb-4">
          <h2 className="font-weight-bold text-primary">SignUp Details</h2>
        </center>
      <div className="mb-3">
        <label htmlFor="accountNumber" className="form-label">Account Number</label>
        <input type="text" name="accountNumber" value={formik.values.accountNumber} readOnly className="form-control" />
      </div>
      {[
        { name: 'fullName', label: 'Full Name', type: 'text', placeholder: 'Full Name' },
        { name: 'email', label: 'Email Address', type: 'email', placeholder: 'Email Address' },
        { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: 'Phone Number' },
        { name: 'address', label: 'Address', type: 'text', placeholder: 'Address' },
        { name: 'city', label: 'City', type: 'text', placeholder: 'City' },
        { name: 'state', label: 'State', type: 'text', placeholder: 'State' },
        { name: 'zip', label: 'Zip Code', type: 'text', placeholder: 'Zip Code' },
        { name: 'country', label: 'Country', type: 'text', placeholder: 'Country' },
        { name: 'dob', label: 'Date of Birth', type: 'date' },
        { name: 'initialDeposit', label: 'Initial Deposit Amount', type: 'number', placeholder: 'Initial Deposit Amount' },
        { name: 'password', label: 'Password', type: 'password', placeholder: 'Password' },
      ].map((field, index) => (
        <div className="mb-3" key={index}>
          <label htmlFor={field.name} className="form-label">{field.label}</label>
          <input
            type={field.type}
            name={field.name}
            value={formik.values[field.name]}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="form-control"
            placeholder={field.placeholder}
          />
          {formik.touched[field.name] && formik.errors[field.name] && (
            <p className="text-danger">{formik.errors[field.name]}</p>
          )}
        </div>
      ))}
      <div className="mb-3">
        <label htmlFor="accountType" className="form-label">Account Type</label>
        <select
          name="accountType"
          value={formik.values.accountType}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="form-control"
        >
          <option value="select">select</option>
          <option value="savings">Savings</option>
          <option value="current">Current</option>
        </select>
        {formik.touched.accountType && formik.errors.accountType && (
          <p className="text-danger">{formik.errors.accountType}</p>
        )}
      </div>
      <button type="submit" className="btn btn-primary">Register</button>
    </form>
  );
};

export default RegistrationForm;
