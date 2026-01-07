import { LoginForm } from '@/lib/features/auth';
import Logo from '../../components/shared/logo';
import { Card, CardContent } from '../../components/shared/ui/card';

export default function LoginPage() {
  return (
    <div className='login-bg min-h-screen flex items-center justify-center'>
      <div className='container mx-auto'>
        <Card className='shadow-lg max-w-lg mx-auto'>
          <CardContent>
            <div className='space-y-4 w-fit mx-auto'>
              <Logo />
              <article className='text-center space-y-4'>
                <p>Admin Login</p>
                <p className='text-secondary-foreground'>
                  Welcome back! Please enter your credentials
                </p>
              </article>
            </div>
            <div className='mt-8'>
              <LoginForm />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
