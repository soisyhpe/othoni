import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

import { useNotification } from '../context/NotificationContext';
import Button from '../buttons/Button';
import InputField from '../form/InputField';
import PasswordField from '../form/PasswordField';

import AuthServices from '../../services/AuthServices';

import '../../styles/custom.css';

const LoginForm = () => {
  const [redirectToHome, setRedirectToHome] = useState(false);
  const { showErrorMessage, showSuccessMessage } = useNotification();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const showLoginSuccessNotification = () => {
    showSuccessMessage('You have successfully logged in!');
  };

  const showLoginErrorNotification = (errorMessage) => {
    showErrorMessage(errorMessage);
  };

  const initialValues = {
    username: '',
    password: '',
    staySignedIn: false
  }

  const validationSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required'),
  });

  const onSubmit = async (values) => {
    try {
      const { token, expirationDate } = await AuthServices.login({ username: values.username, password: values.password });

      if (values.staySignedIn) {
        // Convert to Date object
        const expirationDateObj = new Date(expirationDate);

        Cookies.set('authToken', token, { expires: expirationDateObj });
        Cookies.set('authTokenExpires', expirationDate);
      } else {
        Cookies.set('authToken', token);
      }
      // Afficher la notification de succès
      showLoginSuccessNotification();

      // Rediriger vers Home
      setRedirectToHome(true);
    } catch (error) {
      // Afficher la notification d'erreur
      showLoginErrorNotification(error.message);
    }
  }

  useEffect(() => {
    const authToken = Cookies.get('authToken');
    
    if (authToken) {
      navigate('/home');
    } else {
      const expirationDate = new Date(Cookies.get('authTokenExpires'));
      const currentTime = new Date();

      console.log(expirationDate);
      
      if (expirationDate && expirationDate > currentTime) {
        navigate('/auth');
      }
    }
  }, [navigate]);

  useEffect(() => {
    if (redirectToHome) {
      navigate('/home');
    }
  }, [redirectToHome, navigate]);

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit
  });
  
  return (
    <div>
      <form onSubmit={formik.handleSubmit}>

        <div className="mb-8">
          <h1 className="text-2xl font-bold">Sign in</h1>
          <p className="text-base font-regular">Enter your account details.</p>
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

        <div className="flex items-center">
          <input 
            className="h-4 w-4"
            type="checkbox"
            id="staySignedIn"
            name="staySignedIn"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.staySignedIn}
          />
          <label className="ml-2" htmlFor="staySignedIn">Keep me signed in</label>
        </div>

        <Button onSubmit={formik.onSubmit} type='submit'>Sign in</Button>
      </form>
    </div>
  )
};

export default LoginForm;
