'use client';
import {AuthContextProvider} from '@/hooks/use-auth';

export function AuthProvider({children}: {children: React.ReactNode}) {
  return <AuthContextProvider>{children}</AuthContextProvider>;
}
