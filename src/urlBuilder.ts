import { parseImageId } from "./parseImageId"
import type { CropData, ImageIdParts, ImageQueryParams } from "types"

/**
 * Constructs a query parameters object for the Sanity image URL based on the inputs provided.
 */
export const buildQueryParams = ({
  id,
  mode = "contain",
  width,
  height,
  hotspot,
  crop,
  options: { includeMetadata = false } = {},
}: {
  /** The Sanity Image ID (`_id` or `_ref` field value) */
  id: string

  /**
   * Use `cover` to crop the image to match the requested aspect ratio (based on `width` and `height`).
   * Use `contain` to fit the image to the boundaries provided without altering the aspect ratio.
   * @default "contain"
   */
  mode?: "cover" | "contain"

  /** The target width of the image in pixels. */
  width?: number

  /** The target height of the image in pixels. */
  height?: number

  /** The hotspot coordinates to use for the image. Note: hotspot `width` and `height` are not used. */
  hotspot?: { x: number; y: number }

  /** The crop coordinates to use for the image. */
  crop?: CropData

  options?: {
    /** Include data about the image in the response */
    includeMetadata?: boolean
  }
}): ImageQueryParams => {
  const sourceDimensions = parseImageId(id).dimensions

  // If crop is provided, compute post-crop dimensions
  const {
    width: maxWidth,
    height: maxHeight,
    aspectRatio: sourceAspectRatio,
  } = crop ? croppedImageSize(sourceDimensions, crop) : sourceDimensions

  // Determine width if not provided
  if (!width) {
    if (height) {
      // Compute width based on height and default ratio
      width = Math.round(height * sourceAspectRatio)

      // Discard `height` since we have to be in `contain` mode and we've converted it into `width`
      height = undefined
    } else {
      // Use 1/2 of the max image width by default to allow for 2x scale-up
      width = Math.round(maxWidth / 2)
    }
  }

  // Override `cover` mode if both width and height haven't been provided, or if
  // the requested aspect ratio matches the source aspect ratio. In these cases
  // the result will be the same as `contain` mode anyways, and `contain` mode
  // is simpler and saves a few bytes in the URL.
  if (
    mode === "cover" &&
    (!width || !height || width / height === sourceAspectRatio)
  ) {
    mode = "contain"
  } else if (mode === "contain" && height) {
    // Similarly, if `contain` mode is used and a height is provided, we can
    // convert it into a width by adjusting the width such that the
    // aspect-ratio–constrained result will respect the height provided.
    width = Math.min(width, Math.round(height * sourceAspectRatio))
    height = undefined
  }

  // Clamp min and max dimensions while preserving requested aspect ratio
  if (width > maxWidth || (height && height > maxHeight)) {
    const requestedAspectRatio = height ? width / height : sourceAspectRatio

    if (requestedAspectRatio >= sourceAspectRatio) {
      // Clamp width
      width = maxWidth
      height = height && Math.round(width / requestedAspectRatio)
    } else {
      // Clamp height
      height = maxHeight
      width = Math.round(height * requestedAspectRatio)
    }
  }

  // Note: when converting params to a query string initially, we need to
  // use an object or map instead of URLSearchParams, since the latter will
  // allow multiple params with the same name, which is not supported by the
  // Sanity Image API.
  const params: Partial<ImageQueryParams> = {
    w: width,
    q: 75,
    auto: "format",
  }

  if (crop) {
    // Convert crop to rect param)
    params.rect = buildRect(sourceDimensions, crop)
  }

  if (mode === "cover") {
    params.fit = "crop"

    if (height) {
      params.h = height
    }

    if (hotspot) {
      // Hotspot is relative to post-`rect` dimensions; if `crop` is present,
      // the hotspot inputs need to be adjusted accordingly
      if (crop) {
        params["fp-x"] = (hotspot.x / (1 - crop.left - crop.right)).toFixed(3)
        params["fp-y"] = (hotspot.y / (1 - crop.top - crop.bottom)).toFixed(3)
      } else {
        params["fp-x"] = hotspot.x
        params["fp-y"] = hotspot.y
      }
    } else {
      // If no hotspot is provided, use Sanity’s `entropy` crop mode
      params.crop = "entropy"
    }
  } else {
    params.fit = "max"
  }

  // This is for testing and diagnostic purposes
  if (includeMetadata) {
    // Height will be set if the aspect ratio varies from `sourceAspectRatio`
    const outputHeight = height || Math.round(width / sourceAspectRatio)

    params.metadata = {
      sourceDimensions,
      outputDimensions: {
        width,
        height: outputHeight,
        aspectRatio: width / outputHeight,
      },
    }
  }

  return <ImageQueryParams>params
}

export const croppedImageSize = (
  /** Source/original image dimensions */
  dimensions: { width: number; height: number },
  crop: CropData
): ImageIdParts["dimensions"] => {
  if (crop.left + crop.right >= 1 || crop.top + crop.bottom >= 1) {
    throw new Error(
      `Invalid crop: ${JSON.stringify(crop)}; crop values must be less than 1`
    )
  }

  const width = Math.round(dimensions.width * (1 - crop.left - crop.right))
  const height = Math.round(dimensions.height * (1 - crop.top - crop.bottom))
  const aspectRatio = width / height

  return { width, height, aspectRatio }
}

/**
 * Build a `rect` value to crop the image.
 */
export const buildRect = (
  /** Source/original image dimensions */
  dimensions: { width: number; height: number },
  crop: CropData
) => {
  const { width, height } = croppedImageSize(dimensions, crop)

  return [
    crop.left * dimensions.width,
    crop.top * dimensions.height,
    width,
    height,
  ].join(",")
}

export const buildQueryString = (params: Record<string, string | number>) =>
  Object.entries(params)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join("&")
    .replace(/%2C/g, ",") // don't urlencode commas