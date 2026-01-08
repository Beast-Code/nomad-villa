# Nomad Villa - Luxury Villa Rental Platform

A complete MVP web application for a boutique villa rental brand built with Next.js, Supabase, and Razorpay.

## 🚀 Features

### Public Features
- **Luxury Landing Page** - Beautiful hero section with call-to-action
- **Villas Listing** - Grid view of all available villas with images and pricing
- **Villa Details** - Detailed view with image gallery, amenities, and booking form
- **Availability Calendar** - Real-time availability checking
- **Booking Flow** - Guest details collection and secure payment processing
- **Payment Integration** - Razorpay payment gateway integration
- **Booking Confirmation** - Confirmation page after successful payment

### Admin Features
- **Admin Authentication** - Secure login with Supabase Auth
- **Dashboard** - Overview of villas, bookings, and revenue
- **Villa Management** - Create, edit, and manage villas
- **Image Management** - Upload and manage villa images
- **Date Blocking** - Block unavailable dates for maintenance or events
- **Booking Management** - View all bookings with filters and details

## 🛠️ Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage (for images)
- **Payment**: Razorpay
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account (free tier works)
- Razorpay account (test mode for development)

## 🔧 Setup Instructions

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd nomad-villa
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the schema from `supabase/schema.sql`
3. Go to Settings > API and copy:
   - Project URL
   - `anon` public key
   - `service_role` secret key (keep this secure!)

### 3. Set Up Razorpay

1. Create an account at [razorpay.com](https://razorpay.com)
2. Go to Settings > API Keys
3. Generate test keys (Key ID and Key Secret)

### 4. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Razorpay Configuration
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Create Admin User

1. Go to Supabase Dashboard > Authentication > Users
2. Click "Add User" > "Create new user"
3. Set email and password (remember these for admin login)
4. The user will be able to access `/admin/login`

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
nomad-villa/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin pages (protected)
│   ├── api/               # API routes
│   ├── bookings/          # Booking pages
│   ├── villas/            # Villa pages
│   └── page.tsx           # Landing page
├── components/            # React components
├── lib/                   # Utility functions
│   ├── supabase/         # Supabase clients
│   └── razorpay.ts       # Razorpay setup
├── types/                 # TypeScript types
├── supabase/             # Database schema
│   └── schema.sql        # SQL schema
└── public/               # Static assets
```

## 🗄️ Database Schema

The database consists of three main tables:

1. **villas** - Villa information (name, description, price, amenities, images)
2. **bookings** - Booking records (guest info, dates, payment status)
3. **blocked_dates** - Unavailable dates for villas

See `supabase/schema.sql` for the complete schema.

## 💳 Payment Flow

1. Guest selects dates and fills booking form
2. System creates a Razorpay order
3. Guest is redirected to Razorpay payment page
4. After payment, Razorpay redirects back with payment details
5. Server verifies payment signature
6. Booking status updated to "paid"
7. Confirmation page shown to guest

## 🚢 Deployment to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Add environment variables (same as `.env.local`)
5. Click "Deploy"

### 3. Update Environment Variables

After deployment, update `NEXT_PUBLIC_APP_URL` in Vercel:
- Go to Project Settings > Environment Variables
- Update `NEXT_PUBLIC_APP_URL` to your Vercel URL (e.g., `https://your-app.vercel.app`)

### 4. Configure Razorpay Webhook (Optional)

For production, set up Razorpay webhooks:
1. Go to Razorpay Dashboard > Settings > Webhooks
2. Add webhook URL: `https://your-app.vercel.app/api/webhooks/razorpay`
3. Select events: `payment.captured`, `payment.failed`

## 📝 Admin Usage

1. Navigate to `/admin/login`
2. Login with your Supabase admin credentials
3. Access dashboard at `/admin/dashboard`
4. Manage villas, bookings, and blocked dates

## 🔒 Security Notes

- Admin routes are protected by Supabase Auth
- Service role key should NEVER be exposed to client-side code
- Razorpay signatures are verified server-side
- Row Level Security (RLS) policies are configured in Supabase

## 🎨 Customization

### Styling
- Tailwind CSS configuration: `tailwind.config.ts`
- Global styles: `app/globals.css`
- Components use Tailwind utility classes

### Images
- Currently uses external image URLs
- For production, upload images to Supabase Storage
- Update image URLs in villa forms

## 🐛 Troubleshooting

### Supabase Connection Issues
- Verify environment variables are correct
- Check Supabase project is active
- Ensure RLS policies allow public reads

### Razorpay Payment Issues
- Verify Razorpay keys are correct
- Check if using test mode keys in development
- Ensure amount is in paise (multiply by 100)

### Admin Login Issues
- Verify user exists in Supabase Auth
- Check email/password are correct
- Ensure user has proper permissions

## 📄 License

This project is private and proprietary.

## 🤝 Support

For issues or questions, please contact the development team.

---

Built with ❤️ for Nomad Villa
