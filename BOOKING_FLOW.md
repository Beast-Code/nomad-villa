# Booking & Payment Flow Explanation

This document explains how the booking and payment flow works in Nomad Villa.

## Overview

The booking flow consists of 5 main steps:
1. Villa Selection & Date Selection
2. Guest Information Collection
3. Razorpay Order Creation
4. Payment Processing
5. Payment Verification & Confirmation

## Detailed Flow

### 1. Villa Selection (`/villas/[id]`)

**Page**: `app/villas/[id]/page.tsx`  
**Component**: `components/VillaBookingForm.tsx`

- User views villa details page
- Selects check-in and check-out dates
- System checks availability:
  - Queries `bookings` table for paid bookings in date range
  - Queries `blocked_dates` table for blocked dates
  - Validates dates are not in the past
  - Validates check-out is after check-in
- Calculates total amount: `(check_out - check_in) * price_per_night`
- User fills guest information (name, email, phone)

### 2. Order Creation (`/api/bookings/create-order`)

**Route**: `app/api/bookings/create-order/route.ts`

When user clicks "Book Now":

1. **Validation**:
   - Checks all required fields are present
   - Verifies villa exists
   - Validates date range (minimum 1 night)
   - Checks for date conflicts with existing bookings
   - Checks for blocked dates

2. **Create Booking Record**:
   ```sql
   INSERT INTO bookings (
     villa_id, check_in, check_out,
     guest_name, email, phone,
     total_amount, payment_status
   ) VALUES (...)
   ```
   - Status: `pending`
   - Returns booking ID

3. **Create Razorpay Order**:
   ```javascript
   razorpay.orders.create({
     amount: totalAmount * 100, // Convert to paise
     currency: 'INR',
     receipt: `booking_${bookingId}`,
     notes: { booking_id, villa_id, guest_name, email }
   })
   ```

4. **Update Booking**:
   - Stores `razorpay_order_id` in booking record

5. **Response**:
   - Returns `bookingId` and `orderId`
   - Redirects to `/bookings/[id]?orderId=[orderId]`

### 3. Payment Page (`/bookings/[id]`)

**Page**: `app/bookings/[id]/page.tsx`  
**Component**: `components/BookingPayment.tsx`

- Displays booking summary
- Loads Razorpay checkout script
- Shows "Pay ₹X" button
- On click, opens Razorpay payment modal

### 4. Razorpay Payment Modal

**Component**: `components/BookingPayment.tsx`

When user clicks "Pay":

1. **Initialize Razorpay**:
   ```javascript
   const options = {
     key: RAZORPAY_KEY_ID,
     amount: amount * 100,
     currency: 'INR',
     order_id: orderId,
     handler: async function(response) {
       // Payment success callback
     }
   }
   const razorpay = new Razorpay(options)
   razorpay.open()
   ```

2. **User Completes Payment**:
   - User enters card/UPI details in Razorpay modal
   - Razorpay processes payment
   - On success, calls `handler` function with:
     - `razorpay_order_id`
     - `razorpay_payment_id`
     - `razorpay_signature`

### 5. Payment Verification (`/api/bookings/verify-payment`)

**Route**: `app/api/bookings/verify-payment/route.ts`

When payment succeeds:

1. **Verify Signature**:
   ```javascript
   const text = `${razorpay_order_id}|${razorpay_payment_id}`
   const secret = RAZORPAY_KEY_SECRET
   const generatedSignature = crypto
     .createHmac('sha256', secret)
     .update(text)
     .digest('hex')
   
   if (generatedSignature !== razorpay_signature) {
     // Invalid payment - reject
   }
   ```

2. **Update Booking**:
   ```sql
   UPDATE bookings SET
     payment_status = 'paid',
     razorpay_order_id = ...,
     razorpay_payment_id = ...
   WHERE id = booking_id
   ```

3. **Send Confirmation** (TODO):
   - Email confirmation to guest
   - Can use Resend, SendGrid, or Supabase Edge Functions

4. **Redirect**:
   - Redirects to `/bookings/[id]?success=true`
   - Shows confirmation page

### 6. Confirmation Page

**Page**: `app/bookings/[id]/page.tsx`

- Checks if `payment_status === 'paid'`
- Displays booking confirmation
- Shows booking details:
  - Booking ID
  - Villa name
  - Check-in/Check-out dates
  - Total amount
  - Guest information

## Database Schema

### bookings Table

```sql
CREATE TABLE bookings (
  id UUID PRIMARY KEY,
  villa_id UUID REFERENCES villas(id),
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guest_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  payment_status VARCHAR(50) DEFAULT 'pending',
  razorpay_order_id VARCHAR(255),
  razorpay_payment_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
)
```

**Payment Status Values**:
- `pending`: Order created, payment not completed
- `paid`: Payment successful and verified
- `failed`: Payment failed (not currently handled)

## Security Considerations

1. **Server-Side Verification**: Payment signature is verified server-side only
2. **Amount Validation**: Amount is calculated server-side, not trusted from client
3. **Date Validation**: All date checks happen server-side
4. **Idempotency**: Razorpay order IDs prevent duplicate payments
5. **Service Role Key**: Never exposed to client, only used in API routes

## Error Handling

### Common Errors

1. **Date Conflicts**: "Selected dates are not available"
2. **Invalid Dates**: "Check-out date must be after check-in date"
3. **Payment Failure**: "Payment verification failed"
4. **Network Errors**: "Failed to create booking"

### User Experience

- Errors are displayed inline in forms
- Payment errors redirect back to payment page
- Failed payments don't create confirmed bookings
- Users can retry payment if it fails

## Testing

### Test Mode

1. Use Razorpay test keys
2. Use test card numbers:
   - Success: `4111 1111 1111 1111`
   - Failure: `4000 0000 0000 0002`
3. Use any future expiry date
4. Use any CVV

### Production

1. Switch to live Razorpay keys
2. Real payments will be processed
3. Set up webhooks for additional verification
4. Implement email confirmations

## Future Enhancements

1. **Email Confirmations**: Send booking confirmation emails
2. **Webhooks**: Set up Razorpay webhooks for payment events
3. **Refunds**: Implement refund functionality
4. **Partial Payments**: Support deposit + balance payments
5. **Booking Modifications**: Allow date changes after booking
6. **Cancellation Policy**: Implement cancellation with refunds
