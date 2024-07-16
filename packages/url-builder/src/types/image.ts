import type { CropData } from "./image-data";
import type { DirectQueryParams } from "./query-params";

type ImageIdParts = {
  assetId: string;
  dimensions: {
    height: number;
    width: number;
    aspectRatio: number;
  };
  format: string;
};

type ImageQueryInputs = {
  /**
   * The Sanity Image ID (`_id` or `_ref` field value)
   */
  id: string;

  /**
   * Use `cover` to crop the image to match the requested aspect ratio (based on
   * `width` and `height`). Use `contain` to fit the image to the boundaries
   * provided without altering the aspect ratio.
   * @default "contain"
   */
  mode?: "cover" | "contain";

  /**
   * The target width of the image in pixels.
   * @description Only used for determining the dimensions of the
   * generated assets, not for layout. Use CSS to specify how
   * the browser should render the image instead.
   */
  width?: number;

  /**
   * The target height of the image in pixels.
   * @description Only used for determining the dimensions of the
   * generated assets, not for layout. Use CSS to specify how
   * the browser should render the image instead.
   */
  height?: number;

  /**
   * The hotspot coordinates to use for the image.
   * @description Note: hotspot `width` and `height` are not used.
   */
  hotspot?: { x: number; y: number };

  /**
   * The crop coordinates to use for the image.
   */
  crop?: CropData;

  /**
   * Query string params to pass to Sanity's image CDN directly.
   */
  queryParams?: DirectQueryParams;
};

type ImageSrcInputs = ImageQueryInputs & { baseUrl: string };

export type { ImageQueryInputs, ImageIdParts, ImageSrcInputs };
