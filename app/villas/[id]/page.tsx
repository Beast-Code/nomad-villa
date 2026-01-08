import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { createClient } from '@/lib/supabase/server'
import { Villa, BlockedDate } from '@/types/database'
import VillaBookingForm from '@/components/VillaBookingForm'

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

async function getBlockedDates(villaId: string): Promise<BlockedDate[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('blocked_dates')
    .select('*')
    .eq('villa_id', villaId)

  if (error) {
    return []
  }

  return data || []
}

async function getBookedDates(villaId: string): Promise<string[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('bookings')
    .select('check_in, check_out')
    .eq('villa_id', villaId)
    .eq('payment_status', 'paid')

  if (error || !data) {
    return []
  }

  // Generate all dates between check_in and check_out for each booking
  const bookedDates: string[] = []
  data.forEach((booking) => {
    const checkIn = new Date(booking.check_in)
    const checkOut = new Date(booking.check_out)
    const currentDate = new Date(checkIn)
    
    while (currentDate < checkOut) {
      bookedDates.push(currentDate.toISOString().split('T')[0])
      currentDate.setDate(currentDate.getDate() + 1)
    }
  })

  return bookedDates
}

export default async function VillaDetailsPage({
  params,
}: {
  params: { id: string }
}) {
  const villa = await getVilla(params.id)

  if (!villa) {
    notFound()
  }

  const blockedDates = await getBlockedDates(params.id)
  const bookedDates = await getBookedDates(params.id)

  // Combine blocked and booked dates
  const unavailableDates = [
    ...blockedDates.map((bd) => bd.date),
    ...bookedDates,
  ]

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Image Gallery */}
          <div className="mb-8">
            {villa.images && villa.images.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <img
                    src={villa.images[0]}
                    alt={villa.name}
                    className="w-full h-96 object-cover rounded-lg"
                  />
                </div>
                {villa.images.slice(1, 5).map((image, idx) => (
                  <img
                    key={idx}
                    src={image}
                    alt={`${villa.name} ${idx + 2}`}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                ))}
              </div>
            ) : (
              <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-400 text-lg">No Images Available</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Details */}
            <div className="lg:col-span-2">
              <h1 className="text-4xl font-bold mb-4 text-gray-900">{villa.name}</h1>
              
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-3xl font-bold text-gray-900">
                    ₹{villa.price_per_night.toLocaleString()}
                  </span>
                  <span className="text-gray-600">per night</span>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Description</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {villa.description}
                </p>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {villa.amenities?.map((amenity, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      <span className="text-gray-700">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Booking Form */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <VillaBookingForm
                  villa={villa}
                  unavailableDates={unavailableDates}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
