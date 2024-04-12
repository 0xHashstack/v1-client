// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { google } from 'googleapis'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const { address, contentPlatform, contentLink } = body

    if (!address || !contentPlatform || !contentLink) {
      return new NextResponse('Please fill all the fields', { status: 400 })
    }

    const time = new Date()
    const Datetime = time.getTime()

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_EMAIL,
        private_key: process.env.NEXT_PUBLIC_GOOGLE_PRIVATE_KEY?.replace(
          /\\n/g,
          '\n'
        ),
      },
      scopes: [
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/drive.file',
        'https://www.googleapis.com/auth/spreadsheets',
      ],
    })

    const sheets = google.sheets({
      auth,
      version: 'v4',
    })

    try {
      const response = await sheets.spreadsheets.values.append({
        spreadsheetId: process.env.NEXT_PUBLIC_GOOGLE_SHEET_SUBMISSION_ID,
        range: 'A1:F1',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [[Datetime, address, contentPlatform, contentLink]],
        },
      })

      return new NextResponse('Form submitted successfully', { status: 500 })
    } catch (err) {
      return new NextResponse('Something Broke !!! Sorry :(', { status: 400 })
    }
  } catch (error) {
    return new NextResponse('Something Broke !!! Sorry :(', { status: 400 })
  }
}
