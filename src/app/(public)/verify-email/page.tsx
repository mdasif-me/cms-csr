'use client';

import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import login from 'public/img/auth/login.svg';
import checking from 'public/img/auth/verify-checking.svg';

import { useAuth } from '@/lib/auth/hooks/use-auth';
import React, { useEffect } from 'react';
import { ResendVerifyEmailForm } from '../../../lib/features/auth/components/resend-verify-email-form';
import Logo from '../../components/shared/logo';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../components/shared/ui/popover';
import { Separator } from '../../components/shared/ui/separator';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { verifyEmail, isLoading } = useAuth();
  const [isVerified, setIsVerified] = React.useState<boolean>(false);

  useEffect(() => {
    if (token) {
      verifyEmail(token)
        .then(() => {
          setIsVerified(true);
        })
        .catch((error) => {
          setIsVerified(false);
          console.error('Email verification failed:', error);
        });
    }
  }, [token, verifyEmail]);

  return (
    <div className='flex items-center justify-center'>
      <div className='w-full h-full grid lg:grid-cols-2'>
        <div className='relative sm:max-w-lg m-auto w-full flex flex-col items-center p-8 outline-0 sm:outline-2 outline-border/40 dark:outline-border/80 outline-offset-0.5'>
          <div className='max-sm:hidden absolute border-t top-0 inset-x-0 w-[calc(100%+4rem)] -translate-x-8' />
          <div className='max-sm:hidden absolute border-b bottom-0 inset-x-0 w-[calc(100%+4rem)] -translate-x-8' />
          <div className='max-sm:hidden absolute border-s left-0 inset-y-0 h-[calc(100%+4rem)] -translate-y-8' />
          <div className='max-sm:hidden absolute border-e right-0 inset-y-0 h-[calc(100%+4rem)] -translate-y-8' />
          <div className='max-sm:hidden absolute border-t -top-1 inset-x-0 w-[calc(100%+3rem)] -translate-x-6' />
          <div className='max-sm:hidden absolute border-b -bottom-1 inset-x-0 w-[calc(100%+3rem)] -translate-x-6' />
          <div className='max-sm:hidden absolute border-s -left-1 inset-y-0 h-[calc(100%+3rem)] -translate-y-6' />
          <div className='max-sm:hidden absolute border-e -right-1 inset-y-0 h-[calc(100%+3rem)] -translate-y-6' />
          <Logo />
          <div className='mb-7 w-full flex items-center justify-center overflow-hidden'>
            <Separator />
            <span className='text-sm px-2 whitespace-nowrap'>
              Verification{' '}
              {isLoading ? 'Checking...' : isVerified ? 'Successful' : 'Failed'}
            </span>
            <Separator />
          </div>
          <article className='mt-5'>
            <Image
              draggable={false}
              src={checking}
              alt={
                'Email Verification ' +
                (isLoading ? 'Checking' : isVerified ? 'Successful' : 'Failed')
              }
              width={600}
              height={400}
              className='object-contain w-full max-h-96'
            />
            <p className='mt-2 text-center text-muted-foreground'>
              {isLoading
                ? 'Checking...'
                : isVerified
                ? 'Your email has been successfully verified. You can now log in to your account.'
                : 'The verification link is invalid or has expired. Please request a new verification email.'}{' '}
              {isVerified ? null : (
                <Popover>
                  <PopoverTrigger className='hover:underline text-primary'>
                    Resend Verification Email
                  </PopoverTrigger>
                  <PopoverContent>
                    <ResendVerifyEmailForm />
                  </PopoverContent>
                </Popover>
              )}
            </p>
          </article>{' '}
        </div>
        <div className='hidden lg:flex max-h-screen min-h-screen'>
          <Image
            draggable={false}
            src={login}
            alt='Login Image'
            className='object-cover w-full'
          />
        </div>
      </div>
    </div>
  );
}
