export type CategoryName =
  | 'Pendidikan'
  | 'Teknologi'
  | 'Sastra'
  | 'Sejarah'
  | 'Psikologi'
  | 'Sains'
  | 'Ilmu Sosial';

export type CollectionType =
  | 'E-Book'
  | 'Buku Cetak'
  | 'Jurnal Akademik'
  | 'Modul Kuliah';

export type LanguageType = 'Bahasa Indonesia' | 'Bahasa Inggris';

export type AvailabilityStatus =
  | 'Tersedia Digital'
  | 'Tersedia di Rak'
  | 'Dipinjam Terbatas';

export type CoverTheme = 'blush' | 'lavender' | 'sage' | 'dusty' | 'alabaster';

export interface SampleChapter {
  title: string;
  content: string[];
}

export interface Book {
  id: string;
  title: string;
  subtitle?: string;
  author: string;
  publisher: string;
  year: number;
  isbn: string;
  category: CategoryName;
  collectionType: CollectionType;
  language: LanguageType;
  pages: number;
  availability: AvailabilityStatus;
  digitalAvailable: boolean;
  availableCopies: number;
  totalCopies: number;
  readsCount: number;
  rating: number;
  subjects: string[];
  synopsis: string;
  coverImage?: string;
  coverTheme: CoverTheme;
  coverMotif: 'botanical' | 'geometric' | 'orbital' | 'archival' | 'waves';
  featured?: boolean;
  recentlyAdded?: boolean;
  sampleChapters: SampleChapter[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'Mahasiswa S1' | 'Mahasiswa Pascasarjana' | 'Pelajar SMA/SMK' | 'Peneliti & Dosen' | 'Pembaca Umum';
  institution: string;
  memberCode: string;
  joinedAt: string;
  interests: CategoryName[];
  emailReminders: boolean;
}

export interface BorrowRecord {
  bookId: string;
  borrowedAt: string;
  dueDate: string;
}

export interface ReadingHistoryItem {
  bookId: string;
  lastReadAt: string;
  progressPercent: number;
  lastChapterIndex: number;
}

export type SortOption = 'popular' | 'newest' | 'title';

export type AppView = 'home' | 'catalog' | 'detail' | 'dashboard';
