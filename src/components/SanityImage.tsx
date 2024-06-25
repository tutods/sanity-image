import React, { type ComponentPropsWithoutRef, type ElementType, type ReactElement } from 'react';

import type { JSX } from 'solid-js';
import { splitProps } from 'solid-js';
import { ImageWithPreview } from 'src/components/ImageWithPreview';

import type { PolymorphicComponentProps, SanityImageProps } from '~/shared/types';
import { buildSrc, buildSrcSet, buildSvgAttributes } from '~/utils/url-builder';

export const SanityImage = <C extends JSX.Element = 'img'>(
  props: PolymorphicComponentProps<C, SanityImageProps>,
) => {
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

  if (!id) throw new Error('Missing required `id` prop for <SanityImage>.');
  if (!baseUrl && (!projectId || !dataset))
    throw new Error(
      'Missing required `baseUrl` or `projectId` and `dataset` props for <SanityImage>.',
    );

  baseUrl = baseUrl ?? `https://cdn.sanity.io/images/${projectId}/${dataset}/`;

  const isSvg = id.endsWith('-svg');

  const ImageComponent = preview && !isSvg ? ImageWithPreview : component ?? 'img';

  const componentProps: ComponentPropsWithoutRef<typeof ImageComponent> = {
    alt: rest.alt ?? '',
    id: htmlId,
    loading: rest.loading ?? 'lazy',
    ...rest,
  };

  if (isSvg) {
    // Sanity ignores all transformations for SVGs, so we can just render the
    // component without passing a query string and without doing anything for
    // the preview.
    return <ImageComponent {...buildSvgAttributes({ baseUrl, id })} {...componentProps} />;
  }

  // Create default src and build srcSet
  const srcParams = {
    baseUrl,
    crop,
    height,
    hotspot,
    id,
    mode,
    queryParams,
    width,
  };

  const { src, ...outputDimensions } = buildSrc(srcParams);
  componentProps.srcSet = buildSrcSet(srcParams).join(', ');
  componentProps.src = src;
  componentProps.width = htmlWidth ?? outputDimensions.width;
  componentProps.height = htmlHeight ?? outputDimensions.height;

  if (preview) {
    componentProps.as = component ?? 'img';
    componentProps.preview = preview;
  }

  return <ImageComponent {...componentProps} />;
};
