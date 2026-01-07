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
import { zodResolver } from '@hookform/resolvers/zod';
import {
  EyeClosedIcon,
  EyeIcon,
  LockIcon,
  MailIcon,
  UserIcon,
} from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { useAuth } from '../../../auth/hooks/use-auth';
import { registerSchema } from '../schemas';

export function RegisterForm() {
  const [isPassVisible, setIsPassVisible] = React.useState<boolean>(false);
  const { register, isLoading } = useAuth();

  const form = useForm<z.infer<typeof registerSchema>>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      accept_terms: false,
    },
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: z.infer<typeof registerSchema>) => {
    try {
      await register(
        data.name,
        data.email,
        data.password,
        data.confirm_password,
        data.accept_terms
      );
    } catch (error: any) {
      form.setError('root', {
        message:
          error.message ||
          'Registration failed. Please check your credentials.',
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
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <div className='flex items-center relative'>
                  <span className='absolute left-3 cursor-pointer'>
                    <UserIcon className='text-muted-foreground' />
                  </span>
                  <Input
                    type='text'
                    placeholder='Enter your full name'
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
          name='confirm_password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <div className='flex items-center relative'>
                  <span className='absolute left-3 cursor-pointer'>
                    <LockIcon className='text-muted-foreground' />
                  </span>
                  <Input
                    type={isPassVisible ? 'text' : 'password'}
                    placeholder='Enter your password again'
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
          name='accept_terms'
          render={({ field }) => (
            <FormItem>
              <div className='flex items-center space-x-2'>
                <FormControl>
                  <Checkbox
                    id='accept_terms'
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                    disabled={field.disabled}
                  />
                </FormControl>
                <Label
                  htmlFor='accept_terms'
                  className='flex flex-wrap items-center'
                >
                  Are you agree to our&nbsp;
                  <Link
                    href={'/terms-of-conditions'}
                    className='text-primary hover:underline'
                  >
                    Terms of Condition
                  </Link>
                  and
                  <Link
                    href={'/privacy-policy'}
                    className='text-primary hover:underline'
                  >
                    Privacy Policy
                  </Link>
                </Label>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit' className='mt-4 w-full' disabled={isLoading}>
          {isLoading ? (
            <div className='flex items-center gap-1'>
              <Spinner />
              Signing up...
            </div>
          ) : (
            'Sign Up'
          )}
        </Button>
      </form>
    </Form>
  );
}
