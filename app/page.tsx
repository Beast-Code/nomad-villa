import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1920')] bg-cover bg-center opacity-30"></div>
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Welcome to Nomad Villa
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200">
              Experience luxury like never before. Your perfect escape awaits.
            </p>
            <Link
              href="/villas"
              className="inline-block bg-white text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition transform hover:scale-105"
            >
              Explore Our Villas
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
              Why Choose Nomad Villa?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-5xl mb-4">🏖️</div>
                <h3 className="text-xl font-semibold mb-2">Luxury Villas</h3>
                <p className="text-gray-600">
                  Handpicked premium villas with world-class amenities
                </p>
              </div>
              <div className="text-center">
                <div className="text-5xl mb-4">🔒</div>
                <h3 className="text-xl font-semibold mb-2">Secure Booking</h3>
                <p className="text-gray-600">
                  Safe and secure payment processing for your peace of mind
                </p>
              </div>
              <div className="text-center">
                <div className="text-5xl mb-4">✨</div>
                <h3 className="text-xl font-semibold mb-2">Unforgettable Experience</h3>
                <p className="text-gray-600">
                  Create memories that last a lifetime
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gray-100">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h2 className="text-4xl font-bold mb-6 text-gray-900">
              Ready to Book Your Stay?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Browse our collection of luxury villas and find your perfect getaway.
            </p>
            <Link
              href="/villas"
              className="inline-block bg-gray-900 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-800 transition"
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
