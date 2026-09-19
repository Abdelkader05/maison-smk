import Link from 'next/link'

export default function Footer() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
  const whatsappLink = `https://wa.me/${whatsappNumber}`

  return (
    <footer className="border-t border-[var(--color-ink)]/10 bg-[var(--color-card)]">
      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-10">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-4">
          <div>
            <h3 className="font-[family-name:var(--font-fraunces)] text-lg text-[var(--color-ink)]">Maison SMK</h3>
            <p className="mt-2 text-sm text-[var(--color-ink)]/70">Chaussures a Bamako, commande directe via WhatsApp.</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-[var(--color-ink)]">Navigation</h4>
            <ul className="mt-2 space-y-1 text-sm text-[var(--color-ink)]/70">
              <li><Link href="/produits" className="hover:text-[var(--color-brass)]">Catalogue</Link></li>
              <li><Link href="/a-propos" className="hover:text-[var(--color-brass)]">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-medium text-[var(--color-ink)]">Contact</h4>
            <ul className="mt-2 space-y-1 text-sm text-[var(--color-ink)]/70">
              <li>
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-brass)]">
                  WhatsApp
                </a>
              </li>
              <li>Bamako, Mali</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-medium text-[var(--color-ink)]">Livraison &amp; paiement</h4>
            <ul className="mt-2 space-y-1 text-sm text-[var(--color-ink)]/70">
                <li>Paiement a la livraison</li>
              <li>Livraison a Bamako sous 24-48h</li>
              <li>Paiement a la livraison</li>
            </ul>
          </div>
        </div>
        <p className="mt-10 text-xs text-[var(--color-ink)]/50">(c) 2026 Maison SMK</p>
      </div>
    </footer>
  )
}