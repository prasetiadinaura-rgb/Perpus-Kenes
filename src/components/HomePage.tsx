import React, { useState, useMemo } from 'react';
import { ArrowRight, BookOpen, Search, X } from 'lucide-react';
import { BOOKS_CATALOG, LIBRARY_CATEGORIES } from '../data/books';
import { Book, CategoryName } from '../types/library';
import { BookCard } from './BookCard';

interface HomePageProps {
  onSearchSubmit: (query: string) => void;
  onSelectCategory: (category: CategoryName) => void;
  onSelectBook: (book: Book) => void;
  onNavigateCatalog: () => void;
  onOpenAuth: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onSearchSubmit,
  onSelectCategory,
  onSelectBook,
  onNavigateCatalog,
  onOpenAuth,
}) => {
  const [heroQuery, setHeroQuery] = useState('');
  const [heroImgError, setHeroImgError] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const featuredBooks = useMemo(
    () => BOOKS_CATALOG.filter((b) => b.featured).slice(0, 4),
    []
  );

  const popularBooks = useMemo(
    () => [...BOOKS_CATALOG].sort((a, b) => b.readsCount - a.readsCount).slice(0, 4),
    []
  );

  const recentBooks = useMemo(
    () => BOOKS_CATALOG.filter((b) => b.recentlyAdded).slice(0, 4),
    []
  );

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    BOOKS_CATALOG.forEach((b) => {
      counts[b.category] = (counts[b.category] || 0) + 1;
    });
    return counts;
  }, []);

  const quickSuggestions = useMemo(() => {
    const q = heroQuery.trim().toLowerCase();
    if (!q) return [];
    return BOOKS_CATALOG.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.isbn.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q) ||
        b.subjects.some((s) => s.toLowerCase().includes(q))
    ).slice(0, 5);
  }, [heroQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit(heroQuery.trim());
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="mx-auto max-w-[1200px] px-4 pt-10 pb-12 sm:px-6 lg:px-8 lg:pt-14">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-stretch">
          {/* Left Hero Copy & Search */}
          <div className="flex flex-col justify-center lg:col-span-7 lg:pr-6">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#96495D]">
              Perpustakaan Digital Terkurasi
            </p>
            <h1 className="mt-3 font-editorial text-4xl font-semibold leading-[1.12] tracking-tight text-[#39343A] text-balance sm:text-5xl lg:text-[3.35rem]">
              Temukan Pengetahuan, Mulai dari Sini.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-[#6E656F] sm:text-lg">
              Akses buku akademik, sastra pilihan, modul kuliah, dan jurnal penelitian dalam
              ruang baca digital yang tenang, rapi, dan nyaman untuk mahasiswa serta pelajar.
            </p>

            {/* Large Search Bar */}
            <div className="relative mt-8">
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-2.5 rounded-2xl border border-[#39343A]/12 bg-white p-2 shadow-[0_8px_24px_rgba(57,52,58,0.05)] sm:flex-row sm:items-center"
              >
                <div className="relative flex flex-1 items-center">
                  <Search
                    className="ml-3 h-5 w-5 shrink-0 text-[#96495D]"
                    aria-hidden="true"
                  />
                  <label htmlFor="hero-search" className="sr-only">
                    Cari judul buku, penulis, subjek, atau ISBN
                  </label>
                  <input
                    id="hero-search"
                    type="text"
                    value={heroQuery}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => {
                      window.setTimeout(() => setSearchFocused(false), 180);
                    }}
                    onChange={(e) => setHeroQuery(e.target.value)}
                    placeholder="Cari judul buku, penulis, subjek, atau ISBN..."
                    className="w-full bg-transparent px-3 py-3 text-sm text-[#39343A] placeholder:text-[#6E656F]/75 focus:outline-none sm:text-base"
                  />
                  {heroQuery && (
                    <button
                      type="button"
                      onClick={() => setHeroQuery('')}
                      aria-label="Hapus kata kunci pencarian"
                      className="mr-1 flex h-8 w-8 items-center justify-center rounded-lg text-[#6E656F] hover:bg-[#FDF2F4] hover:text-[#39343A]"
                    >
                      <X className="h-4 w-4" aria-hidden="true" />
                    </button>
                  )}
                </div>
                <button
                  type="submit"
                  className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl bg-[#96495D] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#7D3A4B] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#96495D] focus-visible:ring-offset-2"
                >
                  <span>Cari Koleksi</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </form>

              {/* Live Instant Search Suggestions */}
              {searchFocused && heroQuery.trim().length > 0 && (
                <div
                  role="region"
                  aria-label="Saran pencarian cepat"
                  className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border border-[#39343A]/10 bg-white shadow-[0_16px_36px_rgba(57,52,58,0.12)]"
                >
                  {quickSuggestions.length > 0 ? (
                    <ul className="divide-y divide-[#39343A]/[0.06]">
                      {quickSuggestions.map((item) => (
                        <li key={item.id}>
                          <button
                            type="button"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              onSelectBook(item);
                            }}
                            className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left transition-colors hover:bg-[#FDF2F4]"
                          >
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-[#39343A]">
                                {item.title}
                              </p>
                              <p className="truncate text-xs text-[#6E656F]">
                                {item.author} · {item.category} ·{' '}
                                <span className="font-mono">{item.isbn}</span>
                              </p>
                            </div>
                            <span className="text-xs font-medium text-[#96495D] shrink-0">
                              Lihat Detail
                            </span>
                          </button>
                        </li>
                      ))}
                      <li>
                        <button
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            onSearchSubmit(heroQuery.trim());
                          }}
                          className="flex w-full items-center justify-center gap-1.5 bg-[#FFF9FA] px-4 py-2.5 text-xs font-semibold text-[#96495D] hover:bg-[#FDF2F4]"
                        >
                          <span>Lihat semua hasil untuk &ldquo;{heroQuery.trim()}&rdquo;</span>
                          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                      </li>
                    </ul>
                  ) : (
                    <div className="px-4 py-4 text-sm text-[#6E656F]">
                      Tidak ada judul yang cocok langsung. Tekan{' '}
                      <strong className="text-[#39343A]">Cari Koleksi</strong> untuk menelusuri
                      katalog.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Subtle quick keyword triggers */}
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[#6E656F]">
              <span>Pencarian populer:</span>
              {['Metodologi Riset', 'Psikologi', 'Kecerdasan Buatan', 'Sejarah Nusantara'].map(
                (term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => onSearchSubmit(term)}
                    className="font-medium text-[#39343A] underline decoration-[#D98FA1] underline-offset-4 hover:text-[#96495D] transition-colors"
                  >
                    {term}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Right Hero Editorial Visual */}
          <div className="lg:col-span-5">
            <div className="relative h-72 w-full overflow-hidden rounded-2xl border border-[#39343A]/[0.08] bg-[#FDF2F4] sm:h-96 lg:h-full lg:min-h-[400px]">
              {!heroImgError ? (
                <img
                  src="/src/assets/images/hero_library_sanctuary_1795660180005.jpg"
                  alt="Mahasiswa membaca buku di meja belajar perpustakaan modern bernuansa hangat dan tenang"
                  referrerPolicy="no-referrer"
                  onError={() => setHeroImgError(true)}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#F4B6C2]/30 via-[#FFF9FA] to-[#DCD6F7]/40 p-8 text-center">
                  <BookOpen className="h-12 w-12 text-[#96495D]" aria-hidden="true" />
                  <p className="mt-3 font-editorial text-xl font-medium text-[#39343A]">
                    Ruang Baca Digital Pustaka Nirmala
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Operational & Library Summary Strip */}
        <div className="mt-10 grid grid-cols-2 gap-6 border-y border-[#39343A]/[0.08] py-6 sm:grid-cols-4">
          <div>
            <p className="font-editorial text-2xl font-semibold text-[#39343A] tabular-nums">
              {BOOKS_CATALOG.length} Judul
            </p>
            <p className="mt-1 text-xs text-[#6E656F]">Koleksi Pilihan Terverifikasi</p>
          </div>
          <div>
            <p className="font-editorial text-2xl font-semibold text-[#39343A] tabular-nums">
              7 Bidang
            </p>
            <p className="mt-1 text-xs text-[#6E656F]">Cakupan Disiplin Ilmu</p>
          </div>
          <div>
            <p className="font-editorial text-2xl font-semibold text-[#39343A] tabular-nums">
              24 / 7
            </p>
            <p className="mt-1 text-xs text-[#6E656F]">Akses E-Book & Jurnal Daring</p>
          </div>
          <div>
            <p className="font-editorial text-2xl font-semibold text-[#39343A] tabular-nums">
              14 Hari
            </p>
            <p className="mt-1 text-xs text-[#6E656F]">Durasi Peminjaman Standar</p>
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#96495D]">
              Pilihan Kurator
            </p>
            <h2 className="mt-1 font-editorial text-3xl font-semibold text-[#39343A]">
              Koleksi Pilihan
            </h2>
          </div>
          <button
            type="button"
            onClick={onNavigateCatalog}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#96495D] hover:text-[#7D3A4B] transition-colors self-start sm:self-auto"
          >
            <span>Jelajahi semua koleksi</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-7 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onSelect={onSelectBook}
              onRequireAuth={onOpenAuth}
            />
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section
        id="kategori"
        className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 lg:px-8 scroll-mt-20"
      >
        <div className="border-t border-[#39343A]/[0.08] pt-12">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#96495D]">
            Klasifikasi Subjek
          </p>
          <h2 className="mt-1 font-editorial text-3xl font-semibold text-[#39343A]">
            Jelajahi Berdasarkan Kategori
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-[#6E656F]">
            Pilih bidang ilmu yang sedang Anda pelajari untuk langsung menyaring katalog.
          </p>

          <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {LIBRARY_CATEGORIES.map((cat) => (
              <button
                key={cat.name}
                type="button"
                onClick={() => onSelectCategory(cat.name)}
                className="group flex flex-col justify-between rounded-2xl border border-[#39343A]/[0.08] bg-white p-5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-[#D98FA1] hover:shadow-[0_10px_24px_rgba(57,52,58,0.06)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#96495D]"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`inline-block h-3 w-8 rounded-full ${cat.accentBg}`}
                      aria-hidden="true"
                    />
                    <span className="font-mono text-xs text-[#6E656F] tabular-nums">
                      {categoryCounts[cat.name] || 0} judul
                    </span>
                  </div>
                  <h3 className="mt-4 font-editorial text-xl font-semibold text-[#39343A] group-hover:text-[#96495D] transition-colors">
                    {cat.name}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-[#6E656F]">
                    {cat.description}
                  </p>
                </div>
                <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-[#39343A] group-hover:text-[#96495D]">
                  <span>Buka rak kategori</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Books Section */}
      <section
        id="koleksi-populer"
        className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 lg:px-8 scroll-mt-20"
      >
        <div className="border-t border-[#39343A]/[0.08] pt-12">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#96495D]">
                Minat Pembaca
              </p>
              <h2 className="mt-1 font-editorial text-3xl font-semibold text-[#39343A]">
                Koleksi Populer
              </h2>
            </div>
            <button
              type="button"
              onClick={onNavigateCatalog}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#96495D] hover:text-[#7D3A4B] transition-colors self-start sm:self-auto"
            >
              <span>Urutkan berdasarkan popularitas</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-7 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {popularBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onSelect={onSelectBook}
                onRequireAuth={onOpenAuth}
                showReadsCount
              />
            ))}
          </div>
        </div>
      </section>

      {/* Recently Added Section */}
      <section className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="border-t border-[#39343A]/[0.08] pt-12">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#96495D]">
                Pembaruan Katalog
              </p>
              <h2 className="mt-1 font-editorial text-3xl font-semibold text-[#39343A]">
                Koleksi Terbaru
              </h2>
            </div>
            <button
              type="button"
              onClick={onNavigateCatalog}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#96495D] hover:text-[#7D3A4B] transition-colors self-start sm:self-auto"
            >
              <span>Lihat seluruh koleksi terbaru</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-7 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {recentBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onSelect={onSelectBook}
                onRequireAuth={onOpenAuth}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Tentang Kami Section */}
      <section
        id="tentang-kami"
        className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 lg:px-8 scroll-mt-20"
      >
        <div className="rounded-3xl border border-[#39343A]/[0.08] bg-[#FDF2F4] p-8 sm:p-12">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#96495D]">
                Tentang Pustaka Nirmala
              </p>
              <h2 className="mt-2 font-editorial text-3xl font-semibold text-[#39343A] text-balance">
                Membawa Ketenangan Ruang Baca ke Layar Anda
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-[#6E656F] sm:text-base">
                Pustaka Nirmala hadir sebagai perpustakaan digital modern yang memadukan
                kualitas kurasi akademik dengan antarmuka yang lembut dan bebas gangguan.
                Mahasiswa dan pelajar dapat menelusuri literatur berdasarkan ISBN maupun
                subjek, membaca bab digital secara langsung, menyimpan daftar favorit,
                serta memantau tenggat pinjaman dalam satu ruang kerja terpadu.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-5">
              <div className="rounded-2xl bg-white p-5 border border-[#39343A]/[0.06]">
                <h3 className="font-editorial text-lg font-semibold text-[#39343A]">
                  Baca Tanpa Distraksi
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-[#6E656F]">
                  Mode pembaca digital dilengkapi pengatur ukuran huruf dan penanda progres
                  otomatis.
                </p>
              </div>
              <div className="rounded-2xl bg-white p-5 border border-[#39343A]/[0.06]">
                <h3 className="font-editorial text-lg font-semibold text-[#39343A]">
                  Rekomendasi Personal
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-[#6E656F]">
                  Sistem menyesuaikan saran literatur berdasarkan jurusan dan topik minat
                  pilihan Anda.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
