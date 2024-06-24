// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { google } from 'googleapis'
import { NextResponse } from 'next/server'
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
  try {
    const { address, contentPlatform, contentLink } = req.body;

    if (!address || !contentPlatform || !contentLink) {
      return new NextResponse('Please fill all the fields', { status: 400 })
    }

    const time = new Date()
    const Datetime = time.toLocaleString()

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
      return res.status(200).json({
        response:response
      })

      
    } catch (err) {
        return res.status(404).json({message:"Error in submitting forms"})
    }
  } catch (error) {
    return res.status(404).json({message:"Something went wrong"})
  }
}