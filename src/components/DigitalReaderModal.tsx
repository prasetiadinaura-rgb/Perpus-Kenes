import React, { useState, useEffect } from 'react';
import { BookOpen, Check, ChevronLeft, ChevronRight, Minus, Plus, X } from 'lucide-react';
import { Book } from '../types/library';
import { useLibrary } from '../context/LibraryContext';

interface DigitalReaderModalProps {
  book: Book | null;
  onClose: () => void;
}

export const DigitalReaderModal: React.FC<DigitalReaderModalProps> = ({
  book,
  onClose,
}) => {
  const { user, recordReading, showToast } = useLibrary();
  const [chapterIdx, setChapterIdx] = useState(0);
  const [fontSize, setFontSize] = useState<number>(17);

  useEffect(() => {
    if (!book) return;
    setChapterIdx(0);
    const total = Math.max(1, book.sampleChapters.length);
    const initialProgress = Math.round((1 / total) * 50);
    if (user) {
      recordReading(book.id, 0, initialProgress);
    }
  }, [book, user, recordReading]);

  useEffect(() => {
    if (!book) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [book, onClose]);

  if (!book) return null;

  const chapters =
    book.sampleChapters.length > 0
      ? book.sampleChapters
      : [
          {
            title: 'Pratinjau Naskah',
            content: [
              book.synopsis,
              'Naskah lengkap tersedia untuk anggota perpustakaan melalui pembaca daring Pustaka Nirmala.',
            ],
          },
        ];

  const activeChapter = chapters[Math.min(chapterIdx, chapters.length - 1)];
  const progressPct = Math.round(((chapterIdx + 1) / chapters.length) * 100);

  const handleSelectChapter = (idx: number) => {
    setChapterIdx(idx);
    if (user) {
      const pct = Math.round(((idx + 1) / chapters.length) * 100);
      recordReading(book.id, idx, pct);
    }
  };

  const handleFinishChapter = () => {
    if (user) {
      recordReading(book.id, chapterIdx, 100);
      showToast(`Progres membaca "${book.title}" disimpan ke riwayat Anda.`);
    } else {
      showToast('Masuk ke akun Anda untuk menyimpan riwayat membaca otomatis.', 'info');
    }
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="reader-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#39343A]/55 p-3 backdrop-blur-xs sm:p-6"
    >
      <div className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-[#39343A]/10 bg-[#FFF9FA] shadow-2xl">
        {/* Top Reader Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#39343A]/[0.08] bg-white px-5 py-3.5 sm:px-7">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs text-[#96495D]">
              <BookOpen className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span className="font-medium">Mode Baca Digital</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums text-[#6E656F]">
                Bab {chapterIdx + 1}/{chapters.length}
              </span>
            </div>
            <h2
              id="reader-title"
              className="truncate font-editorial text-lg font-semibold text-[#39343A]"
            >
              {book.title}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {/* Font size controls */}
            <div
              aria-label="Pengaturan ukuran huruf"
              className="inline-flex items-center gap-1 rounded-xl border border-[#39343A]/10 bg-[#FFF9FA] p-1"
            >
              <button
                type="button"
                aria-label="Perkecil ukuran huruf"
                onClick={() => setFontSize((s) => Math.max(14, s - 1))}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[#39343A] hover:bg-white"
              >
                <Minus className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
              <span className="px-1.5 font-mono text-xs text-[#6E656F] tabular-nums">
                {fontSize}px
              </span>
              <button
                type="button"
                aria-label="Perbesar ukuran huruf"
                onClick={() => setFontSize((s) => Math.min(22, s + 1))}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[#39343A] hover:bg-white"
              >
                <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup mode baca"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#39343A]/10 bg-white text-[#39343A] hover:bg-[#FDF2F4]"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Thin reading progress bar */}
        <div className="h-1 w-full bg-[#F4B6C2]/25">
          <div
            style={{ width: `${progressPct}%` }}
            className="h-full bg-[#96495D] transition-all duration-300"
          />
        </div>

        {/* Reader Body */}
        <div className="flex-1 overflow-y-auto px-6 py-10 sm:px-12">
          <article className="mx-auto max-w-[65ch]">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#96495D]">
              {book.author}
            </p>
            <h3 className="mt-2 font-editorial text-2xl font-semibold text-[#39343A] sm:text-3xl">
              {activeChapter.title}
            </h3>

            <div className="mt-7 space-y-5 text-[#39343A]/90">
              {activeChapter.content.map((para, idx) => (
                <p
                  key={idx}
                  style={{ fontSize: `${fontSize}px`, lineHeight: 1.8 }}
                  className={
                    idx === 0
                      ? 'first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-editorial first-letter:text-5xl first-letter:font-semibold first-letter:text-[#96495D]'
                      : ''
                  }
                >
                  {para}
                </p>
              ))}
            </div>
          </article>
        </div>

        {/* Reader Footer Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#39343A]/[0.08] bg-white px-5 py-3.5 sm:px-7">
          <button
            type="button"
            disabled={chapterIdx <= 0}
            onClick={() => handleSelectChapter(chapterIdx - 1)}
            className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-[#39343A]/12 px-4 text-xs font-semibold text-[#39343A] hover:bg-[#FDF2F4] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            <span>Bab Sebelumnya</span>
          </button>

          <div className="flex items-center gap-2">
            {chapterIdx < chapters.length - 1 ? (
              <button
                type="button"
                onClick={() => handleSelectChapter(chapterIdx + 1)}
                className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-[#39343A] px-5 text-xs font-semibold text-[#FFF9FA] hover:bg-[#96495D] transition-colors"
              >
                <span>Bab Berikutnya</span>
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinishChapter}
                className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-[#96495D] px-5 text-xs font-semibold text-white hover:bg-[#7D3A4B] transition-colors"
              >
                <Check className="h-4 w-4" aria-hidden="true" />
                <span>Selesai Membaca Pratinjau</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
