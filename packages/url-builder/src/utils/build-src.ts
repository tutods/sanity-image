import type { ComputedImageData, ImageSrcInputs } from "@/types";
import { buildQueryParams, buildQueryString, imageIdToUrlPath } from "./helpers";

/**
 * Convert ImageSrcInputs into a full image URL and computed output dimensions.
 */
const buildSrc = ({ baseUrl, ...inputParams }: ImageSrcInputs): ComputedImageData => {
  const { metadata, ...queryParams } = buildQueryParams({
    ...inputParams,
    options: { includeMetadata: true },
  });

  // Narrowing for TS
  if (!metadata) {
    throw new Error("Missing image output metadata");
  }

  const imageUrl = `${baseUrl}${imageIdToUrlPath(inputParams.id)}`;

  return {
    src: `${imageUrl}?${buildQueryString(queryParams)}`,
    width: metadata.outputDimensions.width,
    height: metadata.outputDimensions.height,
  };
};

export { buildSrc };
