import Link from "next/link"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="bg-white">
        {/* ================= HERO ================= */}
        {/* Floating Villa Shapes */}
<div className="absolute inset-0 overflow-hidden pointer-events-none">
  <div className="absolute left-10 top-32 w-40 h-24 rounded-xl border border-black/10 animate-float-slow" />
  <div className="absolute right-12 top-48 w-56 h-32 rounded-2xl border border-black/10 animate-float-medium" />
  <div className="absolute left-1/3 bottom-24 w-48 h-28 rounded-xl border border-black/10 animate-float-fast" />
</div>

<section className="pt-28 pb-16 bg-white">
  <div className="max-w-7xl mx-auto px-4 text-center">
    {/* Headline */}
    <h1 className="text-[2.4rem] md:text-6xl font-semibold text-gray-900 leading-tight tracking-tight">
      Discover extraordinary villas
      <br />
      <span className="font-normal text-gray-700">
        around the world
      </span>
    </h1>
    <p className="mt-2 text-xs tracking-widest uppercase text-gray-400">
  Curated luxury residences
</p>

    {/* Subheading */}
    <p className="mt-4 text-base md:text-lg text-gray-500 max-w-2xl mx-auto">
      Handpicked luxury stays for discerning travelers
    </p>

    {/* Elegant divider */}
    <div className="mt-8 flex justify-center">
      <div className="w-16 h-[1px] bg-gray-300" />
    </div>

    {/* Search Card */}
    <div className="mt-10 max-w-3xl mx-auto bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] p-4">
      <div className="flex flex-col gap-3">
        <div className="border rounded-xl px-4 py-3 text-left">
          <p className="text-xs font-medium text-gray-700">Where</p>
          <p className="text-gray-400 text-sm">Search destinations</p>
        </div>

        <div className="border rounded-xl px-4 py-3 text-left">
          <p className="text-xs font-medium text-gray-700">Check in</p>
          <p className="text-gray-400 text-sm">Add dates</p>
        </div>

        <div className="border rounded-xl px-4 py-3 text-left">
          <p className="text-xs font-medium text-gray-700">Check out</p>
          <p className="text-gray-400 text-sm">Add dates</p>
        </div>

        <Link
          href="/villas"
          className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-gray-900 py-3 text-white text-sm font-medium hover:bg-black transition"
        >
          <span>Search villas</span>
          <span>🔍</span>
        </Link>
      </div>
    </div>
  </div>
</section>


        {/* ================= FEATURED VILLAS ================= */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
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
                      <h3 className="font-semibold">{villa.title}</h3>
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
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
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
                    <h3 className="font-semibold text-lg">{loc.name}</h3>
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
