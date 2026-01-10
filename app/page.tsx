import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* ================= STUNNING HERO SECTION ================= */}
        <section className="relative h-screen overflow-hidden bg-black text-white">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center scale-110"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=2400')",
            }}
          />

          {/* Luxury Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/40 to-black/90" />

          {/* Soft Color Glows */}
          <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-amber-500/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[120px]" />

          {/* Content */}
          <div className="relative z-10 h-full flex items-center justify-center px-4">
            <div className="max-w-6xl text-center">
              {/* Eyebrow */}
              <p className="uppercase tracking-[0.3em] text-xs sm:text-sm text-amber-400 mb-6">
                Nomad Villa Collection
              </p>

              {/* Headline (mobile first) */}
              <h1 className="text-4xl sm:text-5xl md:text-7xl xl:text-8xl font-extrabold leading-tight mb-6">
                Stay{' '}
                <span className="block sm:inline text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
                  Extraordinary
                </span>
              </h1>

              {/* Subheading */}
              <p className="text-base sm:text-lg md:text-2xl text-gray-200 max-w-xl sm:max-w-3xl mx-auto mb-10">
                Luxury villas crafted for privacy, comfort, and unforgettable
                escapes.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
                <Link
                  href="/villas"
                  className="w-full sm:w-auto px-10 py-4 rounded-xl text-lg font-semibold bg-gradient-to-r from-amber-400 to-amber-600 text-black hover:scale-105 transition shadow-2xl"
                >
                  Explore Luxury Villas
                </Link>

                <Link
                  href="/admin"
                  className="w-full sm:w-auto px-10 py-4 rounded-xl text-lg font-semibold border border-white/30 text-white hover:bg-white/10 transition"
                >
                  Admin Dashboard
                </Link>
              </div>

              {/* Trust Signals */}
              <div className="mt-12 flex flex-wrap justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-gray-300">
                <span>⭐ 4.9 Guest Rating</span>
                <span>🏊 Private Pools</span>
                <span>🔒 Secure Booking</span>
                <span>📍 Prime Locations</span>
              </div>
            </div>
          </div>
        </section>

        {/* ================= FEATURES SECTION ================= */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">
              Why Choose Nomad Villa?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="text-6xl mb-6">🏖️</div>
                <h3 className="text-2xl font-semibold mb-3">Luxury Villas</h3>
                <p className="text-gray-600">
                  Carefully curated villas with premium interiors and world-class
                  amenities.
                </p>
              </div>

              <div className="text-center">
                <div className="text-6xl mb-6">🔒</div>
                <h3 className="text-2xl font-semibold mb-3">Secure Booking</h3>
                <p className="text-gray-600">
                  Reliable and secure booking flow with trusted payment gateways.
                </p>
              </div>

              <div className="text-center">
                <div className="text-6xl mb-6">✨</div>
                <h3 className="text-2xl font-semibold mb-3">
                  Premium Experience
                </h3>
                <p className="text-gray-600">
                  Designed for families, couples, and luxury travelers.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= CTA SECTION ================= */}
        <section className="py-24 bg-gray-100">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h2 className="text-4xl font-bold mb-6 text-gray-900">
              Your Luxury Escape Awaits
            </h2>
            <p className="text-xl text-gray-600 mb-10">
              Browse our exclusive villas and book your perfect stay in minutes.
            </p>

            <Link
              href="/villas"
              className="inline-block bg-gray-900 text-white px-10 py-4 rounded-xl font-semibold text-lg hover:bg-gray-800 transition shadow-lg"
            >
              View All Villas
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
