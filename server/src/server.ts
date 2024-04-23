import multer from "multer";
import express, { Express, Request, Response } from "express";
import cors from "cors";
import { ManifestBuilder } from "c2pa-node";
import { sign, generateUniqueFileName } from "./helpers";

const app: Express = express();
const port = 3000;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Destination folder for storing uploaded files
  },
  filename: (req, file, cb) => {
    // Generate a unique filename
    const uniqueFileName = generateUniqueFileName(file.originalname);
    cb(null, uniqueFileName);
  },
});
const upload = multer({ storage });

app.use(cors());

app.post(
  "/api/sign",
  upload.single("image"),
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No image provided" });
      }

      const imageFile = req.file;
      const fileName = imageFile.filename;
      let extension = fileName.split(".").pop();
      if (extension === "jpg") {
        extension = "jpeg";
      }

      // Build Manifest
      const manifest = new ManifestBuilder({
        claim_generator: "ExpressAuth/1.0.0",
        format: `image/${extension}`,
        title: fileName,
        assertions: [
          {
            label: "c2pa.actions",
            data: {
              actions: [
                {
                  action: "c2pa.created",
                },
              ],
            },
          },
        ],
      });

      const signedImagePath = await sign(fileName, manifest);
      res.download(signedImagePath, `signed_${req.file.originalname}`);
    } catch (error) {
      console.error("Error signing image: ", error);
    }
  }
);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
