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
import { getPexelsImage } from '../helpers/pexels';

export default function Login() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const textColor = useAppSelector((state) => state.style.linkColor);
  const iconsColor = useAppSelector((state) => state.style.iconsColor);
  const notify = (type, msg) => toast(msg, { type });
  const [illustrationImage, setIllustrationImage] = useState({
    src: undefined,
    photographer: undefined,
    photographer_url: undefined,
  });

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

  // Fetch Pexels image
  useEffect(() => {
    async function fetchData() {
      const image = await getPexelsImage();
      setIllustrationImage(image);
    }
    fetchData();
  }, []);

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
  }, [notifyState?.showNotification]);

  const handleSubmit = async (value) => {
    const { remember, ...rest } = value;
    await dispatch(loginUser(rest));
  };

  const setLogin = (target) => {
    const email = target?.innerText;
    setInitialValues((prev) => ({
      ...prev,
      email,
      password: 'password',
    }));
  };

  const imageBlock = (image) => (
    <div
      className="hidden md:flex flex-col justify-center items-center bg-gray-100 p-8 w-1/2"
      style={{
        backgroundImage: `url(${image?.src?.original || 'https://via.placeholder.com/600'})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="bg-white bg-opacity-70 p-4 rounded-md">
        <a className="text-xs text-gray-700" href={image.photographer_url} target="_blank" rel="noreferrer">
          Photo by {image.photographer} on Pexels
        </a>
      </div>
    </div>
  );

  return (
    <div>
      <Head>
        <title>{getPageTitle('Login')}</title>
      </Head>

      <SectionFullScreen>
        <div className="min-h-screen flex flex-col md:flex-row">
          {imageBlock(illustrationImage)}
          <div className="md:w-1/2 flex items-center justify-center p-8 bg-gray-50">
            <div className="max-w-md w-full space-y-8">
              <div className="text-center">
                <h2 className="text-4xl font-bold mb-4">{title}</h2>
                <p className="text-gray-600">Join our community with all-time access and free</p>
              </div>
              <div className="flex flex-col space-y-4">
                <BaseButton
                  label="Sign In with Google"
                  icon={mdiGoogle}
                  className="w-full py-2 bg-red-600 text-white hover:bg-red-700"
                  onClick={() => alert('Google Sign-In')}
                />
                <BaseButton
                  label="Sign In with GitHub"
                  icon={mdiGithub}
                  className="w-full py-2 bg-gray-800 text-white hover:bg-gray-900"
                  onClick={() => alert('GitHub Sign-In')}
                />
              </div>
              <div className="relative my-6">
                <BaseDivider />
                <span className="absolute inset-x-0 top-2/4 transform -translate-y-2/4 bg-gray-50 px-4 text-gray-600">
                  or with email
                </span>
              </div>
              <Formik initialValues={initialValues} enableReinitialize onSubmit={handleSubmit}>
                <Form className="space-y-4">
                  <FormField label="Email" help="Please enter your email">
                    <Field
                      name="email"
                      type="email"
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </FormField>
                  <FormField label="Password" help="Please enter your password">
                    <Field
                      name="password"
                      type="password"
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </FormField>
                  <div className="flex justify-between items-center">
                    <FormCheckRadio type="checkbox" label="Remember me">
                      <Field type="checkbox" name="remember" />
                    </FormCheckRadio>
                    <Link href="/forgot" className="text-blue-600">
                      Forgot password?
                    </Link>
                  </div>
                  <BaseButtons>
                    <BaseButton
                      type="submit"
                      label={isFetching ? 'Loading...' : 'Sign In'}
                      className="w-full py-2 bg-blue-600 text-white hover:bg-blue-700"
                      disabled={isFetching}
                    />
                  </BaseButtons>
                </Form>
              </Formik>
              <p className="text-center text-gray-600 mt-4">
                Don’t have an account yet? <Link href="/register" className="text-blue-600">Sign Up</Link>
              </p>
            </div>
          </div>
        </div>
      </SectionFullScreen>
      <div className="bg-black text-white flex flex-col text-center justify-center md:flex-row py-6">
        <p className="text-sm">
          © 2024 <span>{title}</span>. All rights reserved.
        </p>
        <Link href="/privacy-policy/" className="py-6 ml-4 text-sm">
          Privacy Policy
        </Link>
      </div>
      <ToastContainer />
    </div>
  );
}

Login.getLayout = function getLayout(page: ReactElement) {
  return <LayoutGuest>{page}</LayoutGuest>;
};
