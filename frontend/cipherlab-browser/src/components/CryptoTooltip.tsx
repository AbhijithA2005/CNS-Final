import React, { useState } from 'react';
import { Info } from 'lucide-react';

export type CryptoTermKey =
  | 'feistel'
  | 'sbox'
  | 'pbox'
  | 'avalanche'
  | 'modular_inverse'
  | 'coprime'
  | 'determinant'
  | 'parity_bits'
  | 'polygraphic'
  | 'known_plaintext'
  | 'confusion'
  | 'diffusion'
  | 'kerckhoffs';

interface TermDef {
  title: string;
  shortDesc: string;
  formula?: string;
  details: string;
}

export const CRYPTO_GLOSSARY: Record<CryptoTermKey, TermDef> = {
  feistel: {
    title: 'Feistel Network',
    shortDesc: 'A symmetric cipher structure that splits data into two halves and applies a round function iteratively.',
    formula: 'L_i = R_{i-1}, \\quad R_i = L_{i-1} \\oplus F(R_{i-1}, K_i)',
    details:
      'Invented by Horst Feistel at IBM, this design guarantees that encryption and decryption are structurally identical; decryption simply applies the round subkeys in reverse order without needing the round function F to be invertible.',
  },
  sbox: {
    title: 'S-Box (Substitution Box)',
    shortDesc: 'The non-linear component of DES providing the critical property of "confusion".',
    formula: 'S_i: \\{0,1\\}^6 \\to \\{0,1\\}^4',
    details:
      'DES uses 8 distinct lookup tables. For a 6-bit input b₁b₂b₃b₄b₅b₆, bits b₁b₆ choose the table row (0–3), while inner bits b₂b₃b₄b₅ choose the column (0–15). It yields a 4-bit output, preventing linear algebraic attacks.',
  },
  pbox: {
    title: 'P-Box (Permutation Box)',
    shortDesc: 'Bit-level permutation that shuffles bit positions to disperse outputs across the block.',
    formula: 'P: \\{0,1\\}^{32} \\to \\{0,1\\}^{32}',
    details:
      'Transposes the 32 bits from the 8 S-box outputs so that each S-box output bit influences multiple different S-boxes in the subsequent Feistel round, accelerating diffusion.',
  },
  avalanche: {
    title: 'Avalanche Effect',
    shortDesc: 'A desirable cryptographic property where changing 1 bit produces ~50% changed output bits.',
    formula: '\\mathbb{E}[\\text{HammingDistance}(C, C\')] \\approx \\frac{N}{2} = 32\\text{ bits}',
    details:
      'Introduced by Horst Feistel and formalized by Webster & Tavares, strict avalanche criterion ensures that small changes in input or key cause an avalanche of unpredictable changes in the ciphertext within 3–4 rounds.',
  },
  modular_inverse: {
    title: 'Modular Multiplicative Inverse',
    shortDesc: 'An integer x such that (a · x) ≡ 1 (mod m).',
    formula: 'a \\cdot a^{-1} \\equiv 1 \\pmod{m}',
    details:
      'Essential for Hill Cipher decryption: to compute K⁻¹ mod 26, one must multiply the adjugate matrix by the modular inverse of det(K). If det(K) is not coprime to 26, the inverse does not exist.',
  },
  coprime: {
    title: 'Coprime (Relatively Prime)',
    shortDesc: 'Two integers whose Greatest Common Divisor is 1.',
    formula: '\\gcd(a, 26) = 1',
    details:
      'Because 26 = 2 × 13, any integer divisible by 2 (even) or 13 shares a factor with 26 and cannot have a multiplicative inverse modulo 26. Valid coprime values mod 26 are 1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, and 25.',
  },
  determinant: {
    title: 'Matrix Determinant',
    shortDesc: 'A scalar value computed from square matrix entries that determines invertibility.',
    formula: '\\text{det}(K) = ad - bc \\pmod{26} \\quad (2\\times2)',
    details:
      'In linear algebra, a matrix is invertible over the real numbers if det ≠ 0. Over modular ring ℤ₂₆, it is invertible if and only if gcd(det mod 26, 26) = 1.',
  },
  parity_bits: {
    title: 'Key Parity Bits',
    shortDesc: 'Every 8th bit in a 64-bit DES key is used for parity checking, leaving 56 effective bits.',
    details:
      'Bits 8, 16, 24, 32, 40, 48, 56, and 64 are discarded during Permuted Choice 1 (PC-1). Consequently, DES has an effective keyspace of 2⁵⁶ (≈ 7.2 × 10¹⁶ keys).',
  },
  polygraphic: {
    title: 'Polygraphic Substitution',
    shortDesc: 'A cipher that encrypts blocks of letters simultaneously rather than single letters.',
    details:
      'Invented by Lester S. Hill in 1929, the Hill Cipher was the first practical polygraphic substitution cipher, disguising single-letter frequency analysis by encrypting n-grams together.',
  },
  known_plaintext: {
    title: 'Known-Plaintext Attack (KPA)',
    shortDesc: 'Cryptanalysis where the attacker has access to both plaintext blocks and their ciphertexts.',
    formula: 'K = C \\cdot P^{-1} \\pmod{26}',
    details:
      'Because the Hill Cipher is purely linear over ℤ₂₆, discovering n linearly independent plaintext-ciphertext block pairs allows an attacker to compute the secret key matrix instantly using Gaussian elimination.',
  },
  confusion: {
    title: 'Confusion (Shannon Principle)',
    shortDesc: 'Making the relationship between ciphertext and key as complex and non-linear as possible.',
    details:
      'Proposed by Claude Shannon in 1949. In DES, confusion is achieved primarily through the 8 non-linear S-boxes.',
  },
  diffusion: {
    title: 'Diffusion (Shannon Principle)',
    shortDesc: 'Dissipating statistical redundancies of the plaintext across the entire ciphertext.',
    details:
      'Achieved in DES by the permutation P-box and expansion E-table, ensuring each plaintext bit affects many ciphertext bits across 16 rounds.',
  },
  kerckhoffs: {
    title: "Kerckhoffs's Principle",
    shortDesc: 'The security of a cipher must depend solely on the secrecy of the key, not the algorithm.',
    details:
      'Formulated by Auguste Kerckhoffs in 1883. DES and modern ciphers like AES are completely open algorithms whose security relies purely on key length and unpredictability.',
  },
};

interface CryptoTooltipProps {
  term: CryptoTermKey;
  children?: React.ReactNode;
  className?: string;
}

export const CryptoTooltip: React.FC<CryptoTooltipProps> = ({ term, children, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const def = CRYPTO_GLOSSARY[term];

  if (!def) return <>{children}</>;

  return (
    <span className="relative inline-flex items-center group">
      {children ? (
        <span
          onClick={() => setIsOpen(!isOpen)}
          className={`cursor-help border-b border-dashed border-indigo-400/60 hover:text-indigo-300 transition-colors ${className}`}
        >
          {children}
        </span>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center text-indigo-400 hover:text-indigo-300 p-0.5 ml-1 rounded transition-colors focus:outline-none"
          title={`Learn about ${def.title}`}
          aria-label={`Learn about ${def.title}`}
        >
          <Info className="w-3.5 h-3.5" />
        </button>
      )}

      {/* Popover Card */}
      <span
        className={`absolute left-0 top-full z-50 mt-2 w-72 max-w-[calc(100vw-2rem)] rounded-xl border border-indigo-500/40 bg-slate-900/95 p-3 text-left shadow-2xl backdrop-blur-md transition-all duration-200 pointer-events-none max-sm:left-auto max-sm:right-0 sm:left-1/2 sm:-translate-x-1/2 ${
          isOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto'
        }`}
      >
        <span className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-1.5">
          <span className="font-semibold text-xs text-indigo-300 tracking-wide uppercase">{def.title}</span>
          <span className="text-[10px] text-slate-400 font-mono">CipherLab Term</span>
        </span>
        <span className="text-xs text-slate-200 block mb-1.5 leading-relaxed">{def.shortDesc}</span>
        {def.formula && (
          <span className="block my-1.5 px-2 py-1 bg-slate-950/80 rounded border border-slate-800 text-[11px] font-mono text-cyan-300">
            {def.formula}
          </span>
        )}
        <span className="text-[11px] text-slate-400 block leading-normal">{def.details}</span>
      </span>
    </span>
  );
};
