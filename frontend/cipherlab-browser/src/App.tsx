import { useState } from 'react';
import { Navbar } from './components/Navbar';
import type { PageId } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { HillCipherPage } from './pages/HillCipherPage';
import { DesPage } from './pages/DesPage';
import { Shield } from 'lucide-react';

export function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('home');

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} />;
      case 'hill':
        return <HillCipherPage />;
      case 'des':
      
        return <DesPage />;
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#080b12] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-white">
      {/* Top Sticky Navigation */}
      <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />

      {/* Main Page Body — full width with comfortable padding */}
      <main className="flex-1 w-full px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
        <div className="mx-auto w-full max-w-[1440px]">
          {renderCurrentPage()}
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/90 py-4 text-xs text-slate-500">
        <div className="w-full px-4 sm:px-6 lg:px-10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-semibold text-slate-300">CipherLab</span>
          </div>

          <div className="flex items-center gap-5 font-mono text-[11px]">
            <button
              type="button"
              onClick={() => setCurrentPage('hill')}
              className="hover:text-slate-300 transition-colors"
            >
              Hill Cipher
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage('des')}
              className="hover:text-slate-300 transition-colors"
            >
              DES Lab
            </button>
          </div>

        </div>
      </footer>
    </div>
  );
}

export default App;
