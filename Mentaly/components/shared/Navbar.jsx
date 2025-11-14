'use client';

import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  ListChecks, 
  BarChart3, 
  Trophy, 
  LogOut,
  Menu,
  X,
  Sparkles
} from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/habits', label: 'Hábitos', icon: ListChecks },
    { href: '/challenges', label: 'Retos', icon: Trophy },
    { href: '/stats', label: 'Estadísticas', icon: BarChart3 },
    { href: '/achievements', label: 'Logros', icon: Trophy },
  ];

  return (
    <nav className="glass-effect border-b border-white/20 sticky top-0 z-50 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo y links de navegación */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/dashboard" className="text-2xl font-bold text-white flex items-center">
                <Sparkles className="mr-2 h-6 w-6" />
                Mentaly
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden sm:ml-8 sm:flex sm:space-x-4">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                      isActive
                        ? 'gradient-primary text-white shadow-glow'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Usuario y logout */}
          <div className="hidden sm:flex sm:items-center sm:space-x-4">
            {user && (
              <>
                <span className="text-sm text-white/80">
                  {user.displayName || user.email}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-white/80 hover:text-white hover:bg-white/10"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Salir
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white/80 hover:bg-white/10"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-white/20 glass-effect">
          <div className="pt-2 pb-3 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center px-4 py-2 text-base font-medium transition-all duration-200 ${
                    isActive
                      ? 'gradient-primary text-white shadow-glow border-l-4 border-white'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {link.label}
                </Link>
              );
            })}
          </div>
          
          {user && (
            <div className="pt-4 pb-3 border-t border-white/20">
              <div className="px-4 mb-3">
                <div className="text-base font-medium text-white">
                  {user.displayName || 'Usuario'}
                </div>
                <div className="text-sm text-white/60">{user.email}</div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 text-base font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

