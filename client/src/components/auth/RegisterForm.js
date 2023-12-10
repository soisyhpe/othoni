import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import AuthServices from '../../services/AuthServices';

import { useNotification } from '../context/NotificationContext';
import LoginForm from '../auth/LoginForm';
import Button from '../buttons/Button';
import InputField from '../form/InputField';
import PasswordField from '../form/PasswordField';

const RegisterForm = () => {
  const [redirectToLogin, setRedirectToLogin] = useState(false);
  const { showErrorMessage, showSuccessMessage } = useNotification();
  const [showPassword, setShowPassword] = useState(false);

  const showRegisterSuccessNotification = () => {
    showSuccessMessage('You have successfully create your account!');
  };

  const showRegisterErrorNotification = (errorMessage) => {
    showErrorMessage(errorMessage);
  };

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
      
      showRegisterSuccessNotification();

      setRedirectToLogin(true);
    } catch (error) {
      showRegisterErrorNotification(error.message);
    }
    setSubmitting(false);
  }

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
          
          <InputField
            label="Email or username"
            name="username"
            type="text"
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.username && formik.errors.username}
          />

          <PasswordField
            label="Password"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            showPassword={showPassword}
            togglePassword={() => setShowPassword(!showPassword)}
            error={formik.touched.password && formik.errors.password}
          />

          <InputField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.confirmPassword && formik.errors.confirmPassword}
          />
          
          <Button type="submit" disabled={formik.isSubmitting}>Register</Button>
        </form>
      </div>
    )
  );
};

export default RegisterForm;
