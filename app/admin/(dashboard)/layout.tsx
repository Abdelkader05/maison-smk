import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import LogoutButton from '@/components/admin/LogoutButton'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/admin/login')

const { data: isAdmin } = await supabase.rpc('is_admin')

if (!isAdmin) redirect('/admin/login')

  return (
    <div className="min-h-screen bg-[var(--color-parchment)]">
      <header className="bg-[var(--color-bottle)] px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
            <Link href="/admin" className="font-[family-name:var(--font-fraunces)] text-lg text-[var(--color-parchment)]">
            SMK Market — Admin
            </Link>
            <nav className="flex items-center gap-6">
            <Link href="/admin/produits" className="text-sm text-[var(--color-parchment)]/90 hover:text-[var(--color-parchment)]">
                Produits
            </Link>
            <LogoutButton />
            </nav>
        </div>
        </header>
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  )
}