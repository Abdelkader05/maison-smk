'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-[var(--color-bottle)]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-10">
        <Link href="/" className="font-[family-name:var(--font-fraunces)] text-xl text-[var(--color-parchment)]">
          SMK Market
        </Link>
        <nav className="hidden gap-8 sm:flex">
          <Link href="/" className="text-sm text-[var(--color-parchment)]/90 hover:text-[var(--color-parchment)]">Accueil</Link>
          <Link href="/produits" className="text-sm text-[var(--color-parchment)]/90 hover:text-[var(--color-parchment)]">Catalogue</Link>
          <Link href="/a-propos" className="text-sm text-[var(--color-parchment)]/90 hover:text-[var(--color-parchment)]">Contact</Link>
        </nav>
        <button
          onClick={() => setOpen(!open)}
          className="text-[var(--color-parchment)] sm:hidden"
          aria-label="Ouvrir le menu"
        >
          {open ? 'X' : '='}
        </button>
      </div>
      {open && (
        <nav className="flex flex-col gap-1 border-t border-[var(--color-parchment)]/10 px-6 py-4 sm:hidden">
          <Link href="/" onClick={() => setOpen(false)} className="py-2 text-[var(--color-parchment)]">Accueil</Link>
          <Link href="/produits" onClick={() => setOpen(false)} className="py-2 text-[var(--color-parchment)]">Catalogue</Link>
          <Link href="/a-propos" onClick={() => setOpen(false)} className="py-2 text-[var(--color-parchment)]">Contact</Link>
        </nav>
      )}
    </header>
  )
}