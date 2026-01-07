import { LoginForm } from '@/lib/features/auth';

export default function LoginPage() {
  return (
    <div className='login-bg min-h-screen flex items-center justify-center'>
      <div className='container mx-auto'>
        <LoginForm />
      </div>
    </div>
  );
}
