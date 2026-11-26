import React, { useMemo } from 'react';
import {
  ArrowLeft,
  BookCheck,
  BookOpen,
  CalendarPlus,
  Clock,
  Heart,
  Library,
} from 'lucide-react';
import { BOOKS_CATALOG } from '../data/books';
import { Book } from '../types/library';
import { useLibrary } from '../context/LibraryContext';
import { BookCover } from './BookCover';
import { BookCard } from './BookCard';

interface BookDetailPageProps {
  book: Book;
  onBack: () => void;
  onSelectBook: (book: Book) => void;
  onOpenReader: (book: Book) => void;
  onOpenAuth: () => void;
  onFilterBySubject: (subject: string) => void;
}

export const BookDetailPage: React.FC<BookDetailPageProps> = ({
  book,
  onBack,
  onSelectBook,
  onOpenReader,
  onOpenAuth,
  onFilterBySubject,
}) => {
  const { user, isFavorite, toggleFavorite, isBorrowed, borrowBook, returnBook } =
    useLibrary();

  const favorited = isFavorite(book.id);
  const borrowed = isBorrowed(book.id);

  const relatedBooks = useMemo(
    () =>
      BOOKS_CATALOG.filter(
        (b) => b.category === book.category && b.id !== book.id
      ).slice(0, 4),
    [book]
  );

  const handleFavorite = () => {
    if (!user) {
      toggleFavorite(book.id, book.title);
      onOpenAuth();
      return;
    }
    toggleFavorite(book.id, book.title);
  };

  const handleBorrowToggle = () => {
    if (!user) {
      borrowBook(book.id, book.title);
      onOpenAuth();
      return;
    }
    if (borrowed) {
      returnBook(book.id, book.title);
    } else {
      borrowBook(book.id, book.title);
    }
  };

  const renderAvailabilityStatus = () => {
    if (book.availability === 'Tersedia Digital') {
      return (
        <span className="inline-flex items-center gap-1.5 font-medium text-[#2C4A30]">
          <BookOpen className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>Tersedia Digital · {book.availableCopies} lisensi aktif</span>
        </span>
      );
    }
    if (book.availability === 'Tersedia di Rak') {
      return (
        <span className="inline-flex items-center gap-1.5 font-medium text-[#39343A]">
          <Library className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>
            Tersedia di Rak · {book.availableCopies} dari {book.totalCopies} eksemplar
          </span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 font-medium text-[#96495D]">
        <Clock className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span>
          Dipinjam Terbatas · {book.availableCopies} dari {book.totalCopies} eksemplar
        </span>
      </span>
    );
  };

  return (
    <section className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-[#6E656F] hover:text-[#39343A] transition-colors"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        <span>Kembali ke Katalog</span>
      </button>

      {/* Main Two-Column Detail */}
      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start">
        {/* Left: Large Book Cover */}
        <div className="lg:col-span-4">
          <div className="mx-auto max-w-xs lg:max-w-none rounded-2xl border border-[#39343A]/[0.08] bg-white p-4 shadow-[0_8px_28px_rgba(57,52,58,0.05)]">
            <BookCover book={book} size="lg" />
          </div>
        </div>

        {/* Right: Metadata, Actions & Synopsis */}
        <div className="lg:col-span-8">
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#96495D]">
            <span>{book.category}</span>
            <span aria-hidden="true">·</span>
            <span>{book.collectionType}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums text-[#6E656F]">
              {book.readsCount.toLocaleString('id-ID')} kali dibaca
            </span>
          </div>

          <h1 className="mt-2 font-editorial text-3xl font-semibold leading-tight text-[#39343A] text-balance sm:text-4xl">
            {book.title}
          </h1>
          {book.subtitle && (
            <p className="mt-2 text-lg text-[#6E656F]">{book.subtitle}</p>
          )}
          <p className="mt-3 text-base font-medium text-[#39343A]">
            Oleh {book.author}
          </p>

          {/* Primary Action Buttons */}
          <div className="mt-7 flex flex-wrap items-center gap-3">
            {book.digitalAvailable && (
              <button
                type="button"
                onClick={() => onOpenReader(book)}
                className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl bg-[#96495D] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#7D3A4B] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#96495D] focus-visible:ring-offset-2"
              >
                <BookOpen className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>Baca Sekarang</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleBorrowToggle}
              className={`inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#96495D] focus-visible:ring-offset-2 ${
                borrowed
                  ? 'bg-[#DCE8DC] text-[#2C4A30] hover:bg-[#CBDCCB]'
                  : 'bg-[#39343A] text-[#FFF9FA] hover:bg-[#4F4850]'
              }`}
            >
              {borrowed ? (
                <>
                  <BookCheck className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>Sedang Dipinjam (Kembalikan)</span>
                </>
              ) : (
                <>
                  <CalendarPlus className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>Pinjam Koleksi (14 Hari)</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleFavorite}
              aria-pressed={favorited}
              className={`inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#96495D] ${
                favorited
                  ? 'border-[#96495D] bg-[#FDF2F4] text-[#96495D]'
                  : 'border-[#39343A]/15 bg-white text-[#39343A] hover:bg-[#FDF2F4]'
              }`}
            >
              <Heart
                className="h-4 w-4 shrink-0"
                fill={favorited ? 'currentColor' : 'none'}
                aria-hidden="true"
              />
              <span>{favorited ? 'Tersimpan di Favorit' : 'Simpan ke Favorit'}</span>
            </button>
          </div>

          {!book.digitalAvailable && (
            <p className="mt-3 text-xs text-[#6E656F]">
              Koleksi ini hanya tersedia dalam format fisik di rak perpustakaan. Gunakan
              tombol Pinjam Koleksi untuk memesan pengambilan.
            </p>
          )}

          {/* Synopsis */}
          <div className="mt-9 border-t border-[#39343A]/[0.08] pt-7">
            <h2 className="font-editorial text-xl font-semibold text-[#39343A]">
              Sinopsis & Ringkasan
            </h2>
            <p className="mt-3 max-w-prose text-base leading-relaxed text-[#39343A]/90">
              {book.synopsis}
            </p>
          </div>

          {/* Structured Bibliographic Metadata Grid */}
          <div className="mt-8 border-t border-[#39343A]/[0.08] pt-7">
            <h2 className="font-editorial text-xl font-semibold text-[#39343A]">
              Informasi Bibliografi
            </h2>
            <dl className="mt-4 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
              <div className="border-b border-[#39343A]/[0.06] pb-3">
                <dt className="text-xs font-medium text-[#6E656F]">Penerbit</dt>
                <dd className="mt-1 text-sm font-medium text-[#39343A]">{book.publisher}</dd>
              </div>
              <div className="border-b border-[#39343A]/[0.06] pb-3">
                <dt className="text-xs font-medium text-[#6E656F]">Tahun Terbit</dt>
                <dd className="mt-1 font-mono text-sm font-medium text-[#39343A] tabular-nums">
                  {book.year}
                </dd>
              </div>
              <div className="border-b border-[#39343A]/[0.06] pb-3">
                <dt className="text-xs font-medium text-[#6E656F]">Nomor ISBN</dt>
                <dd className="mt-1 font-mono text-sm font-medium text-[#39343A] tabular-nums">
                  {book.isbn}
                </dd>
              </div>
              <div className="border-b border-[#39343A]/[0.06] pb-3">
                <dt className="text-xs font-medium text-[#6E656F]">Bahasa & Tebal</dt>
                <dd className="mt-1 text-sm font-medium text-[#39343A] tabular-nums">
                  {book.language} · {book.pages} halaman
                </dd>
              </div>
              <div className="border-b border-[#39343A]/[0.06] pb-3">
                <dt className="text-xs font-medium text-[#6E656F]">Jenis Koleksi</dt>
                <dd className="mt-1 text-sm font-medium text-[#39343A]">
                  {book.collectionType}
                </dd>
              </div>
              <div className="border-b border-[#39343A]/[0.06] pb-3">
                <dt className="text-xs font-medium text-[#6E656F]">Status Ketersediaan</dt>
                <dd className="mt-1 text-sm">{renderAvailabilityStatus()}</dd>
              </div>
            </dl>

            {/* Subjects / Keywords */}
            <div className="mt-5">
              <p className="text-xs font-medium text-[#6E656F]">Subjek & Kata Kunci</p>
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm">
                {book.subjects.map((subj, idx) => (
                  <React.Fragment key={subj}>
                    <button
                      type="button"
                      onClick={() => onFilterBySubject(subj)}
                      className="font-medium text-[#39343A] underline decoration-[#D98FA1] underline-offset-4 hover:text-[#96495D] transition-colors"
                    >
                      {subj}
                    </button>
                    {idx < book.subjects.length - 1 && (
                      <span className="text-[#6E656F]" aria-hidden="true">
                        ·
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Books */}
      {relatedBooks.length > 0 && (
        <div className="mt-16 border-t border-[#39343A]/[0.08] pt-12">
          <h2 className="font-editorial text-2xl font-semibold text-[#39343A]">
            Koleksi Serupa di Kategori {book.category}
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {relatedBooks.map((rel) => (
              <BookCard
                key={rel.id}
                book={rel}
                onSelect={onSelectBook}
                onRequireAuth={onOpenAuth}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
