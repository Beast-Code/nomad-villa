import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Villa } from '@/types/database'
import AdminNavbar from '@/components/AdminNavbar'
import VillaForm from '@/components/VillaForm'
import BlockDatesForm from '@/components/BlockDatesForm'

async function getVilla(id: string): Promise<Villa | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('villas')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) {
    return null
  }

  return data
}

export default async function EditVillaPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  const villa = await getVilla(params.id)

  if (!villa) {
    notFound()
  }

  return (
    <>
      <AdminNavbar />
      <main className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold mb-8 text-gray-900">Edit Villa</h1>
          <VillaForm villa={villa} />
          
          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-900">Block Dates</h2>
            <BlockDatesForm villaId={villa.id} />
          </div>
        </div>
      </main>
    </>
  )
}
