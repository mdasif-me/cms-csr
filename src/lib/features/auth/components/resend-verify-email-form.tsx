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
import { MailIcon } from 'lucide-react';
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
      <form
        className='w-full space-y-4 flex items-center justify-between gap-4'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className='w-full'>
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
                      className='w-full pl-11 h-11 rounded-md'
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type='submit' className='h-11 mt-1.5' disabled={isLoading}>
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
