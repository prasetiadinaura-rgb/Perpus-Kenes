import React, { useState, useEffect } from 'react';
import { AlertCircle, BookMarked, Check, X } from 'lucide-react';
import { LIBRARY_CATEGORIES } from '../data/books';
import { CategoryName, UserProfile } from '../types/library';
import { useLibrary } from '../context/LibraryContext';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  onAuthSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  open,
  onClose,
  onAuthSuccess,
}) => {
  const { login, register, loginAsDemo } = useLibrary();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [error, setError] = useState<string | null>(null);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [name, setName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [role, setRole] = useState<UserProfile['role']>('Mahasiswa S1');
  const [institution, setInstitution] = useState('');
  const [interests, setInterests] = useState<CategoryName[]>(['Teknologi', 'Pendidikan']);

  useEffect(() => {
    if (!open) return;
    setError(null);
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [open, onClose]);

  if (!open) return null;

  const toggleInterest = (cat: CategoryName) => {
    setInterests((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = login(loginEmail, loginPassword);
    if (!res.ok) {
      setError(res.error || 'Gagal masuk.');
      return;
    }
    onClose();
    onAuthSuccess();
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = register({
      name,
      email: regEmail,
      password: regPassword,
      role,
      institution,
      interests,
    });
    if (!res.ok) {
      setError(res.error || 'Gagal mendaftar.');
      return;
    }
    onClose();
    onAuthSuccess();
  };

  const handleDemo = () => {
    loginAsDemo();
    onClose();
    onAuthSuccess();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#39343A]/55 p-4 backdrop-blur-xs"
    >
      <div className="relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-[#39343A]/10 bg-[#FFF9FA] p-6 shadow-2xl sm:p-8">
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup jendela masuk"
          className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-xl border border-[#39343A]/10 bg-white text-[#39343A] hover:bg-[#FDF2F4]"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>

        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F4B6C2]/50 text-[#39343A]">
            <BookMarked className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <h2
              id="auth-modal-title"
              className="font-editorial text-2xl font-semibold text-[#39343A]"
            >
              {mode === 'login' ? 'Masuk ke Pustaka Nirmala' : 'Daftar Anggota Baru'}
            </h2>
          </div>
        </div>
        <p className="mt-2 text-sm text-[#6E656F]">
          Simpan buku favorit, pantau pinjaman aktif, dan lanjutkan bacaan Anda dari mana saja.
        </p>

        {/* Mode Switcher */}
        <div
          role="tablist"
          aria-label="Pilih masuk atau daftar"
          className="mt-6 grid grid-cols-2 gap-1 rounded-xl bg-[#F4B6C2]/25 p-1"
        >
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'login'}
            onClick={() => {
              setMode('login');
              setError(null);
            }}
            className={`min-h-[40px] rounded-lg text-sm font-semibold transition-colors ${
              mode === 'login'
                ? 'bg-white text-[#39343A] shadow-xs'
                : 'text-[#6E656F] hover:text-[#39343A]'
            }`}
          >
            Masuk
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'register'}
            onClick={() => {
              setMode('register');
              setError(null);
            }}
            className={`min-h-[40px] rounded-lg text-sm font-semibold transition-colors ${
              mode === 'register'
                ? 'bg-white text-[#39343A] shadow-xs'
                : 'text-[#6E656F] hover:text-[#39343A]'
            }`}
          >
            Daftar Akun
          </button>
        </div>

        {/* Error Feedback */}
        {error && (
          <div
            role="alert"
            className="mt-4 flex items-start gap-2.5 rounded-xl border border-[#96495D]/30 bg-[#FDF2F4] p-3.5 text-xs font-medium text-[#96495D]"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}

        {mode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="mt-5 space-y-4">
            <div>
              <label
                htmlFor="login-email"
                className="block text-xs font-semibold text-[#39343A]"
              >
                Alamat Email
              </label>
              <input
                id="login-email"
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="nama@universitas.ac.id"
                className="mt-1.5 h-11 w-full rounded-xl border border-[#39343A]/15 bg-white px-3.5 text-sm text-[#39343A] focus:border-[#96495D] focus:outline-none focus:ring-2 focus:ring-[#F4B6C2]/50"
              />
            </div>

            <div>
              <label
                htmlFor="login-password"
                className="block text-xs font-semibold text-[#39343A]"
              >
                Kata Sandi
              </label>
              <input
                id="login-password"
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Masukkan kata sandi"
                className="mt-1.5 h-11 w-full rounded-xl border border-[#39343A]/15 bg-white px-3.5 text-sm text-[#39343A] focus:border-[#96495D] focus:outline-none focus:ring-2 focus:ring-[#F4B6C2]/50"
              />
            </div>

            <button
              type="submit"
              className="mt-2 flex min-h-[46px] w-full items-center justify-center rounded-xl bg-[#96495D] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#7D3A4B]"
            >
              Masuk ke Akun
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="mt-5 space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="reg-name"
                  className="block text-xs font-semibold text-[#39343A]"
                >
                  Nama Lengkap
                </label>
                <input
                  id="reg-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Rania Putri"
                  className="mt-1.5 h-11 w-full rounded-xl border border-[#39343A]/15 bg-white px-3.5 text-sm text-[#39343A] focus:border-[#96495D] focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="reg-role"
                  className="block text-xs font-semibold text-[#39343A]"
                >
                  Status Akademik
                </label>
                <select
                  id="reg-role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserProfile['role'])}
                  className="mt-1.5 h-11 w-full rounded-xl border border-[#39343A]/15 bg-white px-3 text-sm text-[#39343A] focus:border-[#96495D] focus:outline-none"
                >
                  <option value="Mahasiswa S1">Mahasiswa S1</option>
                  <option value="Mahasiswa Pascasarjana">Mahasiswa Pascasarjana</option>
                  <option value="Pelajar SMA/SMK">Pelajar SMA/SMK</option>
                  <option value="Peneliti & Dosen">Peneliti & Dosen</option>
                  <option value="Pembaca Umum">Pembaca Umum</option>
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="reg-institution"
                className="block text-xs font-semibold text-[#39343A]"
              >
                Sekolah / Universitas
              </label>
              <input
                id="reg-institution"
                type="text"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                placeholder="Contoh: Universitas Indonesia / SMA Negeri 1"
                className="mt-1.5 h-11 w-full rounded-xl border border-[#39343A]/15 bg-white px-3.5 text-sm text-[#39343A] focus:border-[#96495D] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="reg-email"
                  className="block text-xs font-semibold text-[#39343A]"
                >
                  Alamat Email
                </label>
                <input
                  id="reg-email"
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="mt-1.5 h-11 w-full rounded-xl border border-[#39343A]/15 bg-white px-3.5 text-sm text-[#39343A] focus:border-[#96495D] focus:outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="reg-password"
                  className="block text-xs font-semibold text-[#39343A]"
                >
                  Kata Sandi (Min. 6 karakter)
                </label>
                <input
                  id="reg-password"
                  type="password"
                  required
                  minLength={6}
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="••••••"
                  className="mt-1.5 h-11 w-full rounded-xl border border-[#39343A]/15 bg-white px-3.5 text-sm text-[#39343A] focus:border-[#96495D] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-[#39343A]">
                Pilih Topik Minat (untuk rekomendasi personal)
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {LIBRARY_CATEGORIES.map((cat) => {
                  const selected = interests.includes(cat.name);
                  return (
                    <button
                      key={cat.name}
                      type="button"
                      onClick={() => toggleInterest(cat.name)}
                      className={`inline-flex min-h-[36px] items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition-colors ${
                        selected
                          ? 'bg-[#39343A] text-[#FFF9FA]'
                          : 'border border-[#39343A]/12 bg-white text-[#39343A] hover:bg-[#FDF2F4]'
                      }`}
                    >
                      {selected && <Check className="h-3 w-3" aria-hidden="true" />}
                      <span>{cat.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              className="mt-2 flex min-h-[46px] w-full items-center justify-center rounded-xl bg-[#96495D] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#7D3A4B]"
            >
              Buat Akun Anggota
            </button>
          </form>
        )}

        {/* Instant Demo Access */}
        <div className="mt-6 border-t border-[#39343A]/[0.08] pt-5">
          <p className="text-xs text-[#6E656F]">
            Ingin langsung mencoba fitur Dashboard, Riwayat Membaca, dan Peminjaman?
          </p>
          <button
            type="button"
            onClick={handleDemo}
            className="mt-2.5 flex min-h-[44px] w-full items-center justify-center rounded-xl border border-[#D98FA1] bg-[#FDF2F4] px-4 text-sm font-semibold text-[#39343A] transition-colors hover:bg-[#F4B6C2]/35"
          >
            Masuk Cepat dengan Akun Mahasiswa Demo
          </button>
        </div>
      </div>
    </div>
  );
};
