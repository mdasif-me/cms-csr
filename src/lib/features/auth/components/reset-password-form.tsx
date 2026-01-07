/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Button } from '@/app/components/shared/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/app/components/shared/ui/form';
import { Input } from '@/app/components/shared/ui/input';
import { Spinner } from '@/app/components/shared/ui/spinner';
import { useAuth } from '@/lib/auth/hooks/use-auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { EyeClosedIcon, EyeIcon } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';
import { resetPasswordSchema } from '../schemas';

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { resetPassword, isLoading } = useAuth();
  const [isPassVisible, setIsPassVisible] = React.useState<boolean>(false);

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    defaultValues: {
      token: token ?? '',
      new_password: '',
      confirm_password: '',
    },
    resolver: zodResolver(resetPasswordSchema),
  });

  useEffect(() => {
    if (!token) {
      toast.error('Invalid or missing token.');
      return;
    }
  }, [token]);
  const onSubmit = async (data: z.infer<typeof resetPasswordSchema>) => {
    try {
      await resetPassword(data.token, data.new_password);
    } catch (error: any) {
      form.setError('root', {
        message:
          error.message || 'Forgot password failed. Please check your email.',
      });
    }
  };

  const togglePasswordVisibility = () => {
    setIsPassVisible(!isPassVisible);
  };

  return (
    <Form {...form}>
      <form className='w-full space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name='new_password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className='flex items-center relative'>
                  <Input
                    type={isPassVisible ? 'text' : 'password'}
                    placeholder='Enter your password'
                    className='w-full pr-10'
                    {...field}
                  />
                  <span
                    className='absolute right-3 cursor-pointer'
                    onClick={togglePasswordVisibility}
                  >
                    {isPassVisible ? <EyeClosedIcon /> : <EyeIcon />}
                  </span>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='confirm_password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <div className='flex items-center relative'>
                  <Input
                    type={isPassVisible ? 'text' : 'password'}
                    placeholder='Confirm your password'
                    className='w-full pr-10'
                    {...field}
                  />
                  <span
                    className='absolute right-3 cursor-pointer'
                    onClick={togglePasswordVisibility}
                  >
                    {isPassVisible ? <EyeClosedIcon /> : <EyeIcon />}
                  </span>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit' className='mt-4 w-full' disabled={isLoading}>
          {isLoading ? (
            <div className='flex items-center gap-1'>
              <Spinner />
              Resetting...
            </div>
          ) : (
            'Reset Password'
          )}
        </Button>
      </form>
    </Form>
  );
}
