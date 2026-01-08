import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { villaId, date, reason } = body

    if (!villaId || !date) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const adminSupabase = createAdminClient()
    const { data, error } = await adminSupabase
      .from('blocked_dates')
      .insert({
        villa_id: villaId,
        date,
        reason: reason || null,
      })
      .select()
      .single()

    if (error) {
      console.error('Error blocking date:', error)
      // Check if it's a duplicate
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'This date is already blocked' },
          { status: 400 }
        )
      }
      return NextResponse.json(
        { error: 'Failed to block date' },
        { status: 500 }
      )
    }

    return NextResponse.json({ blockedDate: data })
  } catch (error: any) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
