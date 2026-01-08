import { AuthProvider } from '@/app/providers/auth-provider';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import React from 'react';
import { ErrorBoundary } from '../components/shared/error-boundary';

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default async function ProtectedLayout({
  children,
}: ProtectedLayoutProps) {
  const user = await getServerUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <ErrorBoundary>
      <AuthProvider initialUser={user}>
        <div className='min-h-screen bg-gray-50'>
          <main className='container mx-auto px-4 py-8'>{children}</main>
          <footer className='border-t border-gray-200 mt-8 py-6'>
            <div className='container mx-auto px-4 text-center text-gray-600'>
              <p>
                © {new Date().getFullYear()} Your Company. All rights reserved.
              </p>
            </div>
          </footer>
        </div>
      </AuthProvider>
    </ErrorBoundary>
  );
}

//INFO: helper to extract user from headers (set by middleware)
async function getServerUser() {
  try {
    const headersList = await headers();

    const userId = headersList.get('x-user-id');
    const userRole = headersList.get('x-user-role');
    const permissions = headersList.get('x-user-permissions')?.split(',') || [];

    if (!userId || !userRole) {
      return null;
    }

    return {
      id: userId,
      role: userRole,
      permissions,
      email: '', // you might need to get this from token or API
      name: '', // you might need to get this from token or API
    };
  } catch (error) {
    console.error('Failed to get server user:', error);
    return null;
  }
}
