import React, { useState, useMemo, useEffect } from 'react';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { BOOKS_CATALOG, LIBRARY_CATEGORIES } from '../data/books';
import {
  Book,
  CategoryName,
  CollectionType,
  LanguageType,
  SortOption,
} from '../types/library';
import { BookCard } from './BookCard';

interface CatalogPageProps {
  initialSearch?: string;
  initialCategory?: CategoryName | 'Semua';
  initialSort?: SortOption;
  onSelectBook: (book: Book) => void;
  onBackHome: () => void;
  onOpenAuth: () => void;
}

type YearRange = 'Semua' | '2025-2026' | '2022-2024' | 'pre-2022';

const PAGE_SIZE = 8;

export const CatalogPage: React.FC<CatalogPageProps> = ({
  initialSearch = '',
  initialCategory = 'Semua',
  initialSort = 'popular',
  onSelectBook,
  onBackHome,
  onOpenAuth,
}) => {
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [category, setCategory] = useState<CategoryName | 'Semua'>(initialCategory);
  const [yearRange, setYearRange] = useState<YearRange>('Semua');
  const [language, setLanguage] = useState<LanguageType | 'Semua'>('Semua');
  const [collectionType, setCollectionType] = useState<CollectionType | 'Semua'>('Semua');
  const [sortBy, setSortBy] = useState<SortOption>(initialSort);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFiltering, setIsFiltering] = useState(false);

  // Sync incoming props when navigated from HomePage
  useEffect(() => {
    setSearchQuery(initialSearch);
  }, [initialSearch]);

  useEffect(() => {
    setCategory(initialCategory);
    setCurrentPage(1);
  }, [initialCategory]);

  useEffect(() => {
    setSortBy(initialSort);
  }, [initialSort]);

  // Brief non-blocking feedback state when filters change
  const triggerFilterFeedback = () => {
    setIsFiltering(true);
    window.setTimeout(() => setIsFiltering(false), 160);
  };

  const filteredAndSortedBooks = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const filtered = BOOKS_CATALOG.filter((book) => {
      if (category !== 'Semua' && book.category !== category) return false;
      if (language !== 'Semua' && book.language !== language) return false;
      if (collectionType !== 'Semua' && book.collectionType !== collectionType) return false;

      if (yearRange === '2025-2026' && book.year < 2025) return false;
      if (yearRange === '2022-2024' && (book.year < 2022 || book.year > 2024)) return false;
      if (yearRange === 'pre-2022' && book.year >= 2022) return false;

      if (q) {
        const matchTitle = book.title.toLowerCase().includes(q);
        const matchSubtitle = book.subtitle?.toLowerCase().includes(q) ?? false;
        const matchAuthor = book.author.toLowerCase().includes(q);
        const matchIsbn = book.isbn.toLowerCase().includes(q);
        const matchCategory = book.category.toLowerCase().includes(q);
        const matchSubject = book.subjects.some((s) => s.toLowerCase().includes(q));
        if (
          !matchTitle &&
          !matchSubtitle &&
          !matchAuthor &&
          !matchIsbn &&
          !matchCategory &&
          !matchSubject
        ) {
          return false;
        }
      }

      return true;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title, 'id');
      if (sortBy === 'newest') return b.year - a.year || b.readsCount - a.readsCount;
      return b.readsCount - a.readsCount;
    });
  }, [searchQuery, category, language, collectionType, yearRange, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredAndSortedBooks.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedBooks = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filteredAndSortedBooks.slice(start, start + PAGE_SIZE);
  }, [filteredAndSortedBooks, safePage]);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    category !== 'Semua' ||
    yearRange !== 'Semua' ||
    language !== 'Semua' ||
    collectionType !== 'Semua';

  const resetAllFilters = () => {
    setSearchQuery('');
    setCategory('Semua');
    setYearRange('Semua');
    setLanguage('Semua');
    setCollectionType('Semua');
    setSortBy('popular');
    setCurrentPage(1);
    triggerFilterFeedback();
  };

  return (
    <section className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 lg:px-8">
      {/* Header & Breadcrumb */}
      <div className="flex flex-col gap-4 border-b border-[#39343A]/[0.08] pb-8">
        <button
          type="button"
          onClick={onBackHome}
          className="inline-flex items-center gap-1.5 self-start text-sm font-medium text-[#6E656F] hover:text-[#39343A] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>Kembali ke Beranda</span>
        </button>

        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#96495D]">
              Penelusuran Koleksi
            </p>
            <h1 className="mt-1 font-editorial text-3xl font-semibold text-[#39343A] sm:text-4xl">
              Katalog Perpustakaan
            </h1>
          </div>
          <p className="font-mono text-xs text-[#6E656F] tabular-nums">
            {filteredAndSortedBooks.length} dari {BOOKS_CATALOG.length} koleksi ditemukan
          </p>
        </div>

        {/* Search & Sort Row */}
        <div className="mt-2 grid grid-cols-1 gap-3 lg:grid-cols-12">
          <div className="relative lg:col-span-8">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#96495D]"
              aria-hidden="true"
            />
            <label htmlFor="catalog-search" className="sr-only">
              Cari judul, pengarang, subjek, atau ISBN
            </label>
            <input
              id="catalog-search"
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Cari judul, pengarang, subjek, atau nomor ISBN..."
              className="h-12 w-full rounded-xl border border-[#39343A]/12 bg-white pl-11 pr-10 text-sm text-[#39343A] placeholder:text-[#6E656F]/75 focus:border-[#96495D] focus:outline-none focus:ring-2 focus:ring-[#F4B6C2]/50"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setCurrentPage(1);
                }}
                aria-label="Hapus pencarian"
                className="absolute right-2.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-[#6E656F] hover:bg-[#FDF2F4] hover:text-[#39343A]"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
          </div>

          <div className="lg:col-span-4">
            <label htmlFor="catalog-sort" className="sr-only">
              Urutkan koleksi
            </label>
            <select
              id="catalog-sort"
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value as SortOption);
                setCurrentPage(1);
                triggerFilterFeedback();
              }}
              className="h-12 w-full rounded-xl border border-[#39343A]/12 bg-white px-4 text-sm font-medium text-[#39343A] focus:border-[#96495D] focus:outline-none focus:ring-2 focus:ring-[#F4B6C2]/50"
            >
              <option value="popular">Urutkan: Popularitas Tertinggi</option>
              <option value="newest">Urutkan: Tahun Terbit Terbaru</option>
              <option value="title">Urutkan: Judul (A – Z)</option>
            </select>
          </div>
        </div>

        {/* Category Filter Tabs (Interactive Filter Controls) */}
        <div className="mt-2 flex flex-wrap items-center gap-2" role="group" aria-label="Filter kategori">
          <button
            type="button"
            onClick={() => {
              setCategory('Semua');
              setCurrentPage(1);
              triggerFilterFeedback();
            }}
            className={`min-h-[40px] rounded-xl px-3.5 py-2 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
              category === 'Semua'
                ? 'bg-[#39343A] text-[#FFF9FA]'
                : 'bg-white border border-[#39343A]/10 text-[#39343A] hover:bg-[#FDF2F4]'
            }`}
          >
            Semua Kategori
          </button>
          {LIBRARY_CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              type="button"
              onClick={() => {
                setCategory(cat.name);
                setCurrentPage(1);
                triggerFilterFeedback();
              }}
              className={`min-h-[40px] rounded-xl px-3.5 py-2 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                category === cat.name
                  ? 'bg-[#96495D] text-white'
                  : 'bg-white border border-[#39343A]/10 text-[#39343A] hover:bg-[#FDF2F4]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Secondary Attribute Filters */}
        <div className="mt-1 flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-medium text-[#6E656F]">
            <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Filter lanjutan:</span>
          </div>

          <select
            aria-label="Filter tahun terbit"
            value={yearRange}
            onChange={(e) => {
              setYearRange(e.target.value as YearRange);
              setCurrentPage(1);
              triggerFilterFeedback();
            }}
            className="h-10 rounded-xl border border-[#39343A]/10 bg-white px-3 text-xs font-medium text-[#39343A] focus:border-[#96495D] focus:outline-none"
          >
            <option value="Semua">Semua Tahun</option>
            <option value="2025-2026">Terbitan 2025 – 2026</option>
            <option value="2022-2024">Terbitan 2022 – 2024</option>
            <option value="pre-2022">Sebelum 2022</option>
          </select>

          <select
            aria-label="Filter bahasa"
            value={language}
            onChange={(e) => {
              setLanguage(e.target.value as LanguageType | 'Semua');
              setCurrentPage(1);
              triggerFilterFeedback();
            }}
            className="h-10 rounded-xl border border-[#39343A]/10 bg-white px-3 text-xs font-medium text-[#39343A] focus:border-[#96495D] focus:outline-none"
          >
            <option value="Semua">Semua Bahasa</option>
            <option value="Bahasa Indonesia">Bahasa Indonesia</option>
            <option value="Bahasa Inggris">Bahasa Inggris</option>
          </select>

          <select
            aria-label="Filter jenis koleksi"
            value={collectionType}
            onChange={(e) => {
              setCollectionType(e.target.value as CollectionType | 'Semua');
              setCurrentPage(1);
              triggerFilterFeedback();
            }}
            className="h-10 rounded-xl border border-[#39343A]/10 bg-white px-3 text-xs font-medium text-[#39343A] focus:border-[#96495D] focus:outline-none"
          >
            <option value="Semua">Semua Jenis Koleksi</option>
            <option value="E-Book">E-Book</option>
            <option value="Modul Kuliah">Modul Kuliah</option>
            <option value="Jurnal Akademik">Jurnal Akademik</option>
            <option value="Buku Cetak">Buku Cetak</option>
          </select>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetAllFilters}
              className="inline-flex h-10 items-center gap-1.5 rounded-xl px-3 text-xs font-semibold text-[#96495D] hover:bg-[#FDF2F4] transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Reset Filter</span>
            </button>
          )}
        </div>
      </div>

      {/* Results Grid / Loading / Empty State */}
      <div className="mt-8">
        {isFiltering ? (
          <div
            aria-busy="true"
            aria-label="Memuat daftar koleksi"
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-[#39343A]/[0.06] bg-white p-4"
              >
                <div className="aspect-[3/4] w-full rounded-xl bg-[#FDF2F4]" />
                <div className="mt-4 h-3 w-24 rounded bg-[#F4B6C2]/30" />
                <div className="mt-2 h-5 w-full rounded bg-[#39343A]/10" />
                <div className="mt-2 h-4 w-2/3 rounded bg-[#39343A]/10" />
              </div>
            ))}
          </div>
        ) : paginatedBooks.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {paginatedBooks.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onSelect={onSelectBook}
                  onRequireAuth={onOpenAuth}
                  showReadsCount={sortBy === 'popular'}
                />
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[#39343A]/[0.08] pt-6 sm:flex-row">
              <p className="text-xs text-[#6E656F] tabular-nums">
                Menampilkan {(safePage - 1) * PAGE_SIZE + 1}–
                {Math.min(safePage * PAGE_SIZE, filteredAndSortedBooks.length)} dari{' '}
                {filteredAndSortedBooks.length} koleksi
              </p>

              <nav
                aria-label="Navigasi halaman katalog"
                className="flex items-center gap-2"
              >
                <button
                  type="button"
                  disabled={safePage <= 1}
                  onClick={() => {
                    setCurrentPage((p) => Math.max(1, p - 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="inline-flex h-10 items-center gap-1 rounded-xl border border-[#39343A]/12 bg-white px-3 text-xs font-medium text-[#39343A] transition-colors hover:bg-[#FDF2F4] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                  <span>Sebelumnya</span>
                </button>

                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pageNum = idx + 1;
                  const active = pageNum === safePage;
                  return (
                    <button
                      key={pageNum}
                      type="button"
                      aria-current={active ? 'page' : undefined}
                      onClick={() => {
                        setCurrentPage(pageNum);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`flex h-10 w-10 items-center justify-center rounded-xl text-xs font-semibold tabular-nums transition-colors ${
                        active
                          ? 'bg-[#96495D] text-white'
                          : 'border border-[#39343A]/12 bg-white text-[#39343A] hover:bg-[#FDF2F4]'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  type="button"
                  disabled={safePage >= totalPages}
                  onClick={() => {
                    setCurrentPage((p) => Math.min(totalPages, p + 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="inline-flex h-10 items-center gap-1 rounded-xl border border-[#39343A]/12 bg-white px-3 text-xs font-medium text-[#39343A] transition-colors hover:bg-[#FDF2F4] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <span>Berikutnya</span>
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </>
        ) : (
          /* Informative Empty State */
          <div className="rounded-3xl border border-[#39343A]/[0.08] bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FDF2F4] text-[#96495D]">
              <Search className="h-6 w-6" aria-hidden="true" />
            </div>
            <h2 className="mt-4 font-editorial text-2xl font-semibold text-[#39343A]">
              Koleksi Tidak Ditemukan
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[#6E656F]">
              Tidak ada buku atau jurnal yang cocok dengan kata kunci
              {searchQuery ? ` "${searchQuery}"` : ''} dan kombinasi filter yang Anda pilih.
              Coba periksa ejaan judul, gunakan kata kunci subjek yang lebih umum, atau atur
              ulang filter.
            </p>
            <button
              type="button"
              onClick={resetAllFilters}
              className="mt-6 inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#39343A] px-5 py-2.5 text-sm font-medium text-[#FFF9FA] hover:bg-[#96495D] transition-colors"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              <span>Tampilkan Semua Koleksi</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
