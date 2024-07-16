import type { ImageQueryInputs, ImageQueryParams } from '@/types';
import { buildRect } from './build-rect';
import { croppedImageSize } from './cropped-image-size';
import { parseImageId } from './parse-id';

const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, value));

const roundWithPrecision = (value: number, precision: number): number =>
  Math.round(value * Math.pow(10, precision)) / Math.pow(10, precision);

/**
 * Constructs a query parameters object for the Sanity image URL based on the inputs provided.
 */
const buildQueryParams = ({
  id,
  mode = 'contain',
  width,
  height,
  hotspot,
  crop,
  queryParams,
  options: { includeMetadata = false } = {},
}: ImageQueryInputs & {
  options?: {
    /** Include data about the image in the response */
    includeMetadata?: boolean;
  };
}): ImageQueryParams => {
  const sourceDimensions = parseImageId(id).dimensions;

  // If crop is provided, compute post-crop dimensions
  const {
    width: maxWidth,
    height: maxHeight,
    aspectRatio: sourceAspectRatio,
  } = crop ? croppedImageSize(sourceDimensions, crop) : sourceDimensions;

  // Determine width if not provided
  if (!width) {
    if (height) {
      // Compute width based on height and default ratio
      width = Math.round(height * sourceAspectRatio);

      // Discard `height` since we have to be in `contain` mode and we've converted it into `width`
      height = undefined;
    } else {
      // Use 1/2 of the max image width by default to allow for 2x scale-up
      width = Math.round(maxWidth / 2);
    }
  }

  // Override `cover` mode if both width and height haven't been provided, or if
  // the requested aspect ratio matches the source aspect ratio. In these cases
  // the result will be the same as `contain` mode anyways, and `contain` mode
  // is simpler and saves a few bytes in the URL.
  if (mode === 'cover' && (!width || !height || width / height === sourceAspectRatio)) {
    mode = 'contain';
  } else if (mode === 'contain' && height) {
    // Similarly, if `contain` mode is used and a height is provided, we can
    // convert it into a width by adjusting the width such that the
    // aspect-ratio–constrained result will respect the height provided.
    width = Math.min(width, Math.round(height * sourceAspectRatio));
    height = undefined;
  }

  // Clamp min and max dimensions while preserving requested aspect ratio
  if (width > maxWidth || (height && height > maxHeight)) {
    const requestedAspectRatio = height ? width / height : sourceAspectRatio;

    if (requestedAspectRatio >= sourceAspectRatio) {
      // Clamp width
      width = maxWidth;
      height = height && Math.round(width / requestedAspectRatio);
    } else {
      // Clamp height
      height = maxHeight;
      width = Math.round(height * requestedAspectRatio);
    }
  }

  // Note: when converting params to a query string initially, we need to
  // use an object or map instead of URLSearchParams, since the latter will
  // allow multiple params with the same name, which is not supported by the
  // Sanity Image API.
  const params: Partial<ImageQueryParams> = {
    w: width,
    q: 75,
    ...queryParams,
  };

  // If an explicit format has not been requested, use auto format
  if (!params.fm) {
    params.auto = 'format';
  }

  if (crop) {
    // Convert crop to rect param)
    params.rect = buildRect(sourceDimensions, crop);
  }

  if (mode === 'cover') {
    params.fit = 'crop';

    if (height) {
      params.h = height;
    }

    if (hotspot) {
      // Hotspot is relative to post-`rect` dimensions; if `crop` is present,
      // the hotspot inputs need to be adjusted accordingly
      const x = crop ? hotspot.x / (1 - crop.left - crop.right) : hotspot.x;
      const y = crop ? hotspot.y / (1 - crop.top - crop.bottom) : hotspot.y;

      params['fp-x'] = roundWithPrecision(clamp(x, 0, 1), 3);
      params['fp-y'] = roundWithPrecision(clamp(y, 0, 1), 3);
    } else {
      // If no hotspot is provided, use Sanity’s `entropy` crop mode
      params.crop = 'entropy';
    }
  } else {
    params.fit = 'max';
  }

  if (includeMetadata) {
    // Height will be set if the aspect ratio varies from `sourceAspectRatio`
    const outputHeight = height || Math.round(width / sourceAspectRatio);

    params.metadata = <ImageQueryParams['metadata']>{
      sourceDimensions,
      outputDimensions: {
        width,
        height: outputHeight,
        aspectRatio: width / outputHeight,
      },
    };
  }

  return <ImageQueryParams>params;
};

export { buildQueryParams };
