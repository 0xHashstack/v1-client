import { google } from 'googleapis';
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { starRating, address } = req.body;
    const Datetime=new Date();
    try{
      if (starRating === undefined) {
        // If starRating is not provided in the request body, send an error response.
        res.status(400).json({ error: 'starRating is required' });
      } else {
       const auth=new google.auth.GoogleAuth({
        credentials:{
          client_email:process.env.NEXT_PUBLIC_GOOGLE_CLIENT_EMAIL,
          private_key:process.env.NEXT_PUBLIC_GOOGLE_PRIVATE_KEY?.replace(/\\n/g,"\n")
        },
        scopes:[
          'https://www.googleapis.com/auth/drive',
          'https://www.googleapis.com/auth/drive.file',
          'https://www.googleapis.com/auth/spreadsheets'
        ]
       })
       const sheets=google.sheets({
        auth,
        version:'v4'
       })

       const response=await sheets.spreadsheets.values.append({
          spreadsheetId:process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID,
          range:'A1:C1',
          valueInputOption:'USER_ENTERED',
          requestBody:{
            values:[
              [
                Datetime,address,starRating
              ]
            ]
          }
       })
        
        // Here, you can handle the rating data and save it to your backend or database.
        // Example: Save the rating to a database.
        res.status(200).json(
          { 
            message: 'Rating submitted successfully',
            rating:starRating,
            data:response.data
          }
          );
      }
    } 
    catch(e:any){
      return res.status(400).send({message:e.message})
    }
  }
}
