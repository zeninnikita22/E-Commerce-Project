import { Storage } from "@google-cloud/storage";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).send("Method Not Allowed");
  }

  // Replace these with your Google Cloud Storage details
  const bucketName = "silk-touch";
  const fileName = "Images/Categories/Bedding/bedding2.jpg";
  const keyFileName = "../../../../../wise-chalice-402217-410eaaf4078e.json";

  const storage = new Storage({ keyFilename: keyFileName });
  const options = {
    version: "v4",
    action: "read",
    expires: Date.now() + 15 * 60 * 1000, // 15 minutes
  };

  try {
    const [url] = await storage
      .bucket(bucketName)
      .file(fileName)
      .getSignedUrl(options);

    res.status(200).json({ url });
  } catch (error) {
    console.error(error);
    res.status(500).send("Unable to generate signed URL");
  }
}
