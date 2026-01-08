import Link from 'next/link'
import LogoutButton from './LogoutButton'

export default function AdminNavbar() {
  return (
    <nav className="fixed top-0 w-full bg-white border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/admin/dashboard" className="text-xl font-bold text-gray-900">
            Nomad Villa Admin
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/admin/villas" className="text-gray-700 hover:text-gray-900 transition">
              Villas
            </Link>
            <Link href="/admin/bookings" className="text-gray-700 hover:text-gray-900 transition">
              Bookings
            </Link>
            <Link href="/" className="text-gray-700 hover:text-gray-900 transition">
              View Site
            </Link>
            <LogoutButton />
          </div>
        </div>
      </div>
    </nav>
  )
}
