
// 'use client';
// import {
//   File,
//   Home,
//   LineChart,
//   LogOut,
//   Package2,
//   Info,
//   Moon,
//   Sun,
//   User,
//   Settings,
//   Users,
//   Archive,
//   ClipboardCheck,
// } from 'lucide-react';
// import Link from 'next/link';
// import { Button } from '@/components/ui/button';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';
// import { useAuth } from '@/hooks/use-auth';
// import Image from 'next/image';
// import { useState, useEffect } from 'react';
// import { usePathname, useRouter } from 'next/navigation';

// export function DashboardLayout({ children }: { children: React.ReactNode }) {
//   const { user, logout } = useAuth();
//   const [isDarkMode, setIsDarkMode] = useState(true);
//   const pathname = usePathname();
//   const router = useRouter();

//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       const isDark = document.documentElement.classList.contains('dark');
//       setIsDarkMode(isDark);
//     }
//   }, []);

//   const toggleTheme = () => {
//     if (document.documentElement.classList.contains('dark')) {
//       document.documentElement.classList.remove('dark');
//       setIsDarkMode(false);
//     } else {
//       document.documentElement.classList.add('dark');
//       setIsDarkMode(true);
//     }
//   };

//   const navLinks = [
//     { href: '/', label: 'Home', icon: Home },
//     { href: '/documents', label: 'Documents', icon: File },
//     { href: '/analytics', label: 'Analytics', icon: LineChart },
//     { href: '/terms-check', label: 'Terms Check', icon: ClipboardCheck },
//     { href: '/archive', label: 'Archived', icon: Archive },
//     { href: '/team', label: 'Team', icon: Users },
//     { href: '/about', label: 'About', icon: Info },
//   ];

//   return (
//     <div className="flex min-h-screen w-full">
//       <aside className="hidden bg-card md:fixed md:inset-y-0 md:left-0 md:z-30 md:block md:w-[220px] lg:w-[240px] md:border-r">
//         <div className="flex h-full max-h-screen flex-col gap-2">
//           <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
//             <Link href="/" className="flex items-center gap-2 font-semibold">
//               <Package2 className="h-6 w-6" />
//               <span className="">PoliSpecto</span>
//             </Link>
//           </div>
//           <div className="flex-1 overflow-y-auto">
//             <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
//               {navLinks.map((link) => (
//                 <Link
//                   key={link.href}
//                   href={link.href}
//                   className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
//                     pathname === link.href
//                       ? 'bg-muted text-primary'
//                       : 'text-muted-foreground'
//                   }`}
//                 >
//                   <link.icon className="h-4 w-4" />
//                   {link.label}
//                 </Link>
//               ))}
//             </nav>
//           </div>
//           <div className="mt-auto p-4">
//             <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
//               <Link
//                 href="/settings"
//                 className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
//                     pathname === '/settings'
//                       ? 'bg-muted text-primary'
//                       : 'text-muted-foreground'
//                   }`}
//               >
//                 <Settings className="h-4 w-4" />
//                 Settings
//               </Link>
//             </nav>
//           </div>
//         </div>
//       </aside>
//       <div className="flex flex-1 flex-col md:pl-[220px] lg:pl-[240px] relative overflow-x-hidden">
//         <header className="flex h-14 shrink-0 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6 sticky top-0 z-20">
//           <div className="w-full flex-1">
//             <h1 className="text-lg font-semibold">
//               Welcome {user?.displayName || user?.email || 'User'}
//             </h1>
//           </div>
//           <Button
//             variant="outline"
//             size="icon"
//             onClick={toggleTheme}
//             className="h-8 w-8 rounded-full"
//           >
//             {isDarkMode ? (
//               <Sun className="h-4 w-4" />
//             ) : (
//               <Moon className="h-4 w-4" />
//             )}
//             <span className="sr-only">Toggle theme</span>
//           </Button>
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button
//                 variant="secondary"
//                 size="icon"
//                 className="rounded-full"
//               >
//                 {user?.photoURL ? (
//                   <Image
//                     src={user.photoURL}
//                     width={36}
//                     height={36}
//                     alt="Avatar"
//                     className="rounded-full"
//                   />
//                 ) : (
//                   <User className="h-5 w-5" />
//                 )}
//                 <span className="sr-only">Toggle user menu</span>
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end">
//               <DropdownMenuLabel>My Account</DropdownMenuLabel>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem onClick={() => router.push('/settings')}>Settings</DropdownMenuItem>
//               <DropdownMenuItem>Support</DropdownMenuItem>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem onClick={logout}>
//                 <LogOut className="mr-2 h-4 w-4" />
//                 Logout
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </header>
//         <main className="flex-1 bg-background flex flex-col">
//             {children}
//         </main>
//       </div>
//     </div>
//   );
// }


'use client';

import {
  File,
  Home,
  LineChart,
  LogOut,
  Package2,
  Info,
  Moon,
  Sun,
  User,
  Settings,
  Users,
  Archive,
  ClipboardCheck,
  Menu,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/use-auth';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isDark = document.documentElement.classList.contains('dark');
      setIsDarkMode(isDark);
    }
  }, []);

  const toggleTheme = () => {
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    }
  };

  const navLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/documents', label: 'Documents', icon: File },
    { href: '/analytics', label: 'Analytics', icon: LineChart },
    { href: '/terms-check', label: 'Terms Check', icon: ClipboardCheck },
    { href: '/archive', label: 'Archived', icon: Archive },
    { href: '/team', label: 'Team', icon: Users },
    { href: '/about', label: 'About', icon: Info },
  ];

  return (
    <div className="flex min-h-screen w-full">
      {/* Desktop Sidebar */}
      <aside className="hidden bg-card md:fixed md:inset-y-0 md:left-0 md:z-30 md:block md:w-[220px] lg:w-[240px] md:border-r">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Package2 className="h-6 w-6" />
              <span>PoliSpecto</span>
            </Link>
          </div>
          <div className="flex-1 overflow-y-auto">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                    pathname === link.href
                      ? 'bg-muted text-primary'
                      : 'text-muted-foreground'
                  }`}
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="mt-auto p-4">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <Link
                href="/settings"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                  pathname === '/settings'
                    ? 'bg-muted text-primary'
                    : 'text-muted-foreground'
                }`}
              >
                <Settings className="h-4 w-4" />
                Settings
              </Link>
            </nav>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Drawer */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setIsSidebarOpen(false)}
          />
          {/* Sidebar */}
          <div className="relative z-50 w-64 bg-card p-4 shadow-lg">
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="absolute right-4 top-4"
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </button>
            <div className="flex items-center gap-2 mb-6 font-semibold">
              <Package2 className="h-6 w-6" />
              <span>PoliSpecto</span>
            </div>
            <nav className="space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                    pathname === link.href
                      ? 'bg-muted text-primary'
                      : 'text-muted-foreground'
                  }`}
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Link>
              ))}
              <Link
                href="/settings"
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                  pathname === '/settings'
                    ? 'bg-muted text-primary'
                    : 'text-muted-foreground'
                }`}
              >
                <Settings className="h-4 w-4" />
                Settings
              </Link>
            </nav>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col md:pl-[220px] lg:pl-[240px] relative overflow-x-hidden">
        {/* Header */}
        <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-background px-4 lg:h-[60px] lg:px-6 sticky top-0 z-20">
          {/* Mobile menu button */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="md:hidden p-2"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Welcome text */}
          <div className="flex-1 min-w-0">
            <h1 className="text-sm sm:text-lg font-semibold truncate max-w-[150px] sm:max-w-none">
              Welcome {user?.displayName || user?.email || 'User'}
            </h1>
          </div>

          {/* Theme toggle */}
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className="h-8 w-8 rounded-full"
          >
            {isDarkMode ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* User dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                {user?.photoURL ? (
                  <Image
                    src={user.photoURL}
                    width={36}
                    height={36}
                    alt="Avatar"
                    className="rounded-full"
                  />
                ) : (
                  <User className="h-5 w-5" />
                )}
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/settings')}>
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Page content */}
        <main className="flex-1 bg-background flex flex-col">{children}</main>
      </div>
    </div>
  );
}
