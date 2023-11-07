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

    const {check,wallet,discord,twitter,commit,bookamt } = req.body;
    const Datetime = new Date();
    try {
      if (!wallet || !discord || !twitter || !commit || !bookamt ) {
        // If starRating is not provided in the request body, send an error response.
        res.status(400).json({ error: "Data error" });
      } else if(check) {
        res.status(400).json({ error: "Data error. Called Unchecked on checked data" });
        
      }else{

        const response = {data:`DATA recieved :-Wallet - ${wallet},Dsicord - ${discord},Twitter - ${twitter},Commit amount-${commit},Bookamt-${bookamt}`};

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
