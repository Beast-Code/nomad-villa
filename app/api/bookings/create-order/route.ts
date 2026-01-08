import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { razorpay } from '@/lib/razorpay'
import { differenceInDays } from 'date-fns'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { villaId, checkIn, checkOut, guestName, email, phone, totalAmount } = body

    // Validate input
    if (!villaId || !checkIn || !checkOut || !guestName || !email || !phone || !totalAmount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Verify villa exists
    const supabase = createAdminClient()
    const { data: villa, error: villaError } = await supabase
      .from('villas')
      .select('*')
      .eq('id', villaId)
      .single()

    if (villaError || !villa) {
      return NextResponse.json(
        { error: 'Villa not found' },
        { status: 404 }
      )
    }

    // Check availability
    const checkInDate = new Date(checkIn)
    const checkOutDate = new Date(checkOut)
    const days = differenceInDays(checkOutDate, checkInDate)

    if (days <= 0) {
      return NextResponse.json(
        { error: 'Invalid date range' },
        { status: 400 }
      )
    }

    // Check for existing bookings
    const { data: existingBookings } = await supabase
      .from('bookings')
      .select('*')
      .eq('villa_id', villaId)
      .eq('payment_status', 'paid')
      .or(`and(check_in.lte.${checkOut},check_out.gte.${checkIn})`)

    if (existingBookings && existingBookings.length > 0) {
      return NextResponse.json(
        { error: 'Selected dates are not available' },
        { status: 400 }
      )
    }

    // Check blocked dates
    const { data: blockedDates } = await supabase
      .from('blocked_dates')
      .select('*')
      .eq('villa_id', villaId)
      .gte('date', checkIn)
      .lte('date', checkOut)

    if (blockedDates && blockedDates.length > 0) {
      return NextResponse.json(
        { error: 'Selected dates include blocked dates' },
        { status: 400 }
      )
    }

    // Create booking record
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        villa_id: villaId,
        check_in: checkIn,
        check_out: checkOut,
        guest_name: guestName,
        email,
        phone,
        total_amount: totalAmount,
        payment_status: 'pending',
      })
      .select()
      .single()

    if (bookingError || !booking) {
      return NextResponse.json(
        { error: 'Failed to create booking' },
        { status: 500 }
      )
    }

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(totalAmount * 100), // Convert to paise
      currency: 'INR',
      receipt: `booking_${booking.id}`,
      notes: {
        booking_id: booking.id,
        villa_id: villaId,
        guest_name: guestName,
        email,
      },
    })

    // Update booking with Razorpay order ID
    await supabase
      .from('bookings')
      .update({ razorpay_order_id: razorpayOrder.id })
      .eq('id', booking.id)

    return NextResponse.json({
      bookingId: booking.id,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    })
  } catch (error: any) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
