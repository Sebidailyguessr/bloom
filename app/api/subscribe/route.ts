export async function POST(request: Request) {
  const body = await request.json()
  const email: unknown = body?.email

  if (!email || typeof email !== 'string') {
    return Response.json({ error: 'Invalid email' }, { status: 400 })
  }

  const formId = process.env.KIT_FORM_ID
  const apiKey = process.env.KIT_API_KEY

  try {
    const res = await fetch(`https://api.convertkit.com/v3/forms/${formId}/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_key: apiKey, email }),
    })

    if (!res.ok) {
      const data = await res.json().catch(() => ({})) as { message?: string }
      return Response.json({ error: data.message ?? 'Subscription failed' })
    }

    const data = await res.json() as { subscription?: { state?: string } }

    // v3: state "active" means already confirmed — subscriber existed
    if (data.subscription?.state === 'active') {
      return Response.json({ alreadySubscribed: true })
    }

    return Response.json({ success: true })
  } catch {
    return Response.json({ error: 'Something went wrong' })
  }
}
