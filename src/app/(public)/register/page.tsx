import Link from 'next/link';
import { RegisterForm } from '../../../lib/features/auth/components/register-form';
import Logo from '../../components/shared/logo';
import { Card, CardContent, CardFooter } from '../../components/shared/ui/card';

export default function RegisterPage() {
  return (
    <div className='auth-bg min-h-[98vh] flex items-center justify-center'>
      <div className='container mx-auto p-4'>
        <Card className='shadow-lg max-w-lg mx-auto'>
          <CardContent>
            <div className='space-y-4 w-fit mx-auto'>
              <Logo />
              <article className='text-center space-y-4'>
                <p>Admin Registration</p>
                <p className='text-secondary-foreground'>
                  Welcome! Please enter your details to create an account.
                </p>
              </article>
            </div>
            <div className='mt-8'>
              <RegisterForm />
            </div>
          </CardContent>
          <CardFooter className='justify-center text-sm'>
            Already have an account?{' '}
            <Link
              href={'/login'}
              className='hover:underline hover:opacity-90 ml-1 text-primary'
            >
              Login
            </Link>
          </CardFooter>
        </Card>
        <p className='text-center text-sm text-muted-foreground mt-6'>
          &copy; 2025 EduCenter. All rights reserved.
        </p>
      </div>
    </div>
  );
}
