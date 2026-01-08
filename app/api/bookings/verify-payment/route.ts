import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      bookingId,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    } = body

    if (!bookingId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return NextResponse.json(
        { error: 'Missing required fields', success: false },
        { status: 400 }
      )
    }

    // Verify signature
    const text = `${razorpayOrderId}|${razorpayPaymentId}`
    const secret = process.env.RAZORPAY_KEY_SECRET!
    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(text)
      .digest('hex')

    if (generatedSignature !== razorpaySignature) {
      return NextResponse.json(
        { error: 'Invalid payment signature', success: false },
        { status: 400 }
      )
    }

    // Update booking status
    const supabase = createAdminClient()
    const { error: updateError } = await supabase
      .from('bookings')
      .update({
        payment_status: 'paid',
        razorpay_order_id: razorpayOrderId,
        razorpay_payment_id: razorpayPaymentId,
      })
      .eq('id', bookingId)

    if (updateError) {
      console.error('Error updating booking:', updateError)
      return NextResponse.json(
        { error: 'Failed to update booking', success: false },
        { status: 500 }
      )
    }

    // TODO: Send confirmation email here
    // You can use a service like Resend, SendGrid, or Supabase Edge Functions

    return NextResponse.json({
      success: true,
      message: 'Payment verified and booking confirmed',
    })
  } catch (error: any) {
    console.error('Error verifying payment:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error', success: false },
      { status: 500 }
    )
  }
}
