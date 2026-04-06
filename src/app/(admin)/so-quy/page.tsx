// src/app/(admin)/so-quy/page.tsx

import { createClient } from '@/infrastructure/supabase/server'
import { redirect } from 'next/navigation'
import CashbookPage from '@/presentation/components/cashbook/CashbookPage'
import type { Role } from '@/lib/rbac'

export const dynamic = 'force-dynamic'

export default async function SoQuyPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: account } = await supabase
    .schema('nhan_su')
    .from('accounts')
    .select('role')
    .eq('auth_id', user.id)
    .single()

  const role = (account?.role ?? 'staff') as Role

  return <CashbookPage role={role} />
}