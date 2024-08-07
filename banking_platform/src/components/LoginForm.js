import React, { useContext } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

const LoginForm = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      identifier: '',
      password: '',
    },
    validationSchema: Yup.object({
      identifier: Yup.string().required('Account Number or Email is required'),
      password: Yup.string().required('Password is required'),
    }),
    onSubmit: async (values) => {
      try {
        const response = await fetch('http://localhost:3001/users');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const users = await response.json();
        const user = users.find(
          (u) => (u.email === values.identifier || u.accountNumber === values.identifier) && u.password === values.password
        );

        if (user) {
          login(user);
          console.log('Login successful:', user);
          navigate('/account-details');
        } else {
          formik.setErrors({ form: 'Invalid account number/email or password' });
          console.log('Login failed');
        }
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        formik.setErrors({ form: 'An error occurred. Please try again later.' });
      }
    },
  });

  return (
    <div className="container mt-5">
      <form onSubmit={formik.handleSubmit} className="container mt-5">
        <center className="mb-4">
          <h2 className="font-weight-bold text-primary">Login to Account</h2>
        </center>
        <div className="mb-3">
          <label htmlFor="identifier" className="form-label">Account Number or Email</label>
          <input
            type="text"
            name="identifier"
            value={formik.values.identifier}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="form-control"
            placeholder="Account Number or Email"
          />
          {formik.touched.identifier && formik.errors.identifier && (
            <p className="text-danger">{formik.errors.identifier}</p>
          )}
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="form-control"
            placeholder="Password"
          />
          {formik.touched.password && formik.errors.password && (
            <p className="text-danger">{formik.errors.password}</p>
          )}
        </div>
        {formik.errors.form && <p className="text-danger">{formik.errors.form}</p>}
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
      <center className="mt-3">
        Don't have an account? <Link to="/register">Register</Link>
      </center>
    </div>
  );
};

export default LoginForm;
