import { redirect } from 'next/navigation'
import { useEffect } from 'react'

export default function page() {
  redirect('/v1')
}
