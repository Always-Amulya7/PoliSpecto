'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Package2 } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

export default function RegisterPage() {
  const { user, loading, signUpWithEmail } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!loading && user) {
      router.push('/');
    }
  }, [user, loading, router]);

  const handleEmailSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;
    const confirmPassword = (form.elements.namedItem('confirmPassword') as HTMLInputElement).value;

    if (password !== confirmPassword) {
        toast({
            variant: "destructive",
            title: "Passwords do not match",
            description: "Please make sure your passwords match.",
        });
        return;
    }

    if (email && password) {
        signUpWithEmail(email, password);
    } else {
        toast({
            variant: "destructive",
            title: "Missing Information",
            description: "Please provide email and password.",
        });
    }
  };

  if (!isClient || loading || user) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background">
        <div className="relative flex h-20 w-20 items-center justify-center">
            <Loader2 className="absolute h-20 w-20 animate-spin text-primary" />
            <Package2 className="h-10 w-10 text-primary" />
        </div>
        <p className="mt-4 text-lg font-semibold text-primary">Loading...</p>
      </div>
    );
  }

  return (
    <div 
      className="flex min-h-screen items-center justify-center bg-gray-100 font-sans"
    >
        <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl p-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Create an Account</h2>
            <p className="text-gray-500 mb-6">Start your journey with us.</p>
            <form onSubmit={handleEmailSignUp} className="flex flex-col gap-4">
                <div>
                    <Label htmlFor="email" className="text-gray-600 text-xs font-semibold">Email Address</Label>
                    <Input id="email" name="email" type="email" placeholder="you@example.com" className="mt-1 bg-gray-100/80 border-gray-200/80 text-gray-800 placeholder:text-gray-400 focus:bg-white focus:border-primary/50 focus:ring-primary/50" />
                </div>
                <div>
                    <Label htmlFor="password"  className="text-gray-600 text-xs font-semibold">Password</Label>
                    <Input id="password" name="password" type="password" placeholder="••••••••" className="mt-1 bg-gray-100/80 border-gray-200/80 text-gray-800 focus:bg-white focus:border-primary/50 focus:ring-primary/50" />
                </div>
                 <div>
                    <Label htmlFor="confirmPassword"  className="text-gray-600 text-xs font-semibold">Confirm Password</Label>
                    <Input id="confirmPassword" name="confirmPassword" type="password" placeholder="••••••••" className="mt-1 bg-gray-100/80 border-gray-200/80 text-gray-800 focus:bg-white focus:border-primary/50 focus:ring-primary/50" />
                </div>
                 <Button type="submit" className="w-full font-semibold text-base bg-primary h-11 mt-4 hover:bg-primary/90">Sign Up</Button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
                Already have an account? <Link href="/login" className="font-semibold text-primary hover:underline">Log in</Link>
            </div>
        </div>
    </div>
  );
}
