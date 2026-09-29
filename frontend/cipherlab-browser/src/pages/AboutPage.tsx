import React from 'react';
import {
  BookOpen,
  Code2,
  Award,
  Terminal,
  Grid3X3,
  Binary,
  ArrowRight,
} from 'lucide-react';
import type { PageId } from '../components/Navbar';

interface AboutPageProps {
  onNavigate: (page: PageId) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-10 py-4 max-w-5xl mx-auto">
      {/* Title & Project Metadata */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-mono">
          <Award className="w-4 h-4 text-cyan-400" />
          <span>Academic Project Metadata</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          CipherLab: Pedagogical Cryptography Workbench
        </h1>

        {/* Editable Project Placeholder Banner */}
        <div className="p-4 rounded-xl bg-slate-950 border border-indigo-500/40 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span className="text-indigo-400 font-bold uppercase tracking-wider">
              Project Title &amp; Team Placeholder
            </span>
            <span className="text-[10px] bg-indigo-900/40 text-indigo-300 px-2 py-0.5 rounded border border-indigo-800">
              Editable for Final Submission
            </span>
          </div>

          <div className="text-sm font-semibold text-white font-mono">
            &quot;M.Tech / B.E. Cryptography Project — Hill Cipher &amp; DES&quot;
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-mono text-slate-300">
            <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
              <span className="text-slate-500 block text-[10px]">Institution:</span>
              <span className="text-slate-200">Department of Computer Science &amp; Engineering</span>
            </div>
            <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
              <span className="text-slate-500 block text-[10px]">Course / Subject:</span>
              <span className="text-slate-200">Cryptography &amp; Network Security (CNS)</span>
            </div>
            <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
              <span className="text-slate-500 block text-[10px]">Authors / Team:</span>
              <span className="text-cyan-300 font-bold">[Enter Student Names / USNs Here]</span>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Specifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-slate-900/70 border border-slate-800 rounded-2xl space-y-3">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
            <Code2 className="w-5 h-5" />
            <span>Architecture &amp; Tech Stack</span>
          </div>
          <ul className="text-xs space-y-2 text-slate-300 leading-relaxed">
            <li>
              <strong>Frontend Engine:</strong> React 19 + TypeScript + Vite.
            </li>
            <li>
              <strong>Styling System:</strong> Modern Tailwind CSS v4 with dark mode high-contrast palette, suitable for classroom projectors.
            </li>
            <li>
              <strong>Pure Client-Side Cryptography:</strong> Zero backend dependencies. 100% of matrix transformations and bit-level Feistel permutations execute locally in TypeScript.
            </li>
            <li>
              <strong>Unit Testing:</strong> Automated Vitest test suite verifying reciprocal $D(E(x)) = x$ and the NIST SP 800-20 standard known-answer test.
            </li>
          </ul>
        </div>

        <div className="p-6 bg-slate-900/70 border border-slate-800 rounded-2xl space-y-3">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
            <Terminal className="w-5 h-5" />
            <span>Developer Commands</span>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl font-mono text-xs text-slate-300 space-y-2 border border-slate-800">
            <div>
              <span className="text-slate-500"># Install dependencies</span>
              <div className="text-emerald-400">npm install</div>
            </div>
            <div>
              <span className="text-slate-500"># Start local Vite development server</span>
              <div className="text-emerald-400">npm run dev</div>
            </div>
            <div>
              <span className="text-slate-500"># Run automated cryptographic unit tests</span>
              <div className="text-emerald-400">npm test</div>
            </div>
            <div>
              <span className="text-slate-500"># Build static production bundle into dist/</span>
              <div className="text-emerald-400">npm run build</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bibliography & References */}
      <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
          <BookOpen className="w-5 h-5 text-indigo-400" />
          <h3 className="text-base font-bold text-white">
            Primary References &amp; Academic Standards
          </h3>
        </div>

        <div className="space-y-3 text-xs text-slate-300">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
            <div className="font-bold text-white">
              1. National Bureau of Standards (NBS / NIST)
            </div>
            <p className="text-slate-400 mt-0.5">
              Federal Information Processing Standards Publication (FIPS PUB 46-3): <em>Data Encryption Standard (DES)</em>. National Institute of Standards and Technology, 1999.
            </p>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
            <div className="font-bold text-white">
              2. Lester S. Hill (1929)
            </div>
            <p className="text-slate-400 mt-0.5">
              <em>&quot;Cryptography in an Algebraic Alphabet&quot;</em>. The American Mathematical Monthly, Vol. 36, No. 6, pp. 306–312.
            </p>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
            <div className="font-bold text-white">
              3. Claude E. Shannon (1949)
            </div>
            <p className="text-slate-400 mt-0.5">
              <em>&quot;Communication Theory of Secrecy Systems&quot;</em>. Bell System Technical Journal, Vol. 28, No. 4, pp. 656–715.
            </p>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
            <div className="font-bold text-white">
              4. William Stallings (2017)
            </div>
            <p className="text-slate-400 mt-0.5">
              <em>Cryptography and Network Security: Principles and Practice</em> (7th Edition). Pearson Education.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Launch Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
        <button
          type="button"
          onClick={() => onNavigate('hill')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs sm:text-sm transition-all shadow-md group"
        >
          <Grid3X3 className="w-4 h-4 text-cyan-300" />
          <span>Launch Hill Cipher Studio</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>

        <button
          type="button"
          onClick={() => onNavigate('des')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-700 hover:bg-cyan-600 text-white font-medium text-xs sm:text-sm transition-all shadow-md group"
        >
          <Binary className="w-4 h-4 text-amber-300" />
          <span>Launch DES &amp; Avalanche Lab</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
