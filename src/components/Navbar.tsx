import React, { useState } from 'react';
import { BookMarked, Menu, User, X } from 'lucide-react';
import { AppView } from '../types/library';
import { useLibrary } from '../context/LibraryContext';

interface NavbarProps {
  currentView: AppView;
  onNavigateHome: (sectionId?: string) => void;
  onNavigateCatalog: () => void;
  onNavigateDashboard: () => void;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigateHome,
  onNavigateCatalog,
  onNavigateDashboard,
  onOpenAuth,
}) => {
  const { user } = useLibrary();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLinkClick = (action: () => void) => {
    setMobileMenuOpen(false);
    action();
  };

  const navLinkClass = (active: boolean) =>
    `relative py-1 text-sm font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#96495D] rounded-sm ${
      active
        ? 'text-[#39343A] after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:bg-[#D98FA1]'
        : 'text-[#6E656F] hover:text-[#39343A]'
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-[#39343A]/[0.08] bg-[#FFF9FA]/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          type="button"
          onClick={() => handleLinkClick(() => onNavigateHome())}
          className="inline-flex items-center gap-2.5 text-left whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#96495D] rounded-md py-1"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F4B6C2]/45 text-[#39343A]">
            <BookMarked className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className="font-editorial text-xl font-semibold tracking-tight text-[#39343A]">
            Pustaka Nirmala
          </span>
        </button>

        {/* Zone 2: Primary Navigation Links */}
        <nav
          aria-label="Navigasi utama"
          className="hidden lg:flex items-center gap-6"
        >
          <button
            type="button"
            onClick={() => handleLinkClick(() => onNavigateHome())}
            className={navLinkClass(currentView === 'home')}
          >
            Beranda
          </button>
          <button
            type="button"
            onClick={() => handleLinkClick(onNavigateCatalog)}
            className={navLinkClass(currentView === 'catalog' || currentView === 'detail')}
          >
            Katalog
          </button>
          <button
            type="button"
            onClick={() => handleLinkClick(() => onNavigateHome('kategori'))}
            className={navLinkClass(false)}
          >
            Kategori
          </button>
          <button
            type="button"
            onClick={() => handleLinkClick(() => onNavigateHome('koleksi-populer'))}
            className={navLinkClass(false)}
          >
            Koleksi Populer
          </button>
          <button
            type="button"
            onClick={() => handleLinkClick(() => onNavigateHome('tentang-kami'))}
            className={navLinkClass(false)}
          >
            Tentang Kami
          </button>
        </nav>

        {/* Zone 3: Single Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          {user ? (
            <button
              type="button"
              onClick={() => handleLinkClick(onNavigateDashboard)}
              className={`hidden sm:inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#96495D] focus-visible:ring-offset-2 ${
                currentView === 'dashboard'
                  ? 'bg-[#96495D] text-white'
                  : 'bg-[#39343A] text-[#FFF9FA] hover:bg-[#4D464E]'
              }`}
            >
              <User className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="max-w-[140px] truncate">{user.name.split(' ')[0]}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleLinkClick(onOpenAuth)}
              className="hidden sm:inline-flex items-center justify-center rounded-xl bg-[#39343A] px-4 py-2 text-sm font-medium text-[#FFF9FA] transition-colors hover:bg-[#96495D] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#96495D] focus-visible:ring-offset-2"
            >
              Masuk / Daftar
            </button>
          )}

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
            aria-expanded={mobileMenuOpen}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#39343A]/10 bg-white text-[#39343A] lg:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#96495D]"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-[#39343A]/[0.08] bg-[#FFF9FA] px-4 py-4 lg:hidden">
          <nav aria-label="Navigasi seluler" className="flex flex-col gap-1">
            <button
              type="button"
              onClick={() => handleLinkClick(() => onNavigateHome())}
              className="flex min-h-[44px] items-center rounded-xl px-3 text-left text-sm font-medium text-[#39343A] hover:bg-[#FDF2F4]"
            >
              Beranda
            </button>
            <button
              type="button"
              onClick={() => handleLinkClick(onNavigateCatalog)}
              className="flex min-h-[44px] items-center rounded-xl px-3 text-left text-sm font-medium text-[#39343A] hover:bg-[#FDF2F4]"
            >
              Katalog
            </button>
            <button
              type="button"
              onClick={() => handleLinkClick(() => onNavigateHome('kategori'))}
              className="flex min-h-[44px] items-center rounded-xl px-3 text-left text-sm font-medium text-[#39343A] hover:bg-[#FDF2F4]"
            >
              Kategori
            </button>
            <button
              type="button"
              onClick={() => handleLinkClick(() => onNavigateHome('koleksi-populer'))}
              className="flex min-h-[44px] items-center rounded-xl px-3 text-left text-sm font-medium text-[#39343A] hover:bg-[#FDF2F4]"
            >
              Koleksi Populer
            </button>
            <button
              type="button"
              onClick={() => handleLinkClick(() => onNavigateHome('tentang-kami'))}
              className="flex min-h-[44px] items-center rounded-xl px-3 text-left text-sm font-medium text-[#39343A] hover:bg-[#FDF2F4]"
            >
              Tentang Kami
            </button>
            <div className="mt-2 pt-2 border-t border-[#39343A]/[0.08]">
              {user ? (
                <button
                  type="button"
                  onClick={() => handleLinkClick(onNavigateDashboard)}
                  className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-[#96495D] px-4 text-sm font-medium text-white"
                >
                  <User className="h-4 w-4" aria-hidden="true" />
                  <span>Dashboard ({user.name.split(' ')[0]})</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleLinkClick(onOpenAuth)}
                  className="flex min-h-[44px] w-full items-center justify-center rounded-xl bg-[#39343A] px-4 text-sm font-medium text-[#FFF9FA]"
                >
                  Masuk / Daftar
                </button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
