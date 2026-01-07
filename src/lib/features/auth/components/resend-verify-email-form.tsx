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
import {
  type ResendVerificationEmailForm,
  resendVerificationEmailSchema,
} from '@/lib/features/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import z from 'zod';

export function ResendVerifyEmailForm() {
  const { resendVerificationEmail, isLoading } = useAuth();

  const form = useForm<z.infer<typeof resendVerificationEmailSchema>>({
    defaultValues: {
      email: '',
    },
    resolver: zodResolver(resendVerificationEmailSchema),
  });

  const onSubmit = async (data: ResendVerificationEmailForm) => {
    try {
      await resendVerificationEmail(data.email);
    } catch (error: any) {
      form.setError('root', {
        message:
          error.message || 'Forgot password failed. Please check your email.',
      });
    }
  };

  return (
    <Form {...form}>
      <form className='w-full space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type='email'
                  placeholder='Enter your email'
                  className='w-full'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit' className='w-full' disabled={isLoading}>
          {isLoading ? (
            <div className='flex items-center gap-1'>
              <Spinner />
              Sending...
            </div>
          ) : (
            'Resend'
          )}
        </Button>
      </form>
    </Form>
  );
}
