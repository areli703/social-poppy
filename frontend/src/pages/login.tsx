import React, { useEffect, useState } from 'react';
import type { ReactElement } from 'react';
import Head from 'next/head';
import BaseButton from '../components/BaseButton';
import CardBox from '../components/CardBox';
import SectionFullScreen from '../components/SectionFullScreen';
import LayoutGuest from '../layouts/Guest';
import { Field, Form, Formik } from 'formik';
import FormField from '../components/FormField';
import FormCheckRadio from '../components/FormCheckRadio';
import BaseDivider from '../components/BaseDivider';
import { useRouter } from 'next/router';
import { getPageTitle } from '../config';
import { findMe, loginUser, resetAction } from '../stores/authSlice';
import { useAppDispatch, useAppSelector } from '../stores/hooks';
import Link from 'next/link';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

export default function Login() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const notify = (type, msg) => toast(msg, { type });

  const {
    currentUser,
    isFetching,
    errorMessage,
    token,
    notify: notifyState,
  } = useAppSelector((state) => state.auth);
  const [initialValues, setInitialValues] = useState({
    email: 'admin@flatlogic.com',
    password: 'password',
    remember: true,
  });

  const title = 'Social Pop';

  useEffect(() => {
    if (token) {
      dispatch(findMe());
    }
  }, [token, dispatch]);

  useEffect(() => {
    if (currentUser?.id) {
      router.push('/dashboard');
    }
  }, [currentUser?.id, router]);

  useEffect(() => {
    if (errorMessage) {
      notify('error', errorMessage);
    }
  }, [errorMessage]);

  useEffect(() => {
    if (notifyState?.showNotification) {
      notify('success', notifyState?.textNotification);
      dispatch(resetAction());
    }
  }, [notifyState?.showNotification, dispatch]);

  const handleSubmit = async (values) => {
    try {
      const { remember, ...loginData } = values;
      await dispatch(loginUser(loginData)).unwrap();
    } catch (error) {
      console.error('Login error:', error);
      notify('error', 'Login failed. Please check your credentials.');
    }
  };

  const setLogin = (email) => {
    setInitialValues((prev) => ({ ...prev, email, password: 'password' }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <Head>
        <title>{getPageTitle('Login')}</title>
      </Head>

      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            {title}
          </h2>
          <p className="mt-2 text-center text-sm text-indigo-200">
            Sign in to your account
          </p>
        </div>
        <CardBox className="bg-white shadow-xl rounded-lg p-8">
          <div className="mb-4 text-sm text-gray-600">
            <p>
              Use{' '}
              <code 
                className="cursor-pointer text-indigo-600 bg-indigo-100 px-1 py-0.5 rounded"
                onClick={() => setLogin('admin@flatlogic.com')}
              >
                admin@flatlogic.com
              </code>{' '}
              to login as Admin
            </p>
          </div>

          <Formik
            initialValues={initialValues}
            enableReinitialize
            onSubmit={handleSubmit}
          >
            <Form className="mt-8 space-y-6">
              <FormField label="Email" help="Please enter your email">
                <Field 
                  name="email" 
                  type="email"
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                />
              </FormField>

              <FormField label="Password" help="Please enter your password">
                <Field 
                  name="password" 
                  type="password"
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                />
              </FormField>

              <div className="flex items-center justify-between">
                <FormCheckRadio type="checkbox" label="Remember me">
                  <Field 
                    type="checkbox" 
                    name="remember"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                </FormCheckRadio>

                <div className="text-sm">
                  <Link href="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500">
                    Forgot your password?
                  </Link>
                </div>
              </div>

              <div>
                <BaseButton
                  type="submit"
                  label={isFetching ? 'Signing in...' : 'Sign in'}
                  color="info"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  disabled={isFetching}
                />
              </div>
            </Form>
          </Formik>
        </CardBox>
      </div>
      <ToastContainer />
    </div>
  );
}

Login.getLayout = function getLayout(page: ReactElement) {
  return <LayoutGuest>{page}</LayoutGuest>;
};