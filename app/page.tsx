import Link from "next/link"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="bg-white">
        {/* ================= HERO ================= */}
        <section className="pt-28 pb-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 text-center">
            {/* Headline */}
            <h1 className="text-[2.6rem] sm:text-5xl md:text-6xl font-semibold text-gray-900 leading-tight tracking-tight">
              Discover extraordinary villas
              <br />
              <span className="font-normal text-gray-600">
                around the world
              </span>
            </h1>

            {/* Eyebrow text */}
            <p className="mt-3 text-xs tracking-[0.25em] uppercase text-gray-400">
              Curated luxury residences
            </p>

            {/* Subheading */}
            <p className="mt-5 text-base md:text-lg text-gray-500 max-w-2xl mx-auto">
              Handpicked luxury stays for discerning travelers
            </p>

            {/* Divider */}
            <div className="mt-8 flex justify-center">
              <div className="w-14 h-[1px] bg-gray-300" />
            </div>

            {/* Search Bar (UI only) */}
            <div className="mt-12 max-w-4xl mx-auto bg-white rounded-full shadow-[0_18px_50px_rgba(0,0,0,0.12)] px-4 py-3">
              <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-3 text-left">
                <div className="px-4 py-2">
                  <p className="text-xs font-medium text-gray-700">Where</p>
                  <p className="text-sm text-gray-400">Search destinations</p>
                </div>

                <div className="px-4 py-2 border-t md:border-t-0 md:border-l">
                  <p className="text-xs font-medium text-gray-700">Check in</p>
                  <p className="text-sm text-gray-400">Add dates</p>
                </div>

                <div className="px-4 py-2 border-t md:border-t-0 md:border-l">
                  <p className="text-xs font-medium text-gray-700">Check out</p>
                  <p className="text-sm text-gray-400">Add dates</p>
                </div>

                <div className="flex justify-end px-2">
                  <Link
                    href="/villas"
                    className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-900 text-white hover:bg-black transition"
                  >
                    🔍
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= FEATURED VILLAS ================= */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-semibold text-gray-900 mb-2">
              Featured luxury villas
            </h2>
            <p className="text-gray-600 mb-10">
              Handpicked exceptional stays
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "Bali, Indonesia",
                  price: "₹6,500",
                  image:
                    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
                },
                {
                  title: "Los Angeles, USA",
                  price: "₹12,500",
                  image:
                    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
                },
                {
                  title: "Phuket, Thailand",
                  price: "₹7,200",
                  image:
                    "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea",
                },
                {
                  title: "Aspen, USA",
                  price: "₹21,000",
                  image:
                    "https://images.unsplash.com/photo-1600573472591-ee6c1fcd6b15",
                },
              ].map((villa, i) => (
                <div
                  key={i}
                  className="rounded-2xl overflow-hidden bg-white shadow hover:shadow-lg transition"
                >
                  <img
                    src={villa.image}
                    alt={villa.title}
                    className="h-56 w-full object-cover"
                  />
                  <div className="p-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">{villa.title}</h3>
                      <span className="text-sm">⭐ 4.9</span>
                    </div>
                    <p className="text-gray-600 text-sm mt-1">
                      {villa.price} / night
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= LOCATIONS ================= */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-semibold text-gray-900 mb-8">
              Popular locations
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: "Bali", count: "127 villas" },
                { name: "Santorini", count: "89 villas" },
                { name: "Tuscany", count: "156 villas" },
                { name: "Paris", count: "203 villas" },
              ].map((loc, i) => (
                <div
                  key={i}
                  className="relative rounded-2xl overflow-hidden h-56"
                >
                  <img
                    src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-4 text-white">
                    <h3 className="font-medium text-lg">{loc.name}</h3>
                    <p className="text-sm">{loc.count}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
