// pages/api/upload-screenshot.js
import type { NextApiRequest, NextApiResponse } from 'next'
import s3 from '../../../utils/aws';
export default async  function handler(req:NextApiRequest, res:NextApiResponse) {
    if (req.method === 'POST') {
      // Get the screenshot data from the request body
      const {address, title,description, screenshot } = req.body;

      const params={
        Bucket:'bugsfeedback',
        Key: `screenshots/${Date.now()}_screenshot.png`,
        Body:Buffer.from(screenshot, 'base64'),
        ContentType:'image/png'
      }
      try{
        console.log(Buffer.from(screenshot, 'base64'))
        // await s3.upload(params).promise();
        // console.log('Screenshot uploaded successfully');
      }catch(err){
        console.log(err,"aws")
      }
  
      // Process the screenshot data, e.g., save it to a file or a database
      // You may need to decode the data URL and save it as an image file
  
      // Send a response back to the frontend
      res.status(200).json({ message: 'Bug reported successfully' });
    } else {
      res.status(405).end(); // Method Not Allowed
    }
  }
  