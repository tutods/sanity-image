/**
 * Image cropping information
 */
type CropData = {
  bottom: number;
  left: number;
  right: number;
  top: number;
};

type HotspotData = {
  x: number;
  y: number;
};

type Asset = {
  _id: string;
  crop?: CropData;
  hotspot?: HotspotData;
};

type ComputedImageData = {
  /**
   * Full URL to the image
   */
  src: string;

  /**
   * Actual output width of the image in pixels
   */
  width: number;

  /**
   * Actual output height of the image in pixels
   */
  height: number;
};

export type { CropData, HotspotData, Asset, ComputedImageData };
