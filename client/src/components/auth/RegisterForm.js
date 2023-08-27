import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import AuthServices from '../../services/AuthServices';

import LoginForm from '../auth/LoginForm';
import Button from '../common/Button';
import ErrorNotification from '../notifications/ErrorNotifications';

const RegisterForm = () => {
  const [redirectToLogin, setRedirectToLogin] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const initialValues = {
    username: '',
    password: '',
    confirmPassword: ''
  }

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .required('Username is required')
      .min(3, 'Username must be at least 3 characters')
      .max(16, 'Username must be at most 16 characters'),
    password: Yup.string()
      .required('Password is required')
      .matches(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
        'Password must be at least 8 characters and contain at least one digit, one lowercase letter, and one uppercase letter'
      ),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], "Passwords don't match")
  });

  const onSubmit = async (values, {setSubmitting}) => {
    try {
      await AuthServices.register({ username: values.username, password: values.password });
      
      setErrorMessage(null);
      setRedirectToLogin(true);
    } catch (error) {
      setErrorMessage(error.message);
    }
    setSubmitting(false);
  }

  const handleNotificationClose = () => {
    setErrorMessage('');
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit
  });

  return (
    redirectToLogin ? (
      <LoginForm/>
    ) : (
      <div>
        <form onSubmit={formik.handleSubmit}>

          <div className="mb-8">
            <h2 className="text-2xl font-bold">Register</h2>
            <p className="text-base font-regular">An account to manage your servers.</p>
          </div>
          
          <div className="flex flex-col">
            <label className="mb-2 text-base font-bold" htmlFor="username">Email or username</label>
            <input
              className={`pl-4 bg-custom-darker border border-custom-border rounded-lg h-14 w-full ${
                formik.touched.username && formik.errors.username ? 'border-red-500' : ''
              }`}
              type="text"
              id="username"
              name="username"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.username}
            />
            {formik.touched.username && formik.errors.username && (
              <div className="text-base text-custom-red">{formik.errors.username}</div>
            )}
          </div>

          <div className="flex flex-col">
            <label className="mt-4 mb-2 text-base font-bold" htmlFor="password">Password</label>
            <div className="relative w-full">
              <input
                className={`pl-4 bg-custom-darker border border-custom-border rounded-lg h-14 w-full ${
                  formik.touched.password && formik.errors.password ? 'border-red-500' : ''
                }`}
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
              />
              <button
                className="font-semibold absolute top-1/2 right-4 transform -translate-y-1/2"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {formik.touched.password && formik.errors.password && (
              <div className="text-base text-custom-red">{formik.errors.password}</div>
            )}
          </div>

          <div className="flex flex-col mb-2">
            <label className="mt-4 mb-2 text-base font-bold" htmlFor="confirmPassword">Confirm Password</label>
            <input
              className={`pl-4 bg-custom-darker border border-custom-border rounded-lg h-14 w-full ${
                formik.touched.confirmPassword && formik.errors.confirmPassword ? 'border-red-500' : ''
              }`}
              type='password'
              id="confirmPassword"
              name="confirmPassword"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.confirmPassword}
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
              <div className="text-base text-custom-red">{formik.errors.confirmPassword}</div>
            )}
          </div>
          
          <Button type="submit" disabled={formik.isSubmitting}>Register</Button>
        </form>
        
        {errorMessage && (
          <ErrorNotification message={errorMessage} onClose={handleNotificationClose} />
        )}
      </div>
    )
  );
};

export default RegisterForm;
