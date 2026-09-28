/**
 * Compress an image file in the browser before upload.
 * Uses the Canvas API — no external library needed.
 *
 * @param {File} file       - original image file
 * @param {number} maxWidth - max dimension (px). Default 800
 * @param {number} quality  - JPEG quality 0–1. Default 0.82
 * @returns {Promise<File>} - compressed JPEG file
 */
export async function compressImage(file, maxWidth = 800, quality = 0.82) {
  if (!file || !file.type.startsWith("image/")) return file;

  // Skip compression for very small files (under 200 KB)
  if (file.size < 200 * 1024) return file;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;

        // Only scale down if the image is larger than maxWidth
        if (width > height && width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else if (height > maxWidth) {
          width = Math.round((width * maxWidth) / height);
          height = maxWidth;
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) return reject(new Error("Compression failed"));
            const newFile = new File(
              [blob],
              file.name.replace(/\.(jpe?g|png|webp|gif)$/i, "") + ".jpg",
              { type: "image/jpeg", lastModified: Date.now() }
            );
            resolve(newFile);
          },
          "image/jpeg",
          quality
        );
      };
      img.onerror = () => reject(new Error("Could not read image"));
      img.src = e.target.result;
    };

    reader.onerror = () => reject(new Error("Could not read file"));
    reader.readAsDataURL(file);
  });
}