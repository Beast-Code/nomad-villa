export const dynamic = 'force-dynamic'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { createClient } from '@/lib/supabase/server'
import { Villa, BlockedDate } from '@/types/database'
import VillaBookingForm from '@/components/VillaBookingForm'

async function getVilla(id: string): Promise<Villa | null> {
  console.log('🟡 getVilla() called with id:', id)

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('villas')
    .select('*')
    .eq('id', id)
    .single()

  console.log('🟢 Supabase data:', data)
  console.log('🔴 Supabase error:', error)

  if (error || !data) return null
  return data
}


async function getBlockedDates(villaId: string): Promise<BlockedDate[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('blocked_dates')
    .select('*')
    .eq('villa_id', villaId)

  return data || []
}

async function getBookedDates(villaId: string): Promise<string[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('bookings')
    .select('check_in, check_out')
    .eq('villa_id', villaId)
    .eq('payment_status', 'paid')

  if (!data) return []

  const bookedDates: string[] = []

  data.forEach((booking) => {
    const checkIn = new Date(booking.check_in)
    const checkOut = new Date(booking.check_out)
    const current = new Date(checkIn)

    while (current < checkOut) {
      bookedDates.push(current.toISOString().split('T')[0])
      current.setDate(current.getDate() + 1)
    }
  })

  return bookedDates
}

export default async function VillaDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  // ✅ STEP 1: unwrap params
  const { id } = await params

  console.log('✅ Villa ID =', id)

  // ✅ STEP 2: fetch villa
  const villa = await getVilla(id)

  // ❌ DO NOT use notFound() here
  if (!villa) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-16 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Villa not found</h1>
            <p className="text-gray-500 mt-2">
              This villa does not exist or could not be loaded.
            </p>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  // ✅ STEP 3: fetch dates
  const blockedDates = await getBlockedDates(id)
  const bookedDates = await getBookedDates(id)

  const unavailableDates = [
    ...blockedDates.map((bd) => bd.date),
    ...bookedDates,
  ]

  // ✅ STEP 4: render UI
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Images */}
          <div className="mb-8">
            {villa.images?.length ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <img
                    src={villa.images[0]}
                    alt={villa.name}
                    className="w-full h-96 object-cover rounded-lg"
                  />
                </div>
                {villa.images.slice(1, 5).map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={villa.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                ))}
              </div>
            ) : (
              <div className="h-96 bg-gray-200 flex items-center justify-center rounded-lg">
                No Images Available
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h1 className="text-4xl font-bold mb-4">{villa.name}</h1>
              <p className="text-xl font-semibold mb-6">
                ₹{villa.price_per_night.toLocaleString()} / night
              </p>

              <h2 className="text-2xl font-semibold mb-2">Description</h2>
              <p className="text-gray-700 mb-8 whitespace-pre-line">
                {villa.description}
              </p>

              <h2 className="text-2xl font-semibold mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {villa.amenities?.map((a, i) => (
                  <span key={i}>✓ {a}</span>
                ))}
              </div>
            </div>

            <div className="lg:col-span-1">
              <VillaBookingForm
                villa={villa}
                unavailableDates={unavailableDates}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
