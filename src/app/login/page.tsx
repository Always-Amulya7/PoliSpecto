'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Package2 } from 'lucide-react';
import Link from 'next/link';
import { generateImageAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';

const GoogleIcon = () => (
  <svg className="h-5 w-5 text-gray-700" viewBox="0 0 24 24">
    <path
      fill="currentColor"
      d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12.5C5,8.75 8.36,5.73 12.19,5.73C15.19,5.73 17.5,6.7 17.5,6.7L19.43,4.82C19.43,4.82 16.91,3 12.19,3C6.42,3 2.03,7.8 2.03,12.5C2.03,17.2 6.42,22 12.19,22C17.96,22 21.54,18.33 21.54,12.81C21.54,12.09 21.48,11.6 21.35,11.1Z"
    />
  </svg>
);

const GithubIcon = () => (
    <svg className="h-5 w-5 text-gray-700" viewBox="0 0 16 16">
        <path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
    </svg>
)

export default function LoginPage() {
  const { user, loading, signInWithGoogle, signInWithGithub, signInWithEmail } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  const [bgImage, setBgImage] = useState('');
  const [panelImage, setPanelImage] = useState('');
  const [imagesLoading, setImagesLoading] = useState(true);

  useEffect(() => {
    setIsClient(true);
    const fetchImages = async () => {
        try {
            const [bgResult, panelResult] = await Promise.all([
                generateImageAction('ethereal abstract background, professional, cool tones, digital art'),
                generateImageAction('serene nature sunrise, minimalist, digital painting')
            ]);

            if (bgResult.success && bgResult.data?.imageUrl) {
                setBgImage(bgResult.data.imageUrl);
            }
            if (panelResult.success && panelResult.data?.imageUrl) {
                setPanelImage(panelResult.data.imageUrl);
            }
        } catch (error) {
            console.error("Failed to generate images", error);
        } finally {
            setImagesLoading(false);
        }
    };

    fetchImages();
  }, []);

  useEffect(() => {
    if (!loading && user) {
      router.push('/');
    }
  }, [user, loading, router]);

  const handleEmailSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const email = (form.elements.namedItem('username') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;
    
    if (email && password) {
        signInWithEmail(email, password);
    } else {
        toast({
            variant: "destructive",
            title: "Missing Information",
            description: "Please provide both email and password.",
        });
    }
  }

  if (!isClient || loading || user || imagesLoading) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background">
        <div className="relative flex h-20 w-20 items-center justify-center">
            <Loader2 className="absolute h-20 w-20 animate-spin text-primary" />
            <Package2 className="h-10 w-10 text-primary" />
        </div>
        <p className="mt-4 text-lg font-semibold text-primary">Setting Up The Application</p>
      </div>
    );
  }

  return (
    <div 
      className="flex min-h-screen items-center justify-center bg-cover bg-center font-sans transition-all duration-500"
      style={{backgroundImage: `url('${bgImage}')`}}
    >
        <div className="w-full max-w-4xl rounded-2xl bg-white/10 shadow-2xl backdrop-blur-2xl flex overflow-hidden border border-white/20">
            <div className="w-1/2 p-12 text-white flex flex-col justify-center items-start bg-cover bg-center transition-all duration-500" 
                style={{backgroundImage: `url('${panelImage}')`}}
            >
                <h1 className="text-5xl font-bold [text-shadow:_0_2px_4px_rgb(0_0_0_/_40%)]">Good Morning</h1>
                <p className="mt-2 text-lg [text-shadow:_0_1px_3px_rgb(0_0_0_/_30%)]">Have a great journey ahead!</p>
            </div>
            <div className="w-1/2 p-12 flex flex-col justify-center bg-white/80 backdrop-blur-sm">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Login</h2>
                <p className="text-gray-500 mb-6">Welcome back! Please enter your details.</p>
                <form onSubmit={handleEmailSignIn} className="flex flex-col gap-4">
                    <div>
                        <Label htmlFor="username" className="text-gray-600 text-xs font-semibold">Email Address</Label>
                        <Input id="username" name="username" type="email" placeholder="you@example.com" className="mt-1 bg-gray-100/80 border-gray-200/80 text-gray-800 placeholder:text-gray-400 focus:bg-white focus:border-primary/50 focus:ring-primary/50" />
                    </div>
                    <div>
                        <Label htmlFor="password"  className="text-gray-600 text-xs font-semibold">Password</Label>
                        <Input id="password" name="password" type="password" placeholder="••••••••" className="mt-1 bg-gray-100/80 border-gray-200/80 text-gray-800 focus:bg-white focus:border-primary/50 focus:ring-primary/50" />
                    </div>
                    <div className="flex items-center justify-between text-xs mt-2">
                        <div className="flex items-center gap-2">
                            <Checkbox id="remember-me" className="border-gray-400 data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
                            <Label htmlFor="remember-me" className="text-gray-600">Remember for 30 days</Label>
                        </div>
                        <Link href="#" className="font-semibold text-primary hover:underline">Forgot Password</Link>
                    </div>
                     <Button type="submit" className="w-full font-semibold text-base bg-primary h-11 mt-4 hover:bg-primary/90">Sign In</Button>
                </form>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white/80 px-2 text-gray-500 backdrop-blur-sm">
                        Or
                    </span>
                    </div>
                </div>

                <div className="flex justify-center gap-3">
                    <Button onClick={signInWithGoogle} variant="outline" className="w-full bg-transparent border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400">
                        <GoogleIcon /> Sign in with Google
                    </Button>
                    <Button onClick={() => signInWithGithub()} variant="outline" className="w-full bg-transparent border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400">
                        <GithubIcon /> Sign in with GitHub
                    </Button>
                </div>

                <div className="mt-6 text-center text-sm text-gray-600">
                    Don't have an account? <Link href="/register" className="font-semibold text-primary hover:underline">Sign up for free</Link>
                </div>
            </div>
        </div>
    </div>
  );
}
