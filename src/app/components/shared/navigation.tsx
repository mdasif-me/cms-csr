/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { PERMISSIONS } from '@/lib/auth/constants/permissions';
import { useAuth } from '@/lib/auth/hooks/use-auth';
import { usePermissions } from '@/lib/auth/hooks/use-permissions';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export function Navigation({ user }: { user?: any }) {
  const pathname = usePathname();
  const { logout } = useAuth();
  const { canView } = usePermissions();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigationItems = [
    {
      href: '/dashboard',
      label: 'Dashboard',
      permission: PERMISSIONS.ANALYTICS.VIEW,
    },
    {
      href: '/products',
      label: 'Products',
      permission: PERMISSIONS.PRODUCT.VIEW,
    },
    { href: '/orders', label: 'Orders', permission: PERMISSIONS.ORDER.VIEW },
    {
      href: '/users',
      label: 'Users',
      permission: PERMISSIONS.USER.VIEW,
      adminOnly: true,
    },
    {
      href: '/admin',
      label: 'Admin',
      permission: PERMISSIONS.SYSTEM.CONFIG_VIEW,
      adminOnly: true,
    },
  ];

  const filteredItems = navigationItems.filter((item) => {
    if (
      item.adminOnly &&
      user?.role !== 'admin' &&
      user?.role !== 'super_admin'
    ) {
      return false;
    }
    return !item.permission || canView(item.permission.split(':')[0]);
  });

  return (
    <nav className='bg-white shadow-lg'>
      <div className='container mx-auto px-4'>
        <div className='flex justify-between items-center h-16'>
          {/* Logo */}
          <div className='flex items-center'>
            <Link href='/dashboard' className='text-xl font-bold text-blue-600'>
              EnterpriseApp
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className='hidden md:flex items-center space-x-8'>
            {filteredItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === item.href || pathname.startsWith(item.href + '/')
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className='hidden md:flex items-center space-x-4'>
            <div className='relative'>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className='flex items-center space-x-2 focus:outline-none'
              >
                <div className='w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold'>
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <span className='text-sm font-medium text-gray-700'>
                  {user?.name || 'User'}
                </span>
                <svg
                  className={`w-4 h-4 transition-transform ${
                    isMenuOpen ? 'rotate-180' : ''
                  }`}
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M19 9l-7 7-7-7'
                  />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {isMenuOpen && (
                <>
                  <div
                    className='fixed inset-0 z-10'
                    onClick={() => setIsMenuOpen(false)}
                  />
                  <div className='absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20'>
                    <Link
                      href='/profile'
                      className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      href='/settings'
                      className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Settings
                    </Link>
                    <div className='border-t border-gray-100 my-1' />
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        logout();
                      }}
                      className='block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100'
                    >
                      Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            className='md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100'
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className='w-6 h-6'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M6 18L18 6M6 6l12 12'
                />
              ) : (
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M4 6h16M4 12h16M4 18h16'
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className='md:hidden py-4 border-t border-gray-200'>
            <div className='flex flex-col space-y-2'>
              {filteredItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === item.href ||
                    pathname.startsWith(item.href + '/')
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className='border-t border-gray-200 pt-2 mt-2'>
                <Link
                  href='/profile'
                  className='block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md'
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                <Link
                  href='/settings'
                  className='block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md'
                  onClick={() => setIsMenuOpen(false)}
                >
                  Settings
                </Link>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    logout();
                  }}
                  className='block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-gray-100 rounded-md mt-1'
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
