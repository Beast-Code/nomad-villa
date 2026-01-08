import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { createClient } from '@/lib/supabase/server'
import { Villa } from '@/types/database'

async function getVillas(): Promise<Villa[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('villas')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching villas:', error)
    return []
  }

  return data || []
}

export default async function VillasPage() {
  const villas = await getVillas()

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold mb-2 text-gray-900">Our Villas</h1>
          <p className="text-gray-600 mb-8">Discover your perfect luxury escape</p>

          {villas.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No villas available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {villas.map((villa) => (
                <Link
                  key={villa.id}
                  href={`/villas/${villa.id}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition group"
                >
                  <div className="relative h-64 overflow-hidden">
                    {villa.images && villa.images.length > 0 ? (
                      <img
                        src={villa.images[0]}
                        alt={villa.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">No Image</span>
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-white px-4 py-2 rounded-lg shadow-lg">
                      <span className="text-lg font-bold text-gray-900">
                        ₹{villa.price_per_night.toLocaleString()}
                      </span>
                      <span className="text-sm text-gray-600">/night</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h2 className="text-2xl font-semibold mb-2 text-gray-900 group-hover:text-gray-700 transition">
                      {villa.name}
                    </h2>
                    <p className="text-gray-600 line-clamp-2 mb-4">
                      {villa.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {villa.amenities?.slice(0, 3).map((amenity, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                        >
                          {amenity}
                        </span>
                      ))}
                      {villa.amenities && villa.amenities.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{villa.amenities.length - 3} more
                        </span>
                      )}
                    </div>
                    <div className="text-blue-600 font-semibold group-hover:text-blue-700 transition">
                      View Details →
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
