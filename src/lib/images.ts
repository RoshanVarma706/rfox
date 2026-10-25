const MAX_DIMENSION = 1200;
const QUALITY = 0.72;
const MAX_FILE_BYTES = 12 * 1024 * 1024;

function readAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read that file"));
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("That file isn't a readable image"));
    image.src = src;
  });
}

/**
 * Downscales and re-encodes a photo so a handful of uploads stay inside the
 * browser's storage quota. Returns a JPEG data URL ready to save on a product.
 */
export async function compressImageFile(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error(`${file.name} isn't an image`);
  if (file.size > MAX_FILE_BYTES) throw new Error(`${file.name} is larger than 12 MB`);

  const dataUrl = await readAsDataUrl(file);
  const image = await loadImage(dataUrl);
  const scale = Math.min(1, MAX_DIMENSION / Math.max(image.width, image.height));
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) return dataUrl;

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.drawImage(image, 0, 0, width, height);
  return canvas.toDataURL("image/jpeg", QUALITY);
}

export function isUsableImageUrl(value: string) {
  const url = value.trim();
  if (!url) return false;
  if (url.startsWith("/")) return true;
  return /^https?:\/\/.+\..+/i.test(url);
}
