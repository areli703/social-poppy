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

  const handleSubmit = async (values) => {
    try {
      const result = await dispatch(loginUser(values)).unwrap();
      console.log('Login successful:', result);
    } catch (error) {
      console.error('Login error details:', error);
      notify('error', error.message || 'Login failed. Please check your credentials.');
    }
  };

  const setLogin = (target) => {
    const email = target?.innerText;
    setInitialValues((prev) => {
      return { ...prev, email, password: 'password' };
    });
  };

  return (
    <div>
      <Head>
        <title>{getPageTitle('Login')}</title>
      </Head>

      <SectionFullScreen bg='violet'>
        <CardBox className='w-11/12 md:w-7/12 lg:w-6/12 xl:w-4/12 shadow-md'>
          <CardBox className='mb-4'>
            <h2 className='text-2xl font-bold mb-4'>{title}</h2>
            <div className='flex flex-col text-gray-700'>
              <p className='mb-2'>
                Use{' '}
                <code
                  className={`cursor-pointer ${textColor} bg-gray-100 px-1 rounded`}
                  onClick={(e) => setLogin(e.target)}
                >
                  super_admin@example.com
                </code>{' '}
                to login as Super Admin
              </p>
              <p className='mb-2'>
                Use{' '}
                <code
                  className={`cursor-pointer ${textColor} bg-gray-100 px-1 rounded`}
                  onClick={(e) => setLogin(e.target)}
                >
                  admin@example.com
                </code>{' '}
                to login as Admin
              </p>
              <p>
                Use{' '}
                <code
                  className={`cursor-pointer ${textColor} bg-gray-100 px-1 rounded`}
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
            onSubmit={handleSubmit}
          >
            <Form>
              <FormField label='Login' help='Please enter your login'>
                <Field name='email' />
              </FormField>

              <FormField label='Password' help='Please enter your password'>
                <Field name='password' type='password' />
              </FormField>

              <FormCheckRadio type='checkbox' label='Remember'>
                <Field type='checkbox' name='remember' />
              </FormCheckRadio>

              <BaseDivider />

              <BaseButtons>
                <BaseButton
                  type='submit'
                  label={isFetching ? 'Loading...' : 'Login'}
                  color='info'
                  disabled={isFetching}
                />
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionFullScreen>
      <ToastContainer />
    </div>
  );
}

Login.getLayout = function getLayout(page: ReactElement) {
  return <LayoutGuest>{page}</LayoutGuest>;
};