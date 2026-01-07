import { ResetPasswordForm } from '@/lib/features/auth/components/reset-password-form';
import Link from 'next/link';
import { ResendVerifyEmailForm } from '../../../lib/features/auth/components/resend-verify-email-form';
import Logo from '../../components/shared/logo';
import { Card, CardContent, CardFooter } from '../../components/shared/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../components/shared/ui/popover';

export default function ResetPasswordPage() {
  return (
    <div className='auth-bg min-h-[90vh] flex items-center justify-center'>
      <div className='container mx-auto p-4'>
        <Card className='shadow-lg max-w-lg mx-auto'>
          <CardContent>
            <div className='space-y-4 w-fit mx-auto'>
              <Logo />
              <article className='text-center space-y-4'>
                <p>Admin Reset Password</p>
                <p className='text-secondary-foreground'>
                  Please enter your email to reset your password.
                </p>
              </article>
            </div>
            <div className='mt-8'>
              <ResetPasswordForm />
            </div>
          </CardContent>
          <CardFooter className='justify-center text-sm'>
            Don&apos;t want to reset?{' '}
            <Link
              href={'/login'}
              className='hover:underline hover:opacity-90 ml-1 text-primary'
            >
              Login
            </Link>
          </CardFooter>
          <CardFooter className='justify-center text-sm'>
            Didn&apos;t receive the email?{' '}
            <Popover>
              <PopoverTrigger>
                <button
                  type='button'
                  className='hover:underline hover:opacity-90 ml-1 text-primary'
                >
                  Resend
                </button>
              </PopoverTrigger>
              <PopoverContent className='w-auto min-w-sm'>
                <ResendVerifyEmailForm />
              </PopoverContent>
            </Popover>
          </CardFooter>
        </Card>
        <p className='text-center text-sm text-muted-foreground mt-6'>
          &copy; 2025 EduCenter. All rights reserved.
        </p>
      </div>
    </div>
  );
}
