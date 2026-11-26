/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';
import { LibraryProvider, useLibrary } from './context/LibraryContext';
import { AppView, Book, CategoryName, SortOption } from './types/library';
import { Navbar } from './components/Navbar';
import { HomePage } from './components/HomePage';
import { CatalogPage } from './components/CatalogPage';
import { BookDetailPage } from './components/BookDetailPage';
import { DashboardPage } from './components/DashboardPage';
import { DigitalReaderModal } from './components/DigitalReaderModal';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';

const ToastOverlay: React.FC = () => {
  const { toast, clearToast } = useLibrary();
  if (!toast) return null;

  const toneConfig = {
    success: {
      bg: 'bg-[#DCE8DC] border-[#2C4A30]/20 text-[#2C4A30]',
      icon: <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />,
    },
    info: {
      bg: 'bg-[#DCD6F7] border-[#39343A]/15 text-[#39343A]',
      icon: <Info className="h-4 w-4 shrink-0" aria-hidden="true" />,
    },
    warning: {
      bg: 'bg-[#FDF2F4] border-[#96495D]/25 text-[#96495D]',
      icon: <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />,
    },
  }[toast.tone];

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-5 right-5 z-50 max-w-sm"
    >
      <div
        className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-xs font-semibold shadow-lg ${toneConfig.bg}`}
      >
        {toneConfig.icon}
        <span className="leading-snug">{toast.text}</span>
        <button
          type="button"
          onClick={clearToast}
          aria-label="Tutup notifikasi"
          className="ml-1 rounded-lg p-1 hover:bg-black/5"
        >
          <X className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};

const LibraryShell: React.FC = () => {
  const { user } = useLibrary();

  const [view, setView] = useState<AppView>('home');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [previousView, setPreviousView] = useState<AppView>('home');

  // Catalog filter state synchronized from HomePage triggers
  const [catalogSearch, setCatalogSearch] = useState('');
  const [catalogCategory, setCatalogCategory] = useState<CategoryName | 'Semua'>('Semua');
  const [catalogSort, setCatalogSort] = useState<SortOption>('popular');

  // Modals
  const [readerBook, setReaderBook] = useState<Book | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [pendingDashboardAfterAuth, setPendingDashboardAfterAuth] = useState(false);

  const navigateToHome = (sectionId?: string) => {
    setView('home');
    if (sectionId) {
      window.setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 60);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navigateToCatalog = (opts?: {
    search?: string;
    category?: CategoryName | 'Semua';
    sort?: SortOption;
  }) => {
    setCatalogSearch(opts?.search ?? '');
    setCatalogCategory(opts?.category ?? 'Semua');
    setCatalogSort(opts?.sort ?? 'popular');
    setView('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectBook = (book: Book) => {
    setPreviousView(view === 'detail' ? previousView : view);
    setSelectedBook(book);
    setView('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateDashboard = () => {
    if (!user) {
      setPendingDashboardAfterAuth(true);
      setAuthModalOpen(true);
      return;
    }
    setView('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAuth = () => {
    setPendingDashboardAfterAuth(false);
    setAuthModalOpen(true);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#FFF9FA] text-[#39343A]">
      <Navbar
        currentView={view}
        onNavigateHome={navigateToHome}
        onNavigateCatalog={() => navigateToCatalog()}
        onNavigateDashboard={handleNavigateDashboard}
        onOpenAuth={handleOpenAuth}
      />

      <main className="flex-1">
        {view === 'home' && (
          <HomePage
            onSearchSubmit={(query) =>
              navigateToCatalog({ search: query, category: 'Semua', sort: 'popular' })
            }
            onSelectCategory={(cat) =>
              navigateToCatalog({ search: '', category: cat, sort: 'popular' })
            }
            onSelectBook={handleSelectBook}
            onNavigateCatalog={() => navigateToCatalog()}
            onOpenAuth={handleOpenAuth}
          />
        )}

        {view === 'catalog' && (
          <CatalogPage
            initialSearch={catalogSearch}
            initialCategory={catalogCategory}
            initialSort={catalogSort}
            onSelectBook={handleSelectBook}
            onBackHome={() => navigateToHome()}
            onOpenAuth={handleOpenAuth}
          />
        )}

        {view === 'detail' && selectedBook && (
          <BookDetailPage
            book={selectedBook}
            onBack={() => {
              setView(previousView === 'dashboard' && !user ? 'catalog' : previousView);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectBook={handleSelectBook}
            onOpenReader={(book) => setReaderBook(book)}
            onOpenAuth={handleOpenAuth}
            onFilterBySubject={(subject) =>
              navigateToCatalog({ search: subject, category: 'Semua' })
            }
          />
        )}

        {view === 'dashboard' && (
          <DashboardPage
            key={user?.id || 'guest'}
            onBackHome={() => navigateToHome()}
            onNavigateCatalog={() => navigateToCatalog()}
            onSelectBook={handleSelectBook}
            onOpenReader={(book) => setReaderBook(book)}
          />
        )}
      </main>

      <Footer
        onNavigateHome={navigateToHome}
        onNavigateCatalog={(cat) =>
          navigateToCatalog({ category: cat ?? 'Semua', search: '' })
        }
        onNavigateDashboard={handleNavigateDashboard}
      />

      <DigitalReaderModal book={readerBook} onClose={() => setReaderBook(null)} />

      <AuthModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={() => {
          if (pendingDashboardAfterAuth) {
            setPendingDashboardAfterAuth(false);
            setView('dashboard');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
      />

      <ToastOverlay />
    </div>
  );
};

export default function App() {
  return (
    <LibraryProvider>
      <LibraryShell />
    </LibraryProvider>
  );
}
