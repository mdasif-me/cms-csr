import { ResetPasswordForm } from '@/lib/features/auth/components/reset-password-form';
import Image from 'next/image';
import Link from 'next/link';
import login from 'public/img/auth/login.svg';
import Logo from '../../components/shared/logo';
import { Separator } from '../../components/shared/ui/separator';

export default function ResetPasswordPage() {
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
              Reset Password
            </span>
            <Separator />
          </div>
          <ResetPasswordForm />

          <Separator className='my-7' />
          <p className='text-muted-foreground'>
            You may contact{' '}
            <Link href='/support' className='text-primary font-medium'>
              Customer Service
            </Link>{' '}
            for help restoring access to your account.
          </p>
        </div>
        <div className='hidden lg:flex'>
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
