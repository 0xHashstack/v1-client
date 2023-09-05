import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { starRating, address } = req.body;
    
    if (starRating === undefined) {
      // If starRating is not provided in the request body, send an error response.
      res.status(400).json({ error: 'starRating is required' });
    } else {
      console.log(address, "address");
      
      // Here, you can handle the rating data and save it to your backend or database.
      // Example: Save the rating to a database.
      res.status(200).json(
        { 
          message: 'Rating submitted successfully',
          rating:starRating
        }
        );
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
