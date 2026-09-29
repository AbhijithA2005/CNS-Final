import { Shield, Binary, Grid3X3, House } from 'lucide-react';

export type PageId = 'home' | 'hill' | 'des';

interface NavbarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const navItems = [
    { id: 'home' as PageId, label: 'Overview', icon: House },
    { id: 'hill' as PageId, label: 'Hill Cipher', icon: Grid3X3, badge: 'Mod 26' },
    { id: 'des' as PageId, label: 'DES Algorithm', icon: Binary, badge: '16 Rounds' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-[1440px] items-center gap-3 px-3 sm:px-6 lg:px-8">
        {/* Brand */}
        <div
          onClick={() => onNavigate('home')}
          className="group flex min-w-0 shrink-0 cursor-pointer items-center gap-2 sm:gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-cyan-500 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all duration-300">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Shield className="w-5 h-5 text-indigo-400 group-hover:text-cyan-300 transition-colors" />
            </div>
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold tracking-tight bg-gradient-to-r from-white via-indigo-100 to-cyan-400 bg-clip-text text-transparent sm:text-lg">
                CipherLab
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="ml-auto flex min-w-0 items-center justify-end gap-0.5 sm:gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`${item.id === 'home' ? 'max-sm:hidden ' : ''}relative flex items-center gap-1 rounded-lg px-2 py-1.5 text-[11px] font-medium transition-all duration-200 sm:gap-2 sm:px-4 sm:py-2 sm:text-sm ${
                  isActive
                    ? 'text-white bg-slate-800/90 shadow-inner border border-slate-700/60'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span className="whitespace-nowrap">{item.label}</span>
                {item.badge && (
                  <span
                    className={`hidden md:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded ${
                      isActive
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

      </div>
    </header>
  );
};
