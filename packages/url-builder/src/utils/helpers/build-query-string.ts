import type { ImageQueryParams } from "@/types";

/**
 * Converts an object of query params into a query string. The keys are sorted
 * alphabetically to maximize cache-hit rates. Commas are not URL-encoded since
 * doing so is unnecessary, adds extra data, and makes it harder to read.
 */
const buildQueryString = (
  params: Partial<{
    [K in keyof Omit<ImageQueryParams, "metadata">]: ImageQueryParams[K];
  }>,
): string => {
  const searchParams = new URLSearchParams(
    Object.entries(params)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => [key, String(value)]),
  );

  return searchParams.toString().replace(/%2C/g, ","); // don't urlencode commas
};

export { buildQueryString };
