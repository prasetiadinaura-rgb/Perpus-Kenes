import React from 'react';
import { BookOpen, Clock, Heart, Library } from 'lucide-react';
import { Book } from '../types/library';
import { BookCover } from './BookCover';
import { useLibrary } from '../context/LibraryContext';

interface BookCardProps {
  book: Book;
  onSelect: (book: Book) => void;
  onRequireAuth?: () => void;
  showReadsCount?: boolean;
}

export const BookCard: React.FC<BookCardProps> = ({
  book,
  onSelect,
  onRequireAuth,
  showReadsCount = false,
}) => {
  const { user, isFavorite, toggleFavorite } = useLibrary();
  const favorited = isFavorite(book.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user && onRequireAuth) {
      toggleFavorite(book.id, book.title);
      onRequireAuth();
      return;
    }
    toggleFavorite(book.id, book.title);
  };

  const renderAvailability = () => {
    if (book.availability === 'Tersedia Digital') {
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#2C4A30]">
          <BookOpen className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span>Tersedia Digital</span>
        </span>
      );
    }
    if (book.availability === 'Tersedia di Rak') {
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#39343A]">
          <Library className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span>Tersedia di Rak</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#96495D]">
        <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        <span>Dipinjam Terbatas</span>
      </span>
    );
  };

  return (
    <article
      onClick={() => onSelect(book)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(book);
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`Buka detail buku ${book.title} oleh ${book.author}`}
      className="group relative flex flex-col rounded-2xl bg-white p-4 border border-[#39343A]/[0.08] shadow-[0_2px_10px_rgba(57,52,58,0.03)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(57,52,58,0.07)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#96495D] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFF9FA] cursor-pointer"
    >
      <div className="relative">
        <BookCover book={book} />
        <button
          type="button"
          onClick={handleFavoriteClick}
          aria-label={
            favorited
              ? `Hapus ${book.title} dari favorit`
              : `Simpan ${book.title} ke favorit`
          }
          aria-pressed={favorited}
          className={`absolute top-2.5 right-2.5 flex h-10 w-10 items-center justify-center rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#96495D] ${
            favorited
              ? 'bg-[#96495D] border-[#96495D] text-white'
              : 'bg-white/92 border-[#39343A]/10 text-[#39343A] hover:bg-[#FDF2F4] hover:text-[#96495D]'
          }`}
        >
          <Heart
            className="h-4 w-4"
            fill={favorited ? 'currentColor' : 'none'}
            aria-hidden="true"
          />
        </button>
      </div>

      <div className="mt-4 flex flex-1 flex-col">
        <div className="flex items-center gap-1.5 text-xs text-[#6E656F] truncate">
          <span className="truncate">{book.category}</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono tabular-nums shrink-0">{book.year}</span>
          <span aria-hidden="true">·</span>
          <span className="truncate">{book.collectionType}</span>
        </div>

        <h3 className="mt-1.5 font-editorial text-lg font-semibold leading-snug text-[#39343A] group-hover:text-[#96495D] transition-colors line-clamp-2">
          {book.title}
        </h3>

        <p className="mt-1 text-sm text-[#6E656F] truncate">{book.author}</p>

        <div className="mt-auto pt-3.5 border-t border-[#39343A]/[0.06] flex items-center justify-between gap-2">
          {renderAvailability()}
          {showReadsCount && (
            <span className="font-mono text-xs text-[#6E656F] tabular-nums shrink-0">
              {book.readsCount.toLocaleString('id-ID')} dibaca
            </span>
          )}
        </div>
      </div>
    </article>
  );
};
