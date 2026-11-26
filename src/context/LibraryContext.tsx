import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  BorrowRecord,
  CategoryName,
  ReadingHistoryItem,
  UserProfile,
} from '../types/library';

interface ToastMessage {
  id: number;
  text: string;
  tone: 'success' | 'info' | 'warning';
}

interface StoredAccount {
  profile: UserProfile;
  passwordHash: string;
}

interface UserLibraryData {
  favorites: string[];
  borrowed: BorrowRecord[];
  history: ReadingHistoryItem[];
}

interface LibraryContextValue {
  user: UserProfile | null;
  favorites: string[];
  borrowedBooks: BorrowRecord[];
  readingHistory: ReadingHistoryItem[];
  toast: ToastMessage | null;
  showToast: (text: string, tone?: 'success' | 'info' | 'warning') => void;
  clearToast: () => void;
  login: (email: string, password: string) => { ok: boolean; error?: string };
  register: (payload: {
    name: string;
    email: string;
    password: string;
    role: UserProfile['role'];
    institution: string;
    interests: CategoryName[];
  }) => { ok: boolean; error?: string };
  loginAsDemo: () => void;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  toggleFavorite: (bookId: string, bookTitle?: string) => void;
  isFavorite: (bookId: string) => boolean;
  borrowBook: (bookId: string, bookTitle: string) => void;
  returnBook: (bookId: string, bookTitle: string) => void;
  isBorrowed: (bookId: string) => boolean;
  recordReading: (bookId: string, chapterIndex: number, progressPercent: number) => void;
}

const STORAGE_KEYS = {
  ACTIVE_USER_ID: 'pustaka_nirmala_active_user_id',
  ACCOUNTS: 'pustaka_nirmala_accounts_v1',
  USER_DATA_PREFIX: 'pustaka_nirmala_userdata_',
};

const DEMO_PROFILE: UserProfile = {
  id: 'user-demo-nadira',
  name: 'Nadira Kusuma',
  email: 'nadira.kusuma@mahasiswa.id',
  role: 'Mahasiswa S1',
  institution: 'Universitas Nusantara',
  memberCode: 'PN-2026-0419',
  joinedAt: '2026-02-14',
  interests: ['Teknologi', 'Psikologi', 'Sastra'],
  emailReminders: true,
};

const DEMO_USER_DATA: UserLibraryData = {
  favorites: ['bk-001', 'bk-002', 'bk-003'],
  borrowed: [
    {
      bookId: 'bk-002',
      borrowedAt: '2026-11-18',
      dueDate: '2026-12-02',
    },
    {
      bookId: 'bk-012',
      borrowedAt: '2026-11-20',
      dueDate: '2026-12-04',
    },
  ],
  history: [
    {
      bookId: 'bk-001',
      lastReadAt: '2026-11-24T19:30:00',
      progressPercent: 68,
      lastChapterIndex: 1,
    },
    {
      bookId: 'bk-003',
      lastReadAt: '2026-11-22T14:15:00',
      progressPercent: 42,
      lastChapterIndex: 0,
    },
  ],
};

const LibraryContext = createContext<LibraryContextValue | null>(null);

function loadAccounts(): Record<string, StoredAccount> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // Ignore storage read errors
  }
  return {
    [DEMO_PROFILE.email]: {
      profile: DEMO_PROFILE,
      passwordHash: 'demo1234',
    },
  };
}

function saveAccounts(accounts: Record<string, StoredAccount>) {
  try {
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
  } catch {
    // Ignore storage quota errors
  }
}

function loadUserData(userId: string): UserLibraryData {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEYS.USER_DATA_PREFIX}${userId}`);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // Ignore
  }
  if (userId === DEMO_PROFILE.id) {
    return DEMO_USER_DATA;
  }
  return { favorites: [], borrowed: [], history: [] };
}

function saveUserData(userId: string, data: UserLibraryData) {
  try {
    localStorage.setItem(`${STORAGE_KEYS.USER_DATA_PREFIX}${userId}`, JSON.stringify(data));
  } catch {
    // Ignore
  }
}

export const LibraryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [userData, setUserData] = useState<UserLibraryData>({
    favorites: [],
    borrowed: [],
    history: [],
  });
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Restore session on mount
  useEffect(() => {
    try {
      const accounts = loadAccounts();
      if (!localStorage.getItem(STORAGE_KEYS.ACCOUNTS)) {
        saveAccounts(accounts);
      }
      const activeUserId = localStorage.getItem(STORAGE_KEYS.ACTIVE_USER_ID);
      if (activeUserId) {
        const matched = Object.values(accounts).find((acc) => acc.profile.id === activeUserId);
        if (matched) {
          setUser(matched.profile);
          setUserData(loadUserData(matched.profile.id));
        }
      }
    } catch {
      // Safe fallback
    }
  }, []);

  const showToast = useCallback(
    (text: string, tone: 'success' | 'info' | 'warning' = 'success') => {
      const id = Date.now();
      setToast({ id, text, tone });
      window.setTimeout(() => {
        setToast((current) => (current?.id === id ? null : current));
      }, 3600);
    },
    []
  );

  const clearToast = useCallback(() => setToast(null), []);

  const persistData = useCallback(
    (next: UserLibraryData) => {
      setUserData(next);
      if (user) {
        saveUserData(user.id, next);
      }
    },
    [user]
  );

  const login = useCallback(
    (email: string, password: string) => {
      const normalized = email.trim().toLowerCase();
      if (!normalized || !password.trim()) {
        return { ok: false, error: 'Masukkan email dan kata sandi Anda.' };
      }
      const accounts = loadAccounts();
      const found = accounts[normalized];
      if (!found || found.passwordHash !== password) {
        return {
          ok: false,
          error: 'Email atau kata sandi tidak cocok. Anda juga dapat mencoba Masuk Cepat Akun Demo.',
        };
      }
      setUser(found.profile);
      setUserData(loadUserData(found.profile.id));
      localStorage.setItem(STORAGE_KEYS.ACTIVE_USER_ID, found.profile.id);
      showToast(`Selamat datang kembali, ${found.profile.name}.`);
      return { ok: true };
    },
    [showToast]
  );

  const register = useCallback(
    (payload: {
      name: string;
      email: string;
      password: string;
      role: UserProfile['role'];
      institution: string;
      interests: CategoryName[];
    }) => {
      const normalizedEmail = payload.email.trim().toLowerCase();
      if (!payload.name.trim() || !normalizedEmail || payload.password.length < 6) {
        return {
          ok: false,
          error: 'Pastikan nama terisi, email valid, dan kata sandi minimal 6 karakter.',
        };
      }
      const accounts = loadAccounts();
      if (accounts[normalizedEmail]) {
        return { ok: false, error: 'Email tersebut sudah terdaftar. Silakan masuk.' };
      }
      const id = `user-${Date.now()}`;
      const newProfile: UserProfile = {
        id,
        name: payload.name.trim(),
        email: normalizedEmail,
        role: payload.role,
        institution: payload.institution.trim() || 'Anggota Independen',
        memberCode: `PN-2026-${String(Math.floor(1000 + Math.random() * 9000))}`,
        joinedAt: new Date().toISOString().slice(0, 10),
        interests: payload.interests.length > 0 ? payload.interests : ['Pendidikan', 'Teknologi'],
        emailReminders: true,
      };
      accounts[normalizedEmail] = {
        profile: newProfile,
        passwordHash: payload.password,
      };
      saveAccounts(accounts);
      const initialData: UserLibraryData = {
        favorites: [],
        borrowed: [],
        history: [],
      };
      saveUserData(id, initialData);
      localStorage.setItem(STORAGE_KEYS.ACTIVE_USER_ID, id);
      setUser(newProfile);
      setUserData(initialData);
      showToast(`Akun berhasil dibuat. Selamat membaca, ${newProfile.name}!`);
      return { ok: true };
    },
    [showToast]
  );

  const loginAsDemo = useCallback(() => {
    const accounts = loadAccounts();
    if (!accounts[DEMO_PROFILE.email]) {
      accounts[DEMO_PROFILE.email] = {
        profile: DEMO_PROFILE,
        passwordHash: 'demo1234',
      };
      saveAccounts(accounts);
    }
    const existingProfile = accounts[DEMO_PROFILE.email].profile;
    const data = loadUserData(existingProfile.id);
    localStorage.setItem(STORAGE_KEYS.ACTIVE_USER_ID, existingProfile.id);
    setUser(existingProfile);
    setUserData(data);
    showToast(`Masuk sebagai ${existingProfile.name} (Akun Demo).`);
  }, [showToast]);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_USER_ID);
    setUser(null);
    setUserData({ favorites: [], borrowed: [], history: [] });
    showToast('Anda telah keluar dari akun.', 'info');
  }, [showToast]);

  const updateProfile = useCallback(
    (updates: Partial<UserProfile>) => {
      if (!user) return;
      const updated = { ...user, ...updates };
      setUser(updated);
      const accounts = loadAccounts();
      if (accounts[updated.email]) {
        accounts[updated.email] = {
          ...accounts[updated.email],
          profile: updated,
        };
        saveAccounts(accounts);
      }
      showToast('Pengaturan profil dan minat baca berhasil disimpan.');
    },
    [user, showToast]
  );

  const toggleFavorite = useCallback(
    (bookId: string, bookTitle?: string) => {
      if (!user) {
        showToast('Masuk terlebih dahulu untuk menyimpan buku ke daftar favorit.', 'warning');
        return;
      }
      const exists = userData.favorites.includes(bookId);
      const nextFavorites = exists
        ? userData.favorites.filter((id) => id !== bookId)
        : [bookId, ...userData.favorites];
      persistData({ ...userData, favorites: nextFavorites });
      if (exists) {
        showToast(
          bookTitle ? `"${bookTitle}" dihapus dari favorit.` : 'Dihapus dari daftar favorit.',
          'info'
        );
      } else {
        showToast(
          bookTitle ? `"${bookTitle}" disimpan ke daftar favorit.` : 'Disimpan ke daftar favorit.'
        );
      }
    },
    [user, userData, persistData, showToast]
  );

  const isFavorite = useCallback(
    (bookId: string) => userData.favorites.includes(bookId),
    [userData.favorites]
  );

  const borrowBook = useCallback(
    (bookId: string, bookTitle: string) => {
      if (!user) {
        showToast('Masuk terlebih dahulu untuk meminjam buku.', 'warning');
        return;
      }
      if (userData.borrowed.some((b) => b.bookId === bookId)) {
        showToast(`"${bookTitle}" sudah ada dalam daftar pinjaman Anda.`, 'info');
        return;
      }
      const now = new Date();
      const due = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
      const record: BorrowRecord = {
        bookId,
        borrowedAt: now.toISOString().slice(0, 10),
        dueDate: due.toISOString().slice(0, 10),
      };
      persistData({
        ...userData,
        borrowed: [record, ...userData.borrowed],
      });
      showToast(`"${bookTitle}" berhasil dipinjam hingga ${record.dueDate}.`);
    },
    [user, userData, persistData, showToast]
  );

  const returnBook = useCallback(
    (bookId: string, bookTitle: string) => {
      if (!user) return;
      persistData({
        ...userData,
        borrowed: userData.borrowed.filter((b) => b.bookId !== bookId),
      });
      showToast(`"${bookTitle}" telah dikembalikan. Terima kasih!`, 'info');
    },
    [user, userData, persistData, showToast]
  );

  const isBorrowed = useCallback(
    (bookId: string) => userData.borrowed.some((b) => b.bookId === bookId),
    [userData.borrowed]
  );

  const recordReading = useCallback(
    (bookId: string, chapterIndex: number, progressPercent: number) => {
      if (!user) return;
      const clamped = Math.max(5, Math.min(100, progressPercent));
      const existing = userData.history.find((h) => h.bookId === bookId);
      const updatedItem: ReadingHistoryItem = {
        bookId,
        lastReadAt: new Date().toISOString(),
        progressPercent: existing ? Math.max(existing.progressPercent, clamped) : clamped,
        lastChapterIndex: chapterIndex,
      };
      const rest = userData.history.filter((h) => h.bookId !== bookId);
      persistData({
        ...userData,
        history: [updatedItem, ...rest],
      });
    },
    [user, userData, persistData]
  );

  return (
    <LibraryContext.Provider
      value={{
        user,
        favorites: userData.favorites,
        borrowedBooks: userData.borrowed,
        readingHistory: userData.history,
        toast,
        showToast,
        clearToast,
        login,
        register,
        loginAsDemo,
        logout,
        updateProfile,
        toggleFavorite,
        isFavorite,
        borrowBook,
        returnBook,
        isBorrowed,
        recordReading,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
};

export function useLibrary() {
  const ctx = useContext(LibraryContext);
  if (!ctx) {
    throw new Error('useLibrary must be used within LibraryProvider');
  }
  return ctx;
}
