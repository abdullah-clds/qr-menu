const MAX_DIMENSION = 1600;
const QUALITY = 0.85;

/**
 * Downscales an image file in the browser (max ~1600px long edge) and
 * re-encodes it as WEBP when possible, to keep uploads small. Falls back
 * to the original file if canvas processing is unavailable or fails —
 * the backend validates and enforces limits regardless.
 */
export async function resizeImageFile(file) {
  if (!file.type.startsWith("image/")) return file;

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(bitmap, 0, 0, width, height);

    const blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/webp", QUALITY)
    );

    if (!blob || blob.size >= file.size) {
      return file;
    }

    const newName = file.name.replace(/\.[^.]+$/, "") + ".webp";
    return new File([blob], newName, { type: "image/webp" });
  } catch {
    return file;
  }
}
