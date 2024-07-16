import type { ImageSrcInputs } from "@/types";
import { parseImageId } from "./helpers/parse-id";

const buildSvgAttributes = ({ id, baseUrl }: ImageSrcInputs) => {
  const { assetId, dimensions, format } = parseImageId(id);

  return {
    src: `${baseUrl}${assetId}-${dimensions.width}x${dimensions.height}.${format}`,
    width: dimensions.width,
    height: dimensions.height,
  };
};

export { buildSvgAttributes };
