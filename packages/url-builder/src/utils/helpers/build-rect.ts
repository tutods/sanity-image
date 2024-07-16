import type { CropData } from "@/types";
import { croppedImageSize } from "./cropped-image-size";

/**
 * Build a `rect` value to crop the image.
 */
const buildRect = (
  /** Source/original image dimensions */
  dimensions: { width: number; height: number },
  crop: CropData,
): string => {
  const { width, height } = croppedImageSize(dimensions, crop);

  return [
    Math.round(crop.left * dimensions.width),
    Math.round(crop.top * dimensions.height),
    width,
    height,
  ].join(",");
};

export { buildRect };
