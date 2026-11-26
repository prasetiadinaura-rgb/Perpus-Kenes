import React from 'react';
import { BookMarked, Mail, MapPin, Phone } from 'lucide-react';
import { CategoryName } from '../types/library';

interface FooterProps {
  onNavigateHome: (sectionId?: string) => void;
  onNavigateCatalog: (category?: CategoryName) => void;
  onNavigateDashboard: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigateHome,
  onNavigateCatalog,
  onNavigateDashboard,
}) => {
  return (
    <footer className="mt-20 border-t border-[#39343A]/[0.08] bg-[#FBF3F5]">
      <div className="mx-auto max-w-[1200px] px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="inline-flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F4B6C2]/60 text-[#39343A]">
                <BookMarked className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="font-editorial text-xl font-semibold text-[#39343A]">
                Pustaka Nirmala
              </span>
            </div>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-[#6E656F]">
              Ruang baca digital yang dirancang untuk mendukung proses riset, perkuliahan,
              dan kebiasaan membaca harian mahasiswa, pelajar, serta masyarakat luas dengan
              koleksi terkurasi yang ramah di mata.
            </p>
            <div className="mt-6 flex flex-wrap gap-5 text-xs font-medium text-[#39343A]">
              <a
                href="#instagram"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigateHome('tentang-kami');
                }}
                className="underline decoration-[#D98FA1] underline-offset-4 hover:text-[#96495D]"
              >
                Instagram
              </a>
              <a
                href="#x-twitter"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigateHome('tentang-kami');
                }}
                className="underline decoration-[#D98FA1] underline-offset-4 hover:text-[#96495D]"
              >
                X / Twitter
              </a>
              <a
                href="#youtube"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigateHome('tentang-kami');
                }}
                className="underline decoration-[#D98FA1] underline-offset-4 hover:text-[#96495D]"
              >
                YouTube Akademik
              </a>
            </div>
          </div>

          <div className="md:col-span-2">
            <h3 className="font-sans text-sm font-semibold text-[#39343A]">Navigasi</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-[#6E656F]">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateHome()}
                  className="hover:text-[#39343A] transition-colors"
                >
                  Beranda
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateCatalog()}
                  className="hover:text-[#39343A] transition-colors"
                >
                  Katalog Lengkap
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateHome('koleksi-populer')}
                  className="hover:text-[#39343A] transition-colors"
                >
                  Koleksi Populer
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onNavigateDashboard}
                  className="hover:text-[#39343A] transition-colors"
                >
                  Dashboard Anggota
                </button>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h3 className="font-sans text-sm font-semibold text-[#39343A]">Kategori Populer</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-[#6E656F]">
              {(['Pendidikan', 'Teknologi', 'Sastra', 'Psikologi', 'Sains'] as CategoryName[]).map(
                (cat) => (
                  <li key={cat}>
                    <button
                      type="button"
                      onClick={() => onNavigateCatalog(cat)}
                      className="hover:text-[#39343A] transition-colors"
                    >
                      {cat}
                    </button>
                  </li>
                )
              )}
            </ul>
          </div>

          <div className="md:col-span-3">
            <h3 className="font-sans text-sm font-semibold text-[#39343A]">Kontak Layanan</h3>
            <ul className="mt-4 space-y-3 text-sm text-[#6E656F]">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#96495D]" aria-hidden="true" />
                <span>Jl. Cendekia No. 18, Kampus Terpadu, Yogyakarta 55281</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-[#96495D]" aria-hidden="true" />
                <span>halo@pustakanirmala.id</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-[#96495D]" aria-hidden="true" />
                <span className="font-mono tabular-nums">(0274) 551-820</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-[#39343A]/[0.08] pt-6 text-xs text-[#6E656F] sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Pustaka Nirmala. Akses literasi terbuka untuk pelajar dan mahasiswa.</p>
          <p>Layanan baca digital tersedia 24 jam setiap hari.</p>
        </div>
      </div>
    </footer>
  );
};
