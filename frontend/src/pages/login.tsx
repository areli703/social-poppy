import React, { useEffect, useState } from 'react';
import type { ReactElement } from 'react';
import Head from 'next/head';
import BaseButton from '../components/BaseButton';
import CardBox from '../components/CardBox';
import BaseIcon from '../components/BaseIcon';
import { mdiInformation } from '@mdi/js';
import SectionFullScreen from '../components/SectionFullScreen';
import LayoutGuest from '../layouts/Guest';
import { Field, Form, Formik } from 'formik';
import FormField from '../components/FormField';
import FormCheckRadio from '../components/FormCheckRadio';
import BaseDivider from '../components/BaseDivider';
import BaseButtons from '../components/BaseButtons';
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
  const textColor = useAppSelector((state) => state.style.linkColor);
  const iconsColor = useAppSelector((state) => state.style.iconsColor);
  const notify = (type, msg) => toast(msg, { type });

  const {
    currentUser,
    isFetching,
    errorMessage,
    token,
    notify: notifyState,
  } = useAppSelector((state) => state.auth);
  const [initialValues, setInitialValues] = useState({
    email: 'super_admin@example.com',
    password: 'password',
    remember: true,
  });

  const title = 'Social Pop';

  // Fetch user data
  useEffect(() => {
    if (token) {
      dispatch(findMe());
    }
  }, [token, dispatch]);

  // Redirect to dashboard if user is logged in
  useEffect(() => {
    if (currentUser?.id) {
      router.push('/dashboard');
    }
  }, [currentUser?.id, router]);

  // Show error message if there is one
  useEffect(() => {
    if (errorMessage) {
      notify('error', errorMessage);
    }
  }, [errorMessage]);

  // Show notification if there is one
  useEffect(() => {
    if (notifyState?.showNotification) {
      notify('success', notifyState?.textNotification);
      dispatch(resetAction());
    }
  }, [notifyState?.showNotification, dispatch]);

  const handleSubmit = async (value) => {
    const { remember, ...rest } = value;
    await dispatch(loginUser(rest));
  };

  const setLogin = (target) => {
    const email = target?.innerText;
    setInitialValues((prev) => {
      return { ...prev, email, password: 'password' };
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <Head>
        <title>{getPageTitle('Login')}</title>
      </Head>

      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">{title}</h2>
          <p className="mt-2 text-center text-sm text-indigo-200">
            Sign in to your account
          </p>
        </div>

        <CardBox className="bg-white shadow-xl rounded-lg p-8">
          <div className="flex flex-row text-gray-500 justify-between mb-6">
            <div>
              <p className="mb-2">
                Use{' '}
                <code
                  className={`cursor-pointer ${textColor}`}
                  onClick={(e) => setLogin(e.target)}
                >
                  super_admin@example.com
                </code>{' '}
                to login as Super Admin
              </p>

              <p className="mb-2">
                Use{' '}
                <code
                  className={`cursor-pointer ${textColor}`}
                  onClick={(e) => setLogin(e.target)}
                >
                  admin@example.com
                </code>{' '}
                to login as Admin
              </p>
              <p>
                Use{' '}
                <code
                  className={`cursor-pointer ${textColor}`}
                  onClick={(e) => setLogin(e.target)}
                >
                  client@example.com
                </code>{' '}
                to login as User
              </p>
            </div>
            <div>
              <BaseIcon
                className={`${iconsColor}`}
                w="w-16"
                h="h-16"
                size={48}
                path={mdiInformation}
              />
            </div>
          </div>

          <Formik
            initialValues={initialValues}
            enableReinitialize
            onSubmit={(values) => handleSubmit(values)}
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
                  <Link href="/forgot" className="font-medium text-indigo-600 hover:text-indigo-500">
                    Forgot your password?
                  </Link>
                </div>
              </div>

              <div>
                <BaseButton
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  type="submit"
                  label={isFetching ? 'Logging in...' : 'Login'}
                  color="info"
                  disabled={isFetching}
                />
              </div>
            </Form>
          </Formik>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link className="font-medium text-indigo-600 hover:text-indigo-500" href="/register">
              Sign up
            </Link>
          </p>
        </CardBox>
      </div>

      <ToastContainer />
    </div>
  );
}

Login.getLayout = function getLayout(page: ReactElement) {
  return <LayoutGuest>{page}</LayoutGuest>;
};