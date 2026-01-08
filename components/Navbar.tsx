import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-sm z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold text-gray-900">
            Nomad Villa
          </Link>
          <div className="flex gap-6">
            <Link href="/villas" className="text-gray-700 hover:text-gray-900 transition">
              Villas
            </Link>
            <Link href="/admin" className="text-gray-700 hover:text-gray-900 transition">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
