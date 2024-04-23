import path from "path";
import { createC2pa, createTestSigner, ManifestBuilder } from "c2pa-node";
import crypto from "crypto";

export async function sign(uploadedImage: string, manifest: ManifestBuilder) {
  const imagesDir = process.cwd() + "/uploads/";
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

export function generateUniqueFileName(
  originalFileName: string,
  bytes = 32
): string {
  const randomString = crypto.randomBytes(bytes).toString("hex");
  const fileExtension = originalFileName.split(".").pop();
  return `${randomString}.${fileExtension}`;
}
