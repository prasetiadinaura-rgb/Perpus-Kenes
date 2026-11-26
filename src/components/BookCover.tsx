import React, { useState } from 'react';
import { Book, CoverTheme } from '../types/library';

interface BookCoverProps {
  book: Book;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const THEME_STYLES: Record<
  CoverTheme,
  { bg: string; accent: string; line: string; text: string; muted: string }
> = {
  blush: {
    bg: '#FCEEEF',
    accent: '#D98FA1',
    line: '#F4B6C2',
    text: '#39343A',
    muted: '#6E5A60',
  },
  lavender: {
    bg: '#F2EFFB',
    accent: '#8E83BD',
    line: '#DCD6F7',
    text: '#39343A',
    muted: '#5D5670',
  },
  sage: {
    bg: '#EFF5EF',
    accent: '#597D5E',
    line: '#DCE8DC',
    text: '#39343A',
    muted: '#4D5F50',
  },
  dusty: {
    bg: '#F7E7EB',
    accent: '#96495D',
    line: '#D98FA1',
    text: '#39343A',
    muted: '#6B4952',
  },
  alabaster: {
    bg: '#FAF5F0',
    accent: '#96495D',
    line: '#E6DADF',
    text: '#39343A',
    muted: '#6E656F',
  },
};

const MotifArtwork: React.FC<{
  motif: Book['coverMotif'];
  accent: string;
  line: string;
}> = ({ motif, accent, line }) => {
  switch (motif) {
    case 'botanical':
      return (
        <svg viewBox="0 0 160 120" className="w-full h-24 opacity-85" aria-hidden="true">
          <path
            d="M80 108 C80 72, 78 44, 80 16"
            stroke="#39343A"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M80 84 C60 76, 48 60, 52 46 C66 50, 76 66, 80 84 Z"
            fill={line}
            stroke="#39343A"
            strokeWidth="1.1"
          />
          <path
            d="M80 62 C102 52, 114 36, 108 22 C94 28, 84 44, 80 62 Z"
            fill={accent}
            fillOpacity="0.45"
            stroke="#39343A"
            strokeWidth="1.1"
          />
          <circle cx="80" cy="18" r="5" fill={accent} />
        </svg>
      );
    case 'geometric':
      return (
        <svg viewBox="0 0 160 120" className="w-full h-24 opacity-90" aria-hidden="true">
          <rect
            x="28"
            y="18"
            width="52"
            height="84"
            fill="none"
            stroke="#39343A"
            strokeWidth="1.2"
          />
          <circle cx="96" cy="52" r="28" fill={line} />
          <path
            d="M64 102 A32 32 0 0 1 128 102 Z"
            fill={accent}
            fillOpacity="0.55"
          />
          <line x1="20" y1="70" x2="140" y2="70" stroke="#39343A" strokeWidth="1" />
        </svg>
      );
    case 'orbital':
      return (
        <svg viewBox="0 0 160 120" className="w-full h-24 opacity-90" aria-hidden="true">
          <circle cx="66" cy="58" r="30" fill={line} fillOpacity="0.85" />
          <circle cx="96" cy="64" r="26" fill={accent} fillOpacity="0.4" />
          <ellipse
            cx="80"
            cy="60"
            rx="54"
            ry="18"
            transform="rotate(-16 80 60)"
            fill="none"
            stroke="#39343A"
            strokeWidth="1.1"
          />
        </svg>
      );
    case 'waves':
      return (
        <svg viewBox="0 0 160 120" className="w-full h-24 opacity-90" aria-hidden="true">
          <path
            d="M16 42 Q 48 18, 80 42 T 144 42"
            fill="none"
            stroke="#39343A"
            strokeWidth="1.3"
          />
          <path
            d="M16 62 Q 48 38, 80 62 T 144 62"
            fill="none"
            stroke={accent}
            strokeWidth="3"
          />
          <path
            d="M16 82 Q 48 58, 80 82 T 144 82"
            fill="none"
            stroke={line}
            strokeWidth="5"
          />
        </svg>
      );
    case 'archival':
    default:
      return (
        <svg viewBox="0 0 160 120" className="w-full h-24 opacity-90" aria-hidden="true">
          <rect
            x="24"
            y="14"
            width="112"
            height="92"
            fill="none"
            stroke="#39343A"
            strokeWidth="1.1"
          />
          <rect x="34" y="24" width="92" height="72" fill={line} fillOpacity="0.55" />
          <path d="M80 24 L112 60 L80 96 L48 60 Z" fill={accent} fillOpacity="0.45" />
          <circle cx="80" cy="60" r="8" fill="#39343A" />
        </svg>
      );
  }
};

export const BookCover: React.FC<BookCoverProps> = ({
  book,
  size = 'md',
  className = '',
}) => {
  const [imgError, setImgError] = useState(false);
  const theme = THEME_STYLES[book.coverTheme];

  if (book.coverImage && !imgError) {
    return (
      <div
        className={`relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-[#F5ECEE] ${className}`}
      >
        <img
          src={book.coverImage}
          alt={`Sampul buku ${book.title} oleh ${book.author}`}
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
        />
      </div>
    );
  }

  const titleSizeClass =
    size === 'lg'
      ? 'text-xl leading-snug'
      : size === 'sm'
      ? 'text-xs leading-snug'
      : 'text-base leading-snug';

  return (
    <div
      style={{ backgroundColor: theme.bg }}
      className={`relative aspect-[3/4] w-full overflow-hidden rounded-xl border border-[#39343A]/10 flex flex-col justify-between p-4 sm:p-5 select-none ${className}`}
    >
      {/* Subtle spine crease */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-[#39343A]/10 to-transparent"
        aria-hidden="true"
      />

      <div className="relative z-10 pl-1">
        <p
          style={{ color: theme.muted }}
          className="text-[10px] font-medium uppercase tracking-[0.16em] truncate"
        >
          {book.category}
        </p>
        <h4
          style={{ color: theme.text }}
          className={`mt-1.5 font-editorial font-semibold line-clamp-3 ${titleSizeClass}`}
        >
          {book.title}
        </h4>
      </div>

      <div className="relative z-10 my-auto py-2 pl-1">
        <MotifArtwork motif={book.coverMotif} accent={theme.accent} line={theme.line} />
      </div>

      <div
        style={{ borderColor: `${theme.accent}40` }}
        className="relative z-10 border-t pt-2.5 pl-1 flex items-center justify-between gap-2"
      >
        <span
          style={{ color: theme.text }}
          className="text-[11px] font-medium truncate"
        >
          {book.author}
        </span>
        <span
          style={{ color: theme.muted }}
          className="font-mono text-[10px] tabular-nums shrink-0"
        >
          {book.year}
        </span>
      </div>
    </div>
  );
};
