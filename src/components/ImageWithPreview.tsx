import React, { useEffect, useRef, useState } from 'react';

import { createEffect, createSignal, Show, splitProps } from 'solid-js';

import type { ImageWithPreviewProps } from '~/shared/types';

/**
 * Renders two image tags, one with the preview image and one with the full
 * image. When the full image is loaded, the preview image is removed, revealing
 * the full image.
 */
function ImageWithPreview<T extends React.ElementType = 'img'>(props: ImageWithPreviewProps<T>) {
  // Splitting props into two groups: 'name' and 'age'
  const [baseProps, restProps] = splitProps(props, ['as', 'preview', 'style']);

  const [isLoaded, setIsLoaded] = createSignal(false);
  const [elementRef, setElementRef] = createSignal<HTMLImageElement>();

  const onLoad = () => {
    setIsLoaded(true);
  };

  createEffect(() => {
    if (elementRef()?.complete) {
      onLoad();
    }
  });

  const Img = baseProps.as || 'img';

  return (
    <>
      <Show when={!isLoaded()}>
        <Img
          alt={restProps.alt}
          className={restProps.className}
          data-lqip
          height={restProps.height}
          id={restProps.id}
          src={baseProps.preview}
          style={baseProps.style}
          width={restProps.width}
        />
      </Show>

      <Img
        data-loading={isLoaded() ? null : true}
        onLoad={onLoad}
        ref={setElementRef}
        style={
          isLoaded()
            ? undefined
            : {
                // must be > 4px to be lazy loaded
                height: '10px !important',

                opacity: 0,

                // Disable pointer events and user select to prevent the image
                // from interfering with UI while it's loading/hidden.
                pointerEvents: 'none',

                // Cannot use negative x or y values, visibility: hidden, or display: none
                // to hide or the image might not get loaded.
                position: 'absolute',

                userSelect: 'none',

                // must be > 4px to be lazy loaded
                width: '10px !important',
                zIndex: -10,

                ...baseProps.style,
              }
        }
        {...props}
      />
    </>
  );
}

export { ImageWithPreview };
