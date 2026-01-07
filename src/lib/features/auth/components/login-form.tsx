/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Button } from '@/app/components/shared/ui/button';
import { Checkbox } from '@/app/components/shared/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/app/components/shared/ui/form';
import { Input } from '@/app/components/shared/ui/input';
import { Label } from '@/app/components/shared/ui/label';
import { Spinner } from '@/app/components/shared/ui/spinner';
import { useAuth } from '@/lib/auth/hooks/use-auth';
import { loginSchema, type LoginFormData } from '@/lib/features/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { EyeClosedIcon, EyeIcon, LockIcon, MailIcon } from 'lucide-react';
import React from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';

export function LoginForm() {
  const [isPassVisible, setIsPassVisible] = React.useState<boolean>(false);
  const { login, isLoading } = useAuth();

  const form = useForm<z.infer<typeof loginSchema>>({
    defaultValues: {
      email: '',
      password: '',
      remember_me: false,
    },
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password, data.remember_me);
    } catch (error: any) {
      form.setError('root', {
        message:
          error.message || 'Login failed. Please check your credentials.',
      });
    }
  };

  const togglePasswordVisibility = () => {
    setIsPassVisible(!isPassVisible);
  };

  return (
    <Form {...form}>
      <form className='w-full space-y-5' onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <div className='flex items-center relative'>
                  <span className='absolute left-3 cursor-pointer'>
                    <MailIcon className='text-muted-foreground' />
                  </span>
                  <Input
                    type='email'
                    placeholder='admin@educenter.com'
                    className='w-full pl-11'
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className='flex items-center relative'>
                  <span className='absolute left-3 cursor-pointer'>
                    <LockIcon className='text-muted-foreground' />
                  </span>
                  <Input
                    type={isPassVisible ? 'text' : 'password'}
                    placeholder='Enter your password'
                    className='w-full pr-11 pl-11'
                    {...field}
                  />
                  <span
                    className='absolute right-3 cursor-pointer'
                    onClick={togglePasswordVisibility}
                  >
                    {isPassVisible ? (
                      <EyeClosedIcon className='text-muted-foreground' />
                    ) : (
                      <EyeIcon className='text-muted-foreground' />
                    )}
                  </span>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='remember_me'
          render={({ field }) => (
            <FormItem>
              <div className='flex items-center space-x-2'>
                <FormControl>
                  <Checkbox
                    id='remember_me'
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                    disabled={field.disabled}
                  />
                </FormControl>
                <Label htmlFor='remember_me'>Remember Me</Label>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type='submit'
          variant={'gradient'}
          className='mt-4 w-full'
          disabled={isLoading}
        >
          {isLoading ? (
            <div className='flex items-center gap-1'>
              <Spinner />
              Signing in...
            </div>
          ) : (
            'Sign In'
          )}
        </Button>
      </form>
    </Form>
  );
}
