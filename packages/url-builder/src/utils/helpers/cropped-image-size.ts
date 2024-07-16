import type { CropData, ImageIdParts } from "@/types";

const croppedImageSize = (
  /** Source/original image dimensions */
  dimensions: { width: number; height: number },
  crop: CropData,
): ImageIdParts["dimensions"] => {
  if (crop.left + crop.right >= 1 || crop.top + crop.bottom >= 1) {
    throw new Error(
      `Invalid crop: ${JSON.stringify(crop)}; crop values must be less than 1`,
    );
  }

  const width = Math.round(dimensions.width * (1 - crop.left - crop.right));
  const height = Math.round(dimensions.height * (1 - crop.top - crop.bottom));
  const aspectRatio = width / height;

  return { width, height, aspectRatio };
};

export { croppedImageSize };
