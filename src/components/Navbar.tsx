import React from 'react';
import { Language, UserProfile } from '../types/travel';
import { UI_TEXT } from '../utils/scenicArt';

interface NavbarProps {
  lang: Language;
  onToggleLang: () => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  cartCount: number;
  currentUser: UserProfile | null;
  onOpenUserModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  onToggleLang,
  activeTab,
  onSelectTab,
  cartCount,
  currentUser,
  onOpenUserModal,
}) => {
  const t = UI_TEXT[lang];

  const navItems = [
    { id: 'discover', label: t.navDiscover },
    { id: 'planner', label: t.navPlanner },
    { id: 'stay-transit', label: t.navStayTransit },
    { id: 'tickets-guides', label: t.navTicketsGuides },
    { id: 'calculator', label: `${t.navCalculator}${cartCount > 0 ? ` (${cartCount})` : ''}` },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F6]/95 backdrop-blur-md border-b border-[#141413]/10">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <button
          type="button"
          onClick={() => onSelectTab('discover')}
          className="font-display text-xl sm:text-2xl font-semibold tracking-tight text-[#141413] hover:text-[#C84B31] transition-colors whitespace-nowrap shrink-0 text-left focus-visible:outline-2 focus-visible:outline-[#C84B31]"
        >
          {t.brandName}
        </button>

        {/* Zone 2: 5 clean text navigation links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#141413]/75">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={`py-1 whitespace-nowrap shrink-0 transition-colors border-b-2 ${
                  isActive
                    ? 'border-[#C84B31] text-[#141413] font-semibold'
                    : 'border-transparent hover:text-[#141413] hover:border-[#141413]/30'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 2 primary actions (Language Switch + User / My Trips) */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onToggleLang}
            title="Switch Language (English / Telugu)"
            className="px-3 py-2 text-xs font-semibold text-[#141413] bg-[#F3F1EC] hover:bg-[#E7E3DA] rounded-lg transition-colors whitespace-nowrap shrink-0 min-h-[40px]"
          >
            {lang === 'en' ? 'తెలుగు' : 'English'}
          </button>

          <button
            type="button"
            onClick={onOpenUserModal}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#C84B31] hover:bg-[#B43E24] rounded-lg transition-colors whitespace-nowrap shrink-0 min-h-[40px]"
          >
            {currentUser ? `${t.navMyTrips} · ${currentUser.name.split(' ')[0]}` : 'Sign In / My Trips'}
          </button>
        </div>
      </div>

      {/* Compact mobile navigation row */}
      <div className="lg:hidden flex items-center gap-4 overflow-x-auto px-4 py-2 border-t border-[#141413]/5 text-xs font-medium bg-[#FAF9F6]">
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelectTab(item.id)}
            className={`py-1 whitespace-nowrap shrink-0 ${
              activeTab === item.id ? 'text-[#C84B31] font-semibold underline underline-offset-4' : 'text-[#141413]/70'
            }`}
          >
            {item.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => onSelectTab('admin')}
          className={`py-1 whitespace-nowrap shrink-0 ${
            activeTab === 'admin' ? 'text-[#C84B31] font-semibold underline underline-offset-4' : 'text-[#141413]/70'
          }`}
        >
          {t.navAdmin}
        </button>
      </div>
    </header>
  );
};
