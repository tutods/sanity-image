import type { JSX } from 'solid-js';
import { splitProps } from 'solid-js';
import { ImageWithPreview } from 'src/components/ImageWithPreview';

import type { PolymorphicComponentProps, SanityImageProps } from '~/shared/types';
import { buildSrc, buildSrcSet, buildSvgAttributes } from '~/utils/url-builder';

export const SanityImage = <C extends JSX.Element = 'img'>(
  props: PolymorphicComponentProps<C, SanityImageProps>,
) => {
  const [baseProps, sanityProps, imgProps, restOfProps] = splitProps(
    props,
    ['as'],
    ['baseUrl', 'crop', 'dataset', 'preview', 'projectId', 'queryParams', 'hotspot', 'mode'],
    ['height', 'htmlHeight', 'htmlId', 'htmlWidth', 'width', 'id'],
  );
  /**
   * {
   *   as: component,
   *
   *   // Sanity url
   *   baseUrl,
   *   crop,
   *   dataset,
   *
   *   // Image definition data
   *   height,
   *   hotspot,
   *   htmlHeight,
   *   htmlId,
   *   htmlWidth,
   *   id,
   *
   *   // Data for LQIP (preview image)
   *   mode = 'contain',
   *
   *   // Native-behavior overrides
   *   preview,
   *   projectId,
   *   queryParams,
   *
   *   // Image query string params
   *   width,
   *
   *   // Any remaining props are passed through to the rendered component
   *   ...rest
   * }
   */

  if (!imgProps.id) throw new Error('Missing required `id` prop for <SanityImage>.');

  if (!sanityProps.baseUrl && (!sanityProps.projectId || !sanityProps.dataset)) {
    throw new Error(
      'Missing required `baseUrl` or `projectId` and `dataset` props for <SanityImage>.',
    );
  }

  const baseUrl =
    sanityProps.baseUrl ??
    `https://cdn.sanity.io/images/${sanityProps.projectId}/${sanityProps.dataset}/`;

  const isSvg = imgProps.id.endsWith('-svg');

  const ImageComponent = sanityProps.preview && !isSvg ? ImageWithPreview : baseProps.as ?? 'img';

  const componentProps: JSX.ImgHTMLAttributes<HTMLImageElement> = {
    alt: restOfProps.alt ?? '',
    id: imgProps.htmlId,
    loading: restOfProps.loading ?? 'lazy',
    ...restOfProps,
  };

  if (isSvg) {
    // Sanity ignores all transformations for SVGs, so we can just render the
    // component without passing a query string and without doing anything for
    // the preview.
    return (
      <ImageComponent {...buildSvgAttributes({ baseUrl, id: imgProps.id })} {...componentProps} />
    );
  }

  // Create default src and build srcSet
  const srcParams = {
    baseUrl,
    crop: sanityProps.crop,
    height: imgProps.height,
    hotspot: sanityProps.hotspot,
    id: imgProps.id,
    mode: sanityProps.mode ?? 'contain',
    queryParams: sanityProps.queryParams,
    width: imgProps.width,
  };

  const { src, ...outputDimensions } = buildSrc(srcParams);
  componentProps.srcSet = buildSrcSet(srcParams).join(', ');
  componentProps.src = src;
  componentProps.width = imgProps.htmlWidth ?? outputDimensions.width;
  componentProps.height = imgProps.htmlHeight ?? outputDimensions.height;

  if (sanityProps.preview) {
    componentProps.as = component ?? 'img';
    componentProps.preview = preview;
  }

  return <ImageComponent {...componentProps} />;
};
