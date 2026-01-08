'use client'

import { useState, useEffect } from 'react'
import { Villa } from '@/types/database'
import { differenceInDays, format, addDays, isBefore, startOfToday } from 'date-fns'
import { useRouter } from 'next/navigation'

interface VillaBookingFormProps {
  villa: Villa
  unavailableDates: string[]
}

export default function VillaBookingForm({ villa, unavailableDates }: VillaBookingFormProps) {
  const router = useRouter()
  const [checkIn, setCheckIn] = useState<string>('')
  const [checkOut, setCheckOut] = useState<string>('')
  const [guestName, setGuestName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const today = format(startOfToday(), 'yyyy-MM-dd')

  const isDateUnavailable = (date: string) => {
    return unavailableDates.includes(date)
  }

  const getMinCheckOutDate = () => {
    if (!checkIn) return today
    const nextDay = format(addDays(new Date(checkIn), 1), 'yyyy-MM-dd')
    return nextDay
  }

  const calculateTotal = () => {
    if (!checkIn || !checkOut) return 0
    const days = differenceInDays(new Date(checkOut), new Date(checkIn))
    return days > 0 ? days * villa.price_per_night : 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!checkIn || !checkOut) {
      setError('Please select check-in and check-out dates')
      setLoading(false)
      return
    }

    if (isBefore(new Date(checkOut), new Date(checkIn))) {
      setError('Check-out date must be after check-in date')
      setLoading(false)
      return
    }

    const days = differenceInDays(new Date(checkOut), new Date(checkIn))
    if (days <= 0) {
      setError('Minimum stay is 1 night')
      setLoading(false)
      return
    }

    // Validate dates are not unavailable
    const checkInDate = new Date(checkIn)
    const checkOutDate = new Date(checkOut)
    let currentDate = new Date(checkInDate)
    
    while (currentDate < checkOutDate) {
      const dateStr = format(currentDate, 'yyyy-MM-dd')
      if (isDateUnavailable(dateStr)) {
        setError('Selected dates include unavailable dates')
        setLoading(false)
        return
      }
      currentDate = addDays(currentDate, 1)
    }

    try {
      // Create Razorpay order
      const response = await fetch('/api/bookings/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          villaId: villa.id,
          checkIn,
          checkOut,
          guestName,
          email,
          phone,
          totalAmount: calculateTotal(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create booking')
      }

      // Redirect to booking page with order details
      router.push(`/bookings/${data.bookingId}?orderId=${data.orderId}`)
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
      setLoading(false)
    }
  }

  const totalAmount = calculateTotal()

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-3xl font-bold text-gray-900">
            ₹{villa.price_per_night.toLocaleString()}
          </span>
          <span className="text-gray-600">per night</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Check-in
          </label>
          <input
            type="date"
            value={checkIn}
            onChange={(e) => {
              setCheckIn(e.target.value)
              if (checkOut && e.target.value >= checkOut) {
                setCheckOut('')
              }
            }}
            min={today}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Check-out
          </label>
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            min={getMinCheckOutDate()}
            disabled={!checkIn}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            required
          />
        </div>

        {checkIn && checkOut && totalAmount > 0 && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">
                {differenceInDays(new Date(checkOut), new Date(checkIn))} nights
              </span>
              <span className="text-gray-900 font-semibold">
                ₹{totalAmount.toLocaleString()}
              </span>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <input
            type="text"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !checkIn || !checkOut || totalAmount === 0}
          className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : 'Book Now'}
        </button>
      </form>
    </div>
  )
}
