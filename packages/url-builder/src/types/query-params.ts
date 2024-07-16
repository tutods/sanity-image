/**
 * Query string params to pass to Sanity's image CDN directly.
 */
type DirectQueryParams = {
  /**
   * Blur 1-2000.
   */
  blur?: number;

  /**
   * Flipping. Flip image horizontally, vertically or both. Possible values: h,
   * v, hv.
   */
  flip?: "h" | "v" | "hv";

  /**
   * Format. Convert image to jpg, pjpg, png, or webp. Note: like other query
   * string params, this doesn't work on SVG source images.
   */
  fm?: "jpg" | "pjpg" | "png" | "webp";

  /**
   * Quality 0-100. Specify the compression quality (where applicable). Defaults
   * to 75 for JPG and WebP.
   */
  q?: number;

  /**
   * Saturation. Currently the asset pipeline only supports `sat=-100`, which
   * renders the image with grayscale colors. Support for more levels of
   * saturation is planned for later.
   */
  sat?: -100;

  /**
   * Sharpen 0-100.
   */
  sharpen?: number;
};

type ImageQueryParams = DirectQueryParams & {
  /**
   * Enables support for serving alternate image formats to supporting browsers
   **/
  auto: "format";

  /**
   * SanityImage `cover` mode → `fit=crop`; SanityImage `contain` mode →
   * `fit=max`
   */
  fit: "crop" | "max";

  /**
   * Focal point (x) between 0 and 1. For non-terminal decimal values, use a
   * string rounded to 3 decimal places.
   */
  "fp-x"?: number;
  /**
   * Focal point (x) between 0 and 1. For non-terminal decimal values, use a
   * string rounded to 3 decimal places.
   */
  "fp-y"?: number;

  /**
   * Rect string in the format `x,y,w,h` where `x` and `y` are the top-left
   * corner of the crop, and `w` and `h` are the width and height of the crop.
   * Pixel values.
   */
  rect?: string;

  /**
   * Width of the image in pixels
   */
  w: number;

  /**
   * Height of the image in pixels
   */
  h?: number;

  /**
   * This tells the Sanity Image API to focus on the most interesting part of
   * the image when cropping. Only used if no hotspot is provided and the image
   * is being cropped.
   */
  crop?: "entropy";

  /**
   * Quality of the image from 0 to 100. Defaults to 75.
   */
  q: number;

  /**
   * Image query param metadata for testing and diagnostic purposes.
   */
  metadata?: {
    sourceDimensions: { width: number; height: number; aspectRatio: number };
    outputDimensions: { width: number; height: number; aspectRatio: number };
  };
};

export type { DirectQueryParams, ImageQueryParams };
