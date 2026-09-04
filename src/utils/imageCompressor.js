/**
 * Ultra-fast client-side image compressor using HTML5 Canvas
 * Reduces 5MB-15MB raw phone/camera photos down to ~80-150KB in milliseconds
 */
export async function compressImage(file, maxWidth = 1000, quality = 0.8) {
  return new Promise((resolve) => {
    // If not an image, return original
    if (!file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => resolve({ dataUrl: reader.result, blob: file });
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate aspect ratio
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);

        canvas.toBlob(
          (blob) => {
            resolve({
              dataUrl,
              blob: blob || file
            });
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = () => {
        // Fallback to original
        resolve({ dataUrl: e.target.result, blob: file });
      };
      img.src = e.target.result;
    };
    reader.onerror = () => {
      resolve({ dataUrl: null, blob: file });
    };
    reader.readAsDataURL(file);
  });
}
