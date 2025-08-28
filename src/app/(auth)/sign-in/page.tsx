'use client';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { loginSchema } from '@/schemas/loginSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';

const page = () => {
  const router = useRouter();
  const [isSubmitting, setisSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: '',
      password: ''
    }
  })

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    setisSubmitting(true);

      const response = await signIn('credentials', {
        identifier: data.identifier,
        password: data.password,
        redirect: false
      })
      
      if(response?.error){
        console.log(response.error);
        toast.error(`Incorrect username or password, ${response.error}`);
      }

      if(response?.url){
        router.replace('/dashboard')
      }
      
      setisSubmitting(false);
  }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">Login to Mystery Message</h1>
          <p className="mb-4">Sign in to start your anonymous adventures</p>
        </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                  <FormItem>
                  <FormLabel>Email/Username</FormLabel>
                  <FormControl>
                    <Input placeholder="email/username" {...field} />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                  <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="password" {...field} />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
              />
              <Button type="submit" disabled={isSubmitting}>
                {
                  isSubmitting ? (
                      <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                    </>
                  ) : ('Login')
                }
              </Button>
              </form>
          </Form>

          <div className="text-center mt-4">
            <p>
              Not Registered ?{' '}
              <Link href={'/sign-up'} className="text-blue-600 hover:text-blue-800">Sign Up</Link>
            </p>
          </div>
      </div>
    </div>
  )
}

export default page