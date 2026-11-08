'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  FolderTree,
  Calendar,
  Mic,
  Image as ImageIcon,
  Camera,
  Users,
  Mail,
  BarChart3,
  Settings,
  ExternalLink,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Check auth status
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/v1/auth/me', { credentials: 'include' });
        if (!res.ok) {
          router.push('/login');
          return;
        }
        const data = await res.json();
        if (data.success && data.user) {
          setUser(data.user);
        } else {
          router.push('/login');
        }
      } catch {
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/v1/auth/logout', { method: 'POST', credentials: 'include' });
      if (typeof window !== 'undefined') localStorage.removeItem('jalsa_user');
      router.push('/login');
    } catch {
      router.push('/login');
    }
  };

  const navItems = [
    { label: 'Editorial Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Articles & Content', href: '/admin/articles', icon: FileText },
    { label: 'Write New Article', href: '/admin/articles/new', icon: PlusCircle },
    { label: 'Topics & Categories', href: '/admin/categories', icon: FolderTree },
    { label: 'Jalsa Editions Hub', href: '/admin/editions', icon: Calendar },
    { label: 'Speeches & Transcripts', href: '/admin/speeches', icon: Mic },
    { label: 'Media Library', href: '/admin/media', icon: ImageIcon },
    { label: 'Photo Galleries', href: '/admin/galleries', icon: Camera },
    { label: 'Authors & Scholars', href: '/admin/authors', icon: Users },
    { label: 'Newsletter Subscribers', href: '/admin/newsletter', icon: Mail },
    { label: 'Editorial Analytics', href: '/admin/analytics', icon: BarChart3 },
    { label: 'Platform Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-screen w-64 bg-primary-dark text-white flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Brand header */}
          <div className="p-5 border-b border-primary-800 flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="relative w-9 h-9 flex-shrink-0">
                <Image src="/images/jalsa-emblem.png" alt="Jalsa Salana Official Logo" fill className="object-contain" />
              </div>
              <div>
                <span className="font-serif font-bold text-sm tracking-wide text-white block">
                  JALSA SALANA
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-gold block">
                  Editorial CMS
                </span>
              </div>
            </Link>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-primary text-white shadow'
                      : 'text-gray-300 hover:bg-primary-800 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-gold' : 'text-gray-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Card & Actions */}
        <div className="p-4 border-t border-primary-800 bg-black/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-gold/20 text-gold flex items-center justify-center font-bold text-xs">
              {user?.firstName?.[0] || 'A'}
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-bold text-white truncate">
                {user?.firstName} {user?.lastName}
              </div>
              <div className="text-[10px] text-gold uppercase tracking-wider font-semibold truncate">
                {user?.roleName || 'Administrator'}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-2 border-t border-primary-800/60">
            <Link
              href="/"
              target="_blank"
              className="text-gray-300 hover:text-white flex items-center gap-1"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Live Site</span>
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="text-red-300 hover:text-red-200 flex items-center gap-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="text-xs font-medium text-gray-500 flex items-center gap-1.5">
              <span>Jalsa CMS</span>
              <ChevronRight className="w-3 h-3 text-gray-400" />
              <span className="text-charcoal font-semibold capitalize">
                {pathname.replace('/admin', '').replace('/', '') || 'Overview'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-charcoal text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
              <span>View Magazine</span>
            </Link>
          </div>
        </header>

        {/* Main View Area */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1">{children}</main>
      </div>
    </div>
  );
}
