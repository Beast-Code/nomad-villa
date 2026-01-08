'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Villa } from '@/types/database'

interface VillaFormProps {
  villa?: Villa
}

export default function VillaForm({ villa }: VillaFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: villa?.name || '',
    description: villa?.description || '',
    price_per_night: villa?.price_per_night || 0,
    amenities: villa?.amenities?.join(', ') || '',
    images: villa?.images?.join('\n') || '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const amenitiesArray = formData.amenities
        .split(',')
        .map((a) => a.trim())
        .filter((a) => a.length > 0)

      const imagesArray = formData.images
        .split('\n')
        .map((img) => img.trim())
        .filter((img) => img.length > 0 && img.startsWith('http'))

      const payload = {
        name: formData.name,
        description: formData.description,
        price_per_night: Number(formData.price_per_night),
        amenities: amenitiesArray,
        images: imagesArray,
      }

      const url = villa
        ? `/api/admin/villas/${villa.id}`
        : '/api/admin/villas'
      const method = villa ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save villa')
      }

      router.push('/admin/villas')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8 space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Villa Name *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description *
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={6}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Price Per Night (₹) *
        </label>
        <input
          type="number"
          value={formData.price_per_night}
          onChange={(e) =>
            setFormData({ ...formData, price_per_night: Number(e.target.value) })
          }
          min="0"
          step="0.01"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Amenities (comma-separated) *
        </label>
        <input
          type="text"
          value={formData.amenities}
          onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
          placeholder="e.g., WiFi, Pool, AC, Kitchen"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          Separate multiple amenities with commas
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Image URLs (one per line) *
        </label>
        <textarea
          value={formData.images}
          onChange={(e) => setFormData({ ...formData, images: e.target.value })}
          rows={4}
          placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          Enter image URLs, one per line. You can upload images to Supabase Storage and use those URLs.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : villa ? 'Update Villa' : 'Create Villa'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
