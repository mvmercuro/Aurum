'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { login } from './actions'
import { useSearchParams } from 'next/navigation'

export default function AdminLoginPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  return (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-secondary'>
      <div className='flex w-full max-w-md flex-col gap-8 rounded-lg border border-border bg-card p-8 shadow-xl'>
        <div className='flex flex-col items-center gap-6'>
          <div className='flex h-16 w-16 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-purple-600 shadow-lg'>
            <span className='font-serif text-3xl font-bold text-white'>S</span>
          </div>
          <h1 className='text-center text-3xl font-bold tracking-tight'>
            Admin Login
          </h1>
          <p className='max-w-sm text-center text-sm text-muted-foreground'>
            Enter your credentials to access the admin dashboard.
          </p>
        </div>

        {error && (
          <div className='rounded-md bg-destructive/15 p-3 text-center text-sm text-destructive'>
            {error === 'auth_code_error'
              ? 'Authentication failed. Please try again.'
              : decodeURIComponent(error)}
          </div>
        )}

        <form action={login} className='flex flex-col gap-4'>
          <div className='space-y-2'>
            <Label htmlFor='email'>Email</Label>
            <Input
              id='email'
              name='email'
              type='email'
              placeholder='admin@example.com'
              required
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='password'>Password</Label>
            <Input id='password' name='password' type='password' required />
          </div>
          <Button
            type='submit'
            size='lg'
            className='w-full shadow-lg transition-all hover:shadow-xl'
          >
            Sign in
          </Button>
        </form>
      </div>
    </div>
  )
}
