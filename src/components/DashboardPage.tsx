import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  BookCheck,
  BookOpen,
  Check,
  Clock,
  Heart,
  LogOut,
  Settings,
  Sparkles,
  User,
} from 'lucide-react';
import { BOOKS_CATALOG, LIBRARY_CATEGORIES } from '../data/books';
import { Book, CategoryName, UserProfile } from '../types/library';
import { useLibrary } from '../context/LibraryContext';
import { BookCard } from './BookCard';
import { BookCover } from './BookCover';

interface DashboardPageProps {
  onBackHome: () => void;
  onNavigateCatalog: () => void;
  onSelectBook: (book: Book) => void;
  onOpenReader: (book: Book) => void;
}

type DashboardTab =
  | 'overview'
  | 'history'
  | 'favorites'
  | 'borrowed'
  | 'recommendations'
  | 'settings';

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onBackHome,
  onNavigateCatalog,
  onSelectBook,
  onOpenReader,
}) => {
  const {
    user,
    favorites,
    borrowedBooks,
    readingHistory,
    returnBook,
    toggleFavorite,
    updateProfile,
    logout,
  } = useLibrary();

  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');

  // Account Settings Form State
  const [editName, setEditName] = useState(user?.name || '');
  const [editRole, setEditRole] = useState<UserProfile['role']>(
    user?.role || 'Mahasiswa S1'
  );
  const [editInstitution, setEditInstitution] = useState(user?.institution || '');
  const [editInterests, setEditInterests] = useState<CategoryName[]>(
    user?.interests || []
  );
  const [editReminders, setEditReminders] = useState(user?.emailReminders ?? true);

  const favoriteBooks = useMemo(
    () => BOOKS_CATALOG.filter((b) => favorites.includes(b.id)),
    [favorites]
  );

  const borrowedEntries = useMemo(
    () =>
      borrowedBooks
        .map((record) => {
          const book = BOOKS_CATALOG.find((b) => b.id === record.bookId);
          return book ? { record, book } : null;
        })
        .filter((x): x is { record: (typeof borrowedBooks)[number]; book: Book } => x !== null),
    [borrowedBooks]
  );

  const historyEntries = useMemo(
    () =>
      readingHistory
        .map((item) => {
          const book = BOOKS_CATALOG.find((b) => b.id === item.bookId);
          return book ? { item, book } : null;
        })
        .filter((x): x is { item: (typeof readingHistory)[number]; book: Book } => x !== null),
    [readingHistory]
  );

  const recommendedBooks = useMemo(() => {
    const interests = user?.interests || [];
    const readIds = new Set(readingHistory.map((h) => h.bookId));
    const scored = BOOKS_CATALOG.map((book) => {
      let score = book.readsCount / 1000;
      if (interests.includes(book.category)) score += 10;
      if (!readIds.has(book.id)) score += 3;
      return { book, score };
    });
    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map((s) => s.book);
  }, [user?.interests, readingHistory]);

  if (!user) {
    return (
      <section className="mx-auto max-w-[1200px] px-4 py-16 text-center sm:px-6 lg:px-8">
        <h1 className="font-editorial text-3xl font-semibold text-[#39343A]">
          Dashboard Anggota
        </h1>
        <p className="mt-2 text-sm text-[#6E656F]">
          Silakan masuk terlebih dahulu untuk melihat profil dan koleksi pribadi Anda.
        </p>
        <button
          type="button"
          onClick={onBackHome}
          className="mt-6 rounded-xl bg-[#39343A] px-5 py-2.5 text-sm font-medium text-white"
        >
          Kembali ke Beranda
        </button>
      </section>
    );
  }

  const toggleEditInterest = (cat: CategoryName) => {
    setEditInterests((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) return;
    updateProfile({
      name: editName.trim(),
      role: editRole,
      institution: editInstitution.trim() || 'Anggota Independen',
      interests: editInterests.length > 0 ? editInterests : ['Pendidikan'],
      emailReminders: editReminders,
    });
  };

  const tabs: { id: DashboardTab; label: string; icon: React.ReactNode; count?: number }[] = [
    { id: 'overview', label: 'Profil & Ringkasan', icon: <User className="h-4 w-4" /> },
    {
      id: 'history',
      label: 'Riwayat Membaca',
      icon: <Clock className="h-4 w-4" />,
      count: historyEntries.length,
    },
    {
      id: 'favorites',
      label: 'Daftar Favorit',
      icon: <Heart className="h-4 w-4" />,
      count: favoriteBooks.length,
    },
    {
      id: 'borrowed',
      label: 'Sedang Dipinjam',
      icon: <BookCheck className="h-4 w-4" />,
      count: borrowedEntries.length,
    },
    {
      id: 'recommendations',
      label: 'Rekomendasi Minat',
      icon: <Sparkles className="h-4 w-4" />,
    },
    { id: 'settings', label: 'Pengaturan Akun', icon: <Settings className="h-4 w-4" /> },
  ];

  const getDaysRemaining = (dueDateStr: string) => {
    const today = new Date();
    const due = new Date(dueDateStr);
    const diff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  return (
    <section className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#39343A]/[0.08] pb-6">
        <div>
          <button
            type="button"
            onClick={onBackHome}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#6E656F] hover:text-[#39343A] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>Kembali ke Beranda</span>
          </button>
          <h1 className="mt-2 font-editorial text-3xl font-semibold text-[#39343A] sm:text-4xl">
            Ruang Baca {user.name.split(' ')[0]}
          </h1>
          <p className="mt-1 text-sm text-[#6E656F]">
            {user.role} · {user.institution} · Kode Anggota{' '}
            <span className="font-mono text-[#39343A]">{user.memberCode}</span>
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            logout();
            onBackHome();
          }}
          className="inline-flex min-h-[42px] items-center gap-2 rounded-xl border border-[#39343A]/15 bg-white px-4 text-xs font-semibold text-[#39343A] hover:bg-[#FDF2F4] hover:text-[#96495D] transition-colors"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          <span>Keluar Akun</span>
        </button>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Sidebar Navigation */}
        <aside className="lg:col-span-3">
          <nav
            aria-label="Menu dashboard pengguna"
            className="flex flex-row gap-1.5 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0"
          >
            {tabs.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex min-h-[44px] items-center justify-between gap-3 rounded-xl px-4 py-2.5 text-left text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
                    active
                      ? 'bg-[#39343A] text-[#FFF9FA]'
                      : 'bg-white border border-[#39343A]/[0.08] text-[#39343A] hover:bg-[#FDF2F4]'
                  }`}
                >
                  <span className="inline-flex items-center gap-2.5">
                    {tab.icon}
                    <span>{tab.label}</span>
                  </span>
                  {typeof tab.count === 'number' && (
                    <span
                      className={`font-mono text-xs tabular-nums ${
                        active ? 'text-[#F4B6C2]' : 'text-[#6E656F]'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content Area */}
        <div className="lg:col-span-9">
          {/* Tab 1: Overview & Profile */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Profile Card */}
              <div className="rounded-2xl border border-[#39343A]/[0.08] bg-white p-6 sm:p-8">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#F4B6C2]/45 font-editorial text-2xl font-semibold text-[#39343A]">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h2 className="font-editorial text-2xl font-semibold text-[#39343A]">
                        {user.name}
                      </h2>
                      <p className="text-sm text-[#6E656F]">{user.email}</p>
                      <p className="mt-1 text-xs text-[#6E656F]">
                        {user.role} · {user.institution}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('settings')}
                    className="inline-flex min-h-[40px] items-center justify-center rounded-xl border border-[#39343A]/15 px-4 text-xs font-semibold text-[#39343A] hover:bg-[#FDF2F4] self-start sm:self-auto"
                  >
                    Ubah Profil
                  </button>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-4 border-t border-[#39343A]/[0.08] pt-6 sm:grid-cols-3">
                  <div>
                    <p className="text-xs text-[#6E656F]">Riwayat Baca</p>
                    <p className="mt-1 font-editorial text-2xl font-semibold text-[#39343A] tabular-nums">
                      {historyEntries.length} Judul
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#6E656F]">Buku Favorit</p>
                    <p className="mt-1 font-editorial text-2xl font-semibold text-[#39343A] tabular-nums">
                      {favoriteBooks.length} Judul
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#6E656F]">Pinjaman Aktif</p>
                    <p className="mt-1 font-editorial text-2xl font-semibold text-[#39343A] tabular-nums">
                      {borrowedEntries.length} Judul
                    </p>
                  </div>
                </div>

                <div className="mt-5 border-t border-[#39343A]/[0.06] pt-4 text-xs text-[#6E656F]">
                  Minat baca aktif:{' '}
                  <span className="font-medium text-[#39343A]">
                    {user.interests.join(' · ')}
                  </span>
                </div>
              </div>

              {/* Quick Preview: Continue Reading */}
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-editorial text-xl font-semibold text-[#39343A]">
                    Lanjutkan Membaca
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab('history')}
                    className="text-xs font-semibold text-[#96495D] hover:underline"
                  >
                    Lihat semua riwayat
                  </button>
                </div>
                {historyEntries.length > 0 ? (
                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {historyEntries.slice(0, 2).map(({ item, book }) => (
                      <div
                        key={book.id}
                        className="flex gap-4 rounded-2xl border border-[#39343A]/[0.08] bg-white p-4"
                      >
                        <div className="w-20 shrink-0">
                          <BookCover book={book} size="sm" />
                        </div>
                        <div className="flex flex-1 flex-col justify-between min-w-0">
                          <div>
                            <p className="text-xs text-[#6E656F]">{book.category}</p>
                            <h4 className="mt-0.5 font-editorial text-base font-semibold text-[#39343A] line-clamp-2">
                              {book.title}
                            </h4>
                            <p className="text-xs text-[#6E656F] truncate">{book.author}</p>
                          </div>
                          <div className="mt-3">
                            <div className="flex items-center justify-between text-xs text-[#6E656F] tabular-nums">
                              <span>Progres</span>
                              <span className="font-mono font-medium text-[#39343A]">
                                {item.progressPercent}%
                              </span>
                            </div>
                            <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-[#FDF2F4]">
                              <div
                                style={{ width: `${item.progressPercent}%` }}
                                className="h-full bg-[#96495D]"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => onOpenReader(book)}
                              className="mt-3 text-xs font-semibold text-[#96495D] hover:underline"
                            >
                              Lanjutkan Baca
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-4 rounded-2xl border border-[#39343A]/[0.08] bg-white p-6 text-sm text-[#6E656F]">
                    Belum ada buku yang dibaca. Mulai buka salah satu koleksi digital dari{' '}
                    <button
                      type="button"
                      onClick={onNavigateCatalog}
                      className="font-semibold text-[#96495D] underline"
                    >
                      katalog
                    </button>
                    .
                  </div>
                )}
              </div>

              {/* Personalized Recommendations Preview */}
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-editorial text-xl font-semibold text-[#39343A]">
                    Rekomendasi Berdasarkan Minat Anda
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab('recommendations')}
                    className="text-xs font-semibold text-[#96495D] hover:underline"
                  >
                    Lihat semua
                  </button>
                </div>
                <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {recommendedBooks.slice(0, 3).map((book) => (
                    <BookCard key={book.id} book={book} onSelect={onSelectBook} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Reading History */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <h2 className="font-editorial text-2xl font-semibold text-[#39343A]">
                Riwayat Membaca
              </h2>
              {historyEntries.length > 0 ? (
                <div className="space-y-4">
                  {historyEntries.map(({ item, book }) => (
                    <div
                      key={book.id}
                      className="flex flex-col gap-4 rounded-2xl border border-[#39343A]/[0.08] bg-white p-5 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-16 shrink-0">
                          <BookCover book={book} size="sm" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs text-[#6E656F]">
                            {book.category} · Dibaca pada{' '}
                            <span className="font-mono tabular-nums">
                              {item.lastReadAt.slice(0, 10)}
                            </span>
                          </p>
                          <h3
                            onClick={() => onSelectBook(book)}
                            className="mt-1 cursor-pointer font-editorial text-lg font-semibold text-[#39343A] hover:text-[#96495D] truncate"
                          >
                            {book.title}
                          </h3>
                          <p className="text-sm text-[#6E656F]">{book.author}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 shrink-0">
                        <div className="w-28">
                          <div className="flex justify-between text-xs text-[#6E656F] tabular-nums">
                            <span>Selesai</span>
                            <span className="font-mono font-medium text-[#39343A]">
                              {item.progressPercent}%
                            </span>
                          </div>
                          <div className="mt-1 h-1.5 w-full rounded-full bg-[#FDF2F4]">
                            <div
                              style={{ width: `${item.progressPercent}%` }}
                              className="h-full rounded-full bg-[#96495D]"
                            />
                          </div>
                        </div>
                        {book.digitalAvailable && (
                          <button
                            type="button"
                            onClick={() => onOpenReader(book)}
                            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl bg-[#96495D] px-4 text-xs font-semibold text-white hover:bg-[#7D3A4B]"
                          >
                            <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>Lanjutkan</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-[#39343A]/[0.08] bg-white p-10 text-center">
                  <p className="text-sm text-[#6E656F]">
                    Riwayat membaca Anda masih kosong.
                  </p>
                  <button
                    type="button"
                    onClick={onNavigateCatalog}
                    className="mt-4 rounded-xl bg-[#39343A] px-5 py-2.5 text-xs font-semibold text-white"
                  >
                    Jelajahi Koleksi Digital
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Favorites */}
          {activeTab === 'favorites' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-editorial text-2xl font-semibold text-[#39343A]">
                  Daftar Buku Favorit
                </h2>
                <span className="font-mono text-xs text-[#6E656F] tabular-nums">
                  {favoriteBooks.length} tersimpan
                </span>
              </div>

              {favoriteBooks.length > 0 ? (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {favoriteBooks.map((book) => (
                    <BookCard key={book.id} book={book} onSelect={onSelectBook} />
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-[#39343A]/[0.08] bg-white p-10 text-center">
                  <p className="text-sm text-[#6E656F]">
                    Belum ada buku yang disimpan ke favorit. Klik ikon hati pada kartu
                    buku atau halaman detail untuk menyimpannya di sini.
                  </p>
                  <button
                    type="button"
                    onClick={onNavigateCatalog}
                    className="mt-4 rounded-xl bg-[#39343A] px-5 py-2.5 text-xs font-semibold text-white"
                  >
                    Telusuri Katalog
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Tab 4: Borrowed Books */}
          {activeTab === 'borrowed' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-editorial text-2xl font-semibold text-[#39343A]">
                  Buku yang Sedang Dipinjam
                </h2>
                <span className="font-mono text-xs text-[#6E656F] tabular-nums">
                  {borrowedEntries.length} pinjaman aktif
                </span>
              </div>

              {borrowedEntries.length > 0 ? (
                <div className="space-y-4">
                  {borrowedEntries.map(({ record, book }) => {
                    const daysLeft = getDaysRemaining(record.dueDate);
                    return (
                      <div
                        key={book.id}
                        className="flex flex-col gap-4 rounded-2xl border border-[#39343A]/[0.08] bg-white p-5 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="w-16 shrink-0">
                            <BookCover book={book} size="sm" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs text-[#6E656F]">
                              {book.collectionType} · Dipinjam{' '}
                              <span className="font-mono tabular-nums">
                                {record.borrowedAt}
                              </span>
                            </p>
                            <h3
                              onClick={() => onSelectBook(book)}
                              className="mt-1 cursor-pointer font-editorial text-lg font-semibold text-[#39343A] hover:text-[#96495D] truncate"
                            >
                              {book.title}
                            </h3>
                            <p className="text-sm text-[#6E656F]">{book.author}</p>
                            <p className="mt-1 text-xs font-medium text-[#2C4A30] tabular-nums">
                              Tenggat kembali: {record.dueDate} (
                              {daysLeft > 0 ? `${daysLeft} hari lagi` : 'Hari ini'})
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 shrink-0">
                          {book.digitalAvailable && (
                            <button
                              type="button"
                              onClick={() => onOpenReader(book)}
                              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl bg-[#96495D] px-4 text-xs font-semibold text-white hover:bg-[#7D3A4B]"
                            >
                              <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
                              <span>Baca</span>
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => returnBook(book.id, book.title)}
                            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-[#39343A]/15 bg-white px-4 text-xs font-semibold text-[#39343A] hover:bg-[#FDF2F4]"
                          >
                            <span>Kembalikan</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-2xl border border-[#39343A]/[0.08] bg-white p-10 text-center">
                  <p className="text-sm text-[#6E656F]">
                    Tidak ada koleksi yang sedang Anda pinjam saat ini.
                  </p>
                  <button
                    type="button"
                    onClick={onNavigateCatalog}
                    className="mt-4 rounded-xl bg-[#39343A] px-5 py-2.5 text-xs font-semibold text-white"
                  >
                    Cari Buku untuk Dipinjam
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Tab 5: Recommendations */}
          {activeTab === 'recommendations' && (
            <div className="space-y-4">
              <div>
                <h2 className="font-editorial text-2xl font-semibold text-[#39343A]">
                  Rekomendasi Untuk Anda
                </h2>
                <p className="mt-1 text-sm text-[#6E656F]">
                  Disusun berdasarkan topik minat pilihan Anda ({user.interests.join(', ')})
                  dan pola bacaan terakhir.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {recommendedBooks.map((book) => (
                  <BookCard key={book.id} book={book} onSelect={onSelectBook} />
                ))}
              </div>
            </div>
          )}

          {/* Tab 6: Account Settings */}
          {activeTab === 'settings' && (
            <div className="rounded-2xl border border-[#39343A]/[0.08] bg-white p-6 sm:p-8">
              <h2 className="font-editorial text-2xl font-semibold text-[#39343A]">
                Pengaturan Akun & Minat Baca
              </h2>
              <p className="mt-1 text-sm text-[#6E656F]">
                Perbarui identitas akademik dan topik minat untuk menyesuaikan rekomendasi
                koleksi.
              </p>

              <form onSubmit={handleSaveSettings} className="mt-6 space-y-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="set-name"
                      className="block text-xs font-semibold text-[#39343A]"
                    >
                      Nama Lengkap
                    </label>
                    <input
                      id="set-name"
                      type="text"
                      required
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="mt-1.5 h-11 w-full rounded-xl border border-[#39343A]/15 bg-[#FFF9FA] px-3.5 text-sm text-[#39343A] focus:border-[#96495D] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="set-role"
                      className="block text-xs font-semibold text-[#39343A]"
                    >
                      Status Akademik
                    </label>
                    <select
                      id="set-role"
                      value={editRole}
                      onChange={(e) =>
                        setEditRole(e.target.value as UserProfile['role'])
                      }
                      className="mt-1.5 h-11 w-full rounded-xl border border-[#39343A]/15 bg-[#FFF9FA] px-3 text-sm text-[#39343A] focus:border-[#96495D] focus:outline-none"
                    >
                      <option value="Mahasiswa S1">Mahasiswa S1</option>
                      <option value="Mahasiswa Pascasarjana">
                        Mahasiswa Pascasarjana
                      </option>
                      <option value="Pelajar SMA/SMK">Pelajar SMA/SMK</option>
                      <option value="Peneliti & Dosen">Peneliti & Dosen</option>
                      <option value="Pembaca Umum">Pembaca Umum</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="set-institution"
                    className="block text-xs font-semibold text-[#39343A]"
                  >
                    Institusi / Sekolah
                  </label>
                  <input
                    id="set-institution"
                    type="text"
                    value={editInstitution}
                    onChange={(e) => setEditInstitution(e.target.value)}
                    className="mt-1.5 h-11 w-full rounded-xl border border-[#39343A]/15 bg-[#FFF9FA] px-3.5 text-sm text-[#39343A] focus:border-[#96495D] focus:outline-none"
                  />
                </div>

                <div>
                  <p className="text-xs font-semibold text-[#39343A]">
                    Kategori Minat Baca
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {LIBRARY_CATEGORIES.map((cat) => {
                      const active = editInterests.includes(cat.name);
                      return (
                        <button
                          key={cat.name}
                          type="button"
                          onClick={() => toggleEditInterest(cat.name)}
                          className={`inline-flex min-h-[38px] items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-medium transition-colors ${
                            active
                              ? 'bg-[#39343A] text-[#FFF9FA]'
                              : 'border border-[#39343A]/12 bg-[#FFF9FA] text-[#39343A] hover:bg-[#FDF2F4]'
                          }`}
                        >
                          {active && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
                          <span>{cat.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <label className="flex items-center gap-3 pt-1 text-sm text-[#39343A] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editReminders}
                    onChange={(e) => setEditReminders(e.target.checked)}
                    className="h-4 w-4 rounded border-[#39343A]/30 accent-[#96495D]"
                  />
                  <span>Kirim pengingat tenggat pengembalian buku dan rilis koleksi baru</span>
                </label>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-[#96495D] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#7D3A4B]"
                  >
                    Simpan Pengaturan
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
