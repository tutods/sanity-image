import type { ImageQueryInputs } from "./image";
import type { DirectQueryParams } from "./query-params";

type SanityImageProps = ImageQueryInputs & {
  preview?: string;

  /**
   * The base url for the Sanity CDN including project ID and dataset. If not
   * provided, the `projectId` and `dataset` props will be used to construct the
   * URL.
   */
  baseUrl?: string;

  /**
   * The Sanity project ID to use for the image URL. If preferred, the `baseUrl`
   * prop can be provided instead.
   */
  projectId?: string;

  /**
   * The Sanity dataset to use for the image URL. If preferred, the `baseUrl`
   * prop can be provided instead.
   */
  dataset?: string;

  /**
   * `alt` attribute for the image; set to an empty string if not provided.
   */
  // alt?: string

  /**
   * Passed through to the <img> tag as `height`, overriding the `aspectRatio`
   * option, if enabled.
   */
  htmlHeight?: number;

  /**
   * Passed through to the <img> tag as `width`, overriding the `aspectRatio`
   * option, if enabled.
   */
  htmlWidth?: number;

  /**
   * Passed through to the <img> tag as `id` since the `id` prop is reserved for
   * the Sanity image asset ID.
   */
  htmlId?: string;

  /**
   * Query string params to pass to Sanity's image CDN directly.
   * @description Note that this is only a subset of the params supported
   * by the Sanity image CDN. Many are set automatically by this library,
   * and several others result in behavior you probably don't want. If you need
   * something and have a compelling use case, please open an issue and
   * I'd be delighted to consider it.
   */
  queryParams?: DirectQueryParams;
};

export type { SanityImageProps };
