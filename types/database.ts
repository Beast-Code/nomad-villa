export interface Villa {
  id: string
  name: string
  description: string
  price_per_night: number
  amenities: string[]
  images: string[]
  created_at?: string
  updated_at?: string
}

export interface Booking {
  id: string
  villa_id: string
  check_in: string
  check_out: string
  guest_name: string
  email: string
  phone: string
  total_amount: number
  payment_status: 'pending' | 'paid' | 'failed'
  razorpay_order_id?: string
  razorpay_payment_id?: string
  created_at?: string
  updated_at?: string
}

export interface BlockedDate {
  id: string
  villa_id: string
  date: string
  reason?: string
  created_at?: string
}
