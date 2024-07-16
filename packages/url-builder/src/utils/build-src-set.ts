import type { ImageQueryParams, ImageSrcInputs } from "@/types";
import {
  buildQueryParams,
  buildQueryString,
  dynamicMultipliers,
  imageIdToUrlPath,
} from "./helpers";

/**
 * Callback function to generate `srcSet` image property.
 * @returns `srcSet` to be used on any `<img>` element.
 */
const buildSrcSet = ({
  id,
  mode = "contain",
  width,
  height,
  hotspot,
  crop,
  baseUrl,
  ...inputParams
}: ImageSrcInputs): string[] => {
  // Determine base computed width
  const { w, h } = buildQueryParams({ id, mode, width, height, hotspot, crop });

  // URL of the image without any query parameters
  const imageUrl = `${baseUrl}${imageIdToUrlPath(id)}`;

  // Build srcset
  const srcSetEntries: string[] = dynamicMultipliers(w)
    .map((multiple) => {
      const computedWidth = Math.round(w * multiple);
      const computedHeight = h && Math.round(h * multiple);

      // Ignore tiny entries; the extra data in the HTML is almost never worth it
      if (multiple < 1 && computedWidth < 50) {
        return null;
      }

      const params: Omit<ImageQueryParams, "metadata"> = buildQueryParams({
        id,
        mode,
        width: computedWidth,
        height: computedHeight,
        hotspot,
        crop,
        ...inputParams,
      });

      return `${imageUrl}?${buildQueryString(params)} ${params.w}w`;
    })
    .filter((entry): entry is string => Boolean(entry));

  return Array.from(new Set(srcSetEntries));
};

export { buildSrcSet };
