import multer from "multer";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

export const AVATAR_UPLOAD_DIR = path.resolve(__dirname, "../../../uploads/avatars");
if (!fs.existsSync(AVATAR_UPLOAD_DIR)) {
  fs.mkdirSync(AVATAR_UPLOAD_DIR, { recursive: true });
}

const storage = multer.memoryStorage();
export const avatarUpload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (_req, file, cb) => {
    if (["image/jpeg", "image/png", "image/webp"].includes(file.mimetype)) {
      cb(null, true);
    }
    else {
      cb(new Error("Only JPEG, PNG, and WEBP images are allowed"));
    }
  },
});

export async function processAndSaveAvatar(userId: string, file: Express.Multer.File): Promise<string> {
  const ext = file.mimetype.split("/")[1];
  const filename = `${userId}.${ext}`;
  const filepath = path.join(AVATAR_UPLOAD_DIR, filename);
  await sharp(file.buffer)
    .resize(256, 256)
    .toFile(filepath);
  return `/uploads/avatars/${filename}`;
}
