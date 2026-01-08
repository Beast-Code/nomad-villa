'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Script from 'next/script'

interface BookingPaymentProps {
  bookingId: string
  orderId: string
  amount: number
  guestName: string
  email: string
  phone: string
}

declare global {
  interface Window {
    Razorpay: any
  }
}

export default function BookingPayment({
  bookingId,
  orderId,
  amount,
  guestName,
  email,
  phone,
}: BookingPaymentProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Razorpay) {
      // Razorpay is loaded
    }
  }, [])

  const handlePayment = async () => {
    if (!window.Razorpay) {
      setError('Payment gateway not loaded. Please refresh the page.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: Math.round(amount * 100), // Convert to paise
        currency: 'INR',
        name: 'Nomad Villa',
        description: `Booking for ${guestName}`,
        order_id: orderId,
        handler: async function (response: any) {
          // Verify payment on server
          try {
            const verifyResponse = await fetch('/api/bookings/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                bookingId,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            })

            const data = await verifyResponse.json()

            if (verifyResponse.ok && data.success) {
              // Redirect to confirmation page
              router.push(`/bookings/${bookingId}?success=true`)
            } else {
              setError(data.error || 'Payment verification failed')
              setLoading(false)
            }
          } catch (err: any) {
            setError('Failed to verify payment. Please contact support.')
            setLoading(false)
          }
        },
        prefill: {
          name: guestName,
          email: email,
          contact: phone,
        },
        theme: {
          color: '#000000',
        },
        modal: {
          ondismiss: function () {
            setLoading(false)
          },
        },
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()
    } catch (err: any) {
      setError(err.message || 'Failed to initialize payment')
      setLoading(false)
    }
  }

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
        onLoad={() => {
          // Script loaded
        }}
      />
      <div>
        <h2 className="text-xl font-semibold mb-4">Payment</h2>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}
        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : `Pay ₹${amount.toLocaleString()}`}
        </button>
        <p className="text-xs text-gray-500 mt-4 text-center">
          Secure payment powered by Razorpay
        </p>
      </div>
    </>
  )
}
