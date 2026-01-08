import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminNavbar from '@/components/AdminNavbar'
import VillaForm from '@/components/VillaForm'

export default async function NewVillaPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  return (
    <>
      <AdminNavbar />
      <main className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold mb-8 text-gray-900">Add New Villa</h1>
          <VillaForm />
        </div>
      </main>
    </>
  )
}
