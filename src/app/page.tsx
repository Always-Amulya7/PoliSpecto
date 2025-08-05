'use client';

import {useAuth} from '@/hooks/use-auth';
import {useRouter} from 'next/navigation';
import {useEffect} from 'react';
import {Dashboard} from '@/components/dashboard';
import {Loader2} from 'lucide-react';

export default function Home() {
  const {user, loading} = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return <Dashboard />;
}
