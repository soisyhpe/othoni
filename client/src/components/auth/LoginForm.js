import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

import { useNotification } from '../context/NotificationContext';
import Button from '../common/Button';
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
          {formik.touched.username && formik.errors.username ? (
            <div className="text-base text-custom-red">{formik.errors.username}</div>
          ) : null}
        </div>

        <div className="flex flex-col mb-4">
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
          {formik.touched.password && formik.errors.password ? (
            <div className="text-base text-custom-red">{formik.errors.password}</div>
          ) : null}
        </div>

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