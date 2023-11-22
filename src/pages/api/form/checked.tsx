import { google } from "googleapis";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    console.log("========================");
    console.log(req);
    console.log(req.headers);
    console.log(req.body);
    console.log("========================");

    const {
      hasInvestor,
      wallet,
      discord,
      twitter,
      commit,
      bookamt,
      fundname,
      Fundcommit,
      decisiontime,
      url,
    } = req.body;
    const Datetime = new Date();
    try {
      if (
        !wallet ||
        !discord ||
        !twitter ||
        !commit ||
        !bookamt ||
        !fundname ||
        !Fundcommit ||
        !decisiontime ||
        !url
      ) {
        // If starRating is not provided in the request body, send an error response.
        res.status(400).json({ error: "Data error" });
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
          range:'A1:J1',
          valueInputOption:'USER_ENTERED',
          requestBody:{
            values:[
              [
                wallet,discord,twitter,commit,bookamt,hasInvestor,fundname,Fundcommit,decisiontime,url
              ]
            ]
          }
       })

        // Here, you can handle the rating data and save it to your backend or database.
        // Example: Save the rating to a database.
        res.status(200).json({
          message: "Data submitted successfully",

          data: response.data,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
          },
        });
      }
    } catch (e: any) {
      return res.status(400).send({ message: e.message });
    }
  }
}
