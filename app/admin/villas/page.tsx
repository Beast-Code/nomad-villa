import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Villa } from '@/types/database'
import AdminNavbar from '@/components/AdminNavbar'

async function getVillas(): Promise<Villa[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('villas')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return []
  }

  return data || []
}

export default async function AdminVillasPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  const villas = await getVillas()

  return (
    <>
      <AdminNavbar />
      <main className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Villas</h1>
            <Link
              href="/admin/villas/new"
              className="bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
            >
              Add New Villa
            </Link>
          </div>

          {villas.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <p className="text-gray-500 mb-4">No villas found.</p>
              <Link
                href="/admin/villas/new"
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                Create your first villa →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {villas.map((villa) => (
                <div key={villa.id} className="bg-white rounded-lg shadow overflow-hidden">
                  {villa.images && villa.images.length > 0 ? (
                    <img
                      src={villa.images[0]}
                      alt={villa.name}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">No Image</span>
                    </div>
                  )}
                  <div className="p-6">
                    <h2 className="text-xl font-semibold mb-2 text-gray-900">{villa.name}</h2>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {villa.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900">
                        ₹{villa.price_per_night.toLocaleString()}/night
                      </span>
                      <Link
                        href={`/admin/villas/${villa.id}`}
                        className="text-blue-600 hover:text-blue-700 font-semibold"
                      >
                        Edit →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  )
}
