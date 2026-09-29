import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-white/[0.08] bg-black/30 backdrop-blur-xl">
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5 text-xs">
          <p className="text-slate-500">© {new Date().getFullYear()} SecureVault</p>
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
            <nav aria-label="Footer navigation" className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-slate-400">
              <Link href="/" className="transition-colors hover:text-indigo-300">Dashboard</Link>
              <Link href="/encrypt" className="transition-colors hover:text-indigo-300">Encrypt</Link>
              <Link href="/decrypt" className="transition-colors hover:text-indigo-300">Decrypt</Link>
              <Link href="/history" className="transition-colors hover:text-indigo-300">History</Link>
            </nav>
            <nav aria-label="Cryptography tools" className="flex items-center gap-3 text-slate-400">
              <span className="text-slate-500">Tools</span>
              <Link href="/algorithm-lab" className="transition-colors hover:text-indigo-300">Algorithm Lab</Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
