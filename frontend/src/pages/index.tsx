import React, { useEffect, useState } from 'react';
import type { ReactElement } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import BaseButton from '../components/BaseButton';
import CardBox from '../components/CardBox';
import SectionFullScreen from '../components/SectionFullScreen';
import LayoutGuest from '../layouts/Guest';
import BaseDivider from '../components/BaseDivider';
import BaseButtons from '../components/BaseButtons';
import { getPageTitle } from '../config';
import { useAppSelector } from '../stores/hooks';
import CardBoxComponentTitle from '../components/CardBoxComponentTitle';
import { getPexelsImage, getPexelsVideo } from '../helpers/pexels';

export default function Starter() {
  const [illustrationImage, setIllustrationImage] = useState({
    src: undefined,
    photographer: undefined,
    photographer_url: undefined,
  });
  const [illustrationVideo, setIllustrationVideo] = useState({
    video_files: [],
  });
  const [contentType, setContentType] = useState('image');
  const [contentPosition, setContentPosition] = useState('left');
  const textColor = useAppSelector((state) => state.style.linkColor);

  const title = 'Social Pop';

  // Fetch Pexels image/video
  useEffect(() => {
    async function fetchData() {
      const image = await getPexelsImage();
      const video = await getPexelsVideo();
      setIllustrationImage(image);
      setIllustrationVideo(video);
    }
    fetchData();
  }, []);

  const imageBlock = (image) => (
    <div
      className='hidden md:flex flex-col justify-end relative flex-grow-0 flex-shrink-0 w-1/3'
      style={{
        backgroundImage: `${
          image
            ? `url(${image.src?.original})`
            : 'linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5))'
        }`,
        backgroundSize: 'cover',
        backgroundPosition: 'left center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className='flex justify-center w-full bg-blue-300/20'>
        
          className='text-[8px]'
          href={image.photographer_url}
          target='_blank'
          rel='noreferrer'
        >
          Photo by {image.photographer} on Pexels
        </a>
      </div>
    </div>
  );

  const videoBlock = (video) => {
    if (video?.video_files?.length > 0) {
      return (
        <div className='hidden md:flex flex-col justify-end relative flex-grow-0 flex-shrink-0 w-1/3'>
          <video
            className='absolute top-0 left-0 w-full h-full object-cover'
            autoPlay
            loop
            muted
          >
            <source src={video.video_files[0]?.link} type='video/mp4' />
            Your browser does not support the video tag.
          </video>
          <div className='flex justify-center w-full bg-blue-300/20 z-10'>
            
              className='text-[8px]'
              href={video.user.url}
              target='_blank'
              rel='noreferrer'
            >
              Video by {video.user.name} on Pexels
            </a>
          </div>
        </div>
      );
    }
  };

  return (
    <div
      style={
        contentPosition === 'background'
          ? {
              backgroundImage: `${
                illustrationImage
                  ? `url(${illustrationImage.src?.original})`
                  : 'linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5))'
              }`,
              backgroundSize: 'cover',
              backgroundPosition: 'left center',
              backgroundRepeat: 'no-repeat',
            }
          : {}
      }
    >
      <Head>
        <title>{getPageTitle('Welcome to Social Pop')}</title>
      </Head>

      <SectionFullScreen bg='violet'>
        <div
          className={`flex ${
            contentPosition === 'right' ? 'flex-row-reverse' : 'flex-row'
          } min-h-screen w-full`}
        >
          {contentType === 'image' && contentPosition !== 'background'
            ? imageBlock(illustrationImage)
            : null}
          {contentType === 'video' && contentPosition !== 'background'
            ? videoBlock(illustrationVideo)
            : null}
          <div className='flex items-center justify-center flex-col space-y-4 w-full lg:w-2/3 p-6'>
            <CardBox className='w-full max-w-lg shadow-lg'>
              <CardBoxComponentTitle title='Welcome to Social Pop!' />
              <BaseDivider />
              <div className='space-y-3'>
                <p className='text-center text-gray-700'>
                  Connect, Share, and Thrive in our vibrant community.
                </p>
                <p className='text-center text-gray-700'>
                  Join millions of users and start your social journey today!
                </p>
              </div>
              <BaseDivider />
              <BaseButtons>
                <BaseButton
                  href='/login'
                  label='Login'
                  color='info'
                  className='w-full py-2'
                />
                <BaseButton
                  href='/register'
                  label='Sign Up'
                  color='success'
                  className='w-full py-2'
                />
              </BaseButtons>
              <div className='grid grid-cols-2 gap-4 mt-6'>
                <div className='text-center'>
                  <a className={`${textColor} hover:underline`} href='https://react.dev/'>
                    React.js
                  </a>
                </div>
                <div className='text-center'>
                  <a className={`${textColor} hover:underline`} href='https://tailwindcss.com/'>
                    Tailwind CSS
                  </a>
                </div>
                <div className='text-center'>
                  <a className={`${textColor} hover:underline`} href='https://nodejs.org/en'>
                    Node.js
                  </a>
                </div>
                <div className='text-center'>
                  
                    className={`${textColor} hover:underline`}
                    href='https://flatlogic.com/forum'
                  >
                    Flatlogic Forum
                  </a>
                </div>
              </div>
            </CardBox>
          </div>
        </div>
      </SectionFullScreen>
      <div className='bg-gray-800 text-white py-4'>
        <div className='container mx-auto px-4'>
          <div className='flex flex-col md:flex-row justify-between items-center'>
            <p className='text-sm mb-2 md:mb-0'>
              © 2024 {title}. All rights reserved
            </p>
            <Link className='text-sm hover:text-indigo-400 transition-colors' href='/privacy-policy/'>
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

Starter.getLayout = function getLayout(page: ReactElement) {
  return <LayoutGuest>{page}</LayoutGuest>;
};