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
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600">
      <Head>
        <title>{getPageTitle('Login')}</title>
      </Head>

      <SectionFullScreen bg="violet">
        <CardBox className="w-11/12 md:w-7/12 lg:w-6/12 xl:w-4/12 shadow-2xl">
          <CardBox className="mb-4">
            <h2 className="text-3xl font-bold mb-4 text-center text-indigo-700">{title}</h2>
            <div className="flex flex-col text-gray-700">
              <p className="mb-2">
                Use{' '}
                <code
                  className={`cursor-pointer ${textColor} bg-gray-100 px-2 py-1 rounded`}
                  onClick={(e) => setLogin(e.target)}
                >
                  super_admin@example.com
                </code>{' '}
                to login as Super Admin
              </p>
              <p className="mb-2">
                Use{' '}
                <code
                  className={`cursor-pointer ${textColor} bg-gray-100 px-2 py-1 rounded`}
                  onClick={(e) => setLogin(e.target)}
                >
                  admin@example.com
                </code>{' '}
                to login as Admin
              </p>
              <p>
                Use{' '}
                <code
                  className={`cursor-pointer ${textColor} bg-gray-100 px-2 py-1 rounded`}
                  onClick={(e) => setLogin(e.target)}
                >
                  client@example.com
                </code>{' '}
                to login as User
              </p>
            </div>
          </CardBox>

          <Formik
            initialValues={initialValues}
            enableReinitialize
            onSubmit={(values) => handleSubmit(values)}
          >
            <Form>
              <FormField label="Login" help="Please enter your login">
                <Field 
                  name="email" 
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </FormField>

              <FormField label="Password" help="Please enter your password">
                <Field 
                  name="password" 
                  type="password" 
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </FormField>

              <div className="flex items-center justify-between mb-6">
                <FormCheckRadio type="checkbox" label="Remember">
                  <Field 
                    type="checkbox" 
                    name="remember" 
                    className="text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                </FormCheckRadio>

                <Link href="/forgot" className="text-sm text-indigo-600 hover:text-indigo-500">
                  Forgot password?
                </Link>
              </div>

              <BaseDivider />

              <BaseButtons>
                <BaseButton
                  type="submit"
                  label={isFetching ? 'Loading...' : 'Login'}
                  color="info"
                  className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-md transition duration-200"
                  disabled={isFetching}
                />
              </BaseButtons>
            </Form>
          </Formik>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                Sign up
              </Link>
            </p>
          </div>
        </CardBox>
      </SectionFullScreen>
      <ToastContainer />
    </div>
  );
}

Login.getLayout = function getLayout(page: ReactElement) {
  return <LayoutGuest>{page}</LayoutGuest>;
};