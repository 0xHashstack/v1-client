// pages/api/upload-screenshot.js
import type { NextApiRequest, NextApiResponse } from 'next'
import s3 from '../../../utils/aws';
import { google } from 'googleapis';
export default async  function handler(req:NextApiRequest, res:NextApiResponse) {
    if (req.method === 'POST') {
      // Get the screenshot data from the request body
      const {address, title,description, screenshot } = req.body;
      const base64str=screenshot.replace(/^data:image\/\w+;base64,/,'');
      const time = new Date();
      const Datetime=time.getTime();
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
       const params={
        Bucket:'common-static-assets',
        Key: process.env.NEXT_PUBLIC_NODE_ENV=="testnet" ?`feedback-test/${Datetime}_screenshot.png` :`feedback/${Datetime}_screenshot.png`,
        Body:Buffer.from(base64str,'base64'),
        ContentType:'image/png',
      }
      
      const fetchParams = {
        Bucket: 'common-static-assets',
        Key:process.env.NEXT_PUBLIC_NODE_ENV=="testnet" ?`feedback-test/${Datetime}_screenshot.png` :`feedback/${Datetime}_screenshot.png`,
      };
      try{
        if(screenshot){
          // await s3.upload(params).promise();
          // console.log('Screenshot uploaded successfully');
          const upload=await s3.upload(params).promise();
          if(upload){
            const data=process.env.NEXT_PUBLIC_NODE_ENV=="testnet" ?`https://${params.Bucket}.s3.ap-southeast-1.amazonaws.com/feedback-test/${Datetime}_screenshot.png`:`https://common-static-assets.s3.ap-southeast-1.amazonaws.com/feedback/${Datetime}_screenshot.png`
            const response=await sheets.spreadsheets.values.append({
              spreadsheetId:process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID_SUGGESTIONS,
              range:'A1:E1',
              valueInputOption:'USER_ENTERED',
              requestBody:{
                values:[
                  [
                    Datetime,address,title,description,data
                  ]
                ]
              }
           })
           res.status(200).json(
             { 
               message: 'Bug reported  successfully',
               data:response.data
             }
             );
          }else{
            res.status(400).json({ error: 'Something went wrong' });
          }
        }else{
          if(!title ||!description){
            res.status(400).json({ error: 'Title and description is required' });
            return;
          }
          const response=await sheets.spreadsheets.values.append({
            spreadsheetId:process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID_SUGGESTIONS,
            range:'A1:E1',
            valueInputOption:'USER_ENTERED',
            requestBody:{
              values:[
                [
                  Datetime,address,title,description,screenshot
                ]
              ]
            }
         })
         res.status(200).json(
           { 
             message: 'Suggestion received successfully',
             data:response.data
           }
           );
        }
      }catch(err){
        console.log(err,"aws")
      }
  
      // Process the screenshot data, e.g., save it to a file or a database
      // You may need to decode the data URL and save it as an image file
  
      // Send a response back to the frontend

    } else {
      res.status(405).end(); // Method Not Allowed
    }
  }
  