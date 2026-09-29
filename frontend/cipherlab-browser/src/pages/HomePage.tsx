import React from 'react';
import { ArrowRight, Binary, Grid3X3 } from 'lucide-react';
import type { PageId } from '../components/Navbar';

interface HomePageProps {
  onNavigate: (page: PageId) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-8 py-4">
      <section className="relative overflow-hidden rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/60 p-7 shadow-2xl sm:p-12">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="relative max-w-3xl space-y-4">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-cyan-300">
            Interactive cryptography labs
          </p>
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
            CipherLab
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
            Run encryption examples, inspect every transformation, and explore how classic ciphers turn readable data into ciphertext.
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2" aria-label="Available labs">
        <button
          type="button"
          onClick={() => onNavigate('hill')}
          className="group space-y-5 rounded-3xl border border-slate-800 bg-slate-900 p-6 text-left transition-all duration-300 hover:border-indigo-500/60 hover:shadow-2xl hover:shadow-indigo-500/10"
        >
          <div className="flex items-center justify-between">
            <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-3 text-indigo-400 transition-transform group-hover:scale-105">
              <Grid3X3 className="h-6 w-6" />
            </div>
            <span className="font-mono text-xs text-cyan-300">MOD 26</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white group-hover:text-indigo-300">Hill Cipher</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              Work with key matrices, encrypt text, and follow the matrix calculations block by block.
            </p>
          </div>
          <span className="flex items-center text-sm font-bold text-indigo-400 group-hover:text-cyan-300">
            Open lab <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('des')}
          className="group space-y-5 rounded-3xl border border-slate-800 bg-slate-900 p-6 text-left transition-all duration-300 hover:border-cyan-500/60 hover:shadow-2xl hover:shadow-cyan-500/10"
        >
          <div className="flex items-center justify-between">
            <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-3 text-cyan-400 transition-transform group-hover:scale-105">
              <Binary className="h-6 w-6" />
            </div>
            <span className="font-mono text-xs text-amber-300">16 ROUNDS</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white group-hover:text-cyan-300">DES Laboratory</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              Encrypt a 64-bit block, inspect the Feistel rounds, and test the avalanche effect.
            </p>
          </div>
          <span className="flex items-center text-sm font-bold text-cyan-400 group-hover:text-amber-300">
            Open lab <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </button>
      </section>
    </div>
  );
};
