import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Booking, Villa } from '@/types/database'
import BookingPayment from '@/components/BookingPayment'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

async function getBooking(id: string): Promise<Booking | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) {
    return null
  }

  return data
}

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

export default async function BookingPage({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: { orderId?: string }
}) {
  const booking = await getBooking(params.id)

  if (!booking) {
    notFound()
  }

  const villa = await getVilla(booking.villa_id)

  if (!villa) {
    notFound()
  }

  // If already paid, show confirmation
  if (booking.payment_status === 'paid') {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="text-6xl mb-4">✅</div>
              <h1 className="text-3xl font-bold mb-4 text-gray-900">
                Booking Confirmed!
              </h1>
              <p className="text-gray-600 mb-8">
                Your booking has been confirmed. A confirmation email has been sent to{' '}
                <strong>{booking.email}</strong>
              </p>
              <div className="bg-gray-50 rounded-lg p-6 text-left max-w-md mx-auto">
                <h2 className="font-semibold mb-4">Booking Details</h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Booking ID:</span>
                    <span className="font-medium">{booking.id.slice(0, 8)}...</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Villa:</span>
                    <span className="font-medium">{villa.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Check-in:</span>
                    <span className="font-medium">
                      {new Date(booking.check_in).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Check-out:</span>
                    <span className="font-medium">
                      {new Date(booking.check_out).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="font-medium">
                      ₹{booking.total_amount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  // Show payment form
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-900">Complete Your Booking</h1>
            
            <div className="mb-8 bg-gray-50 rounded-lg p-6">
              <h2 className="font-semibold mb-4">Booking Summary</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Villa:</span>
                  <span className="font-medium">{villa.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Check-in:</span>
                  <span className="font-medium">
                    {new Date(booking.check_in).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Check-out:</span>
                  <span className="font-medium">
                    {new Date(booking.check_out).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Guest:</span>
                  <span className="font-medium">{booking.guest_name}</span>
                </div>
                <div className="flex justify-between border-t pt-2 mt-2">
                  <span className="text-gray-900 font-semibold">Total Amount:</span>
                  <span className="text-gray-900 font-bold text-lg">
                    ₹{booking.total_amount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {searchParams.orderId && (
              <BookingPayment
                bookingId={booking.id}
                orderId={searchParams.orderId}
                amount={booking.total_amount}
                guestName={booking.guest_name}
                email={booking.email}
                phone={booking.phone}
              />
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
