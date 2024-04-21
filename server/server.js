const { createC2pa, createTestSigner, ManifestBuilder } = require("c2pa-node");
const path = require("path");
const multer = require("multer");
const express = require("express");
const cors = require("cors");

const app = express();
const port = 3000;
const upload = multer({ dest: "uploads/" });

app.use(cors())

async function sign(uploadedImage, manifest) {
  const imagesDir = process.cwd() + "uploads/";
  const asset = {
    path: path.join(imagesDir, uploadedImage),
  };
  const signedImage = "signed_" + uploadedImage;
  const outputPath = path.join(imagesDir, signedImage);
  const signer = await createTestSigner();
  const c2pa = createC2pa({
    signer,
  });

  const { signedAsset, signedManifest } = await c2pa.sign({
    manifest,
    asset,
    options: {
      outputPath,
    },
  });

  return signedAsset.path;
}

app.post("/api/sign", upload.single("uploaded_image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image provided" });
    }

    const imageFile = req.file;
    const fileName = imageFile.name;
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

    const signedImage = sign(fileName, manifest);
    res.download(signedImage);
  } catch (error) {
    console.error("Error signing image: ", error);
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
