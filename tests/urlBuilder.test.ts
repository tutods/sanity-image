import type { ImageQueryParams } from '~/shared/types';
import {
  buildQueryParams,
  buildQueryString,
  buildRect,
  buildSrc,
  buildSrcSet,
  croppedImageSize,
} from '~/utils/url-builder';

const image = {
  asset: {
    _id: 'image-79f37b3f070b144d45455d514ff4e9fc43035649-1000x1000-png',
  },
  crop: {
    bottom: 0.25,
    left: 0,
    right: 0.25,
    top: 0,
  },
  hotspot: {
    x: 0.25,
    y: 0.25,
  },
};

describe('buildSrc', () => {
  // Returns metadata as well as single `src` url
  it('builds a src with metadata', () => {
    expect(buildSrc({ baseUrl: '/images/', id: image.asset._id, width: 500 })).toEqual({
      height: 500,
      src: '/images/79f37b3f070b144d45455d514ff4e9fc43035649-1000x1000.png?auto=format&fit=max&q=75&w=500',
      width: 500,
    });
  });
});

describe('buildSrcSet', () => {
  const baseUrl = '/image/';

  it('generates a default srcset for mid-size images', () => {
    expect(buildSrcSet({ baseUrl, id: image.asset._id, width: 500 })).toEqual([
      '/image/79f37b3f070b144d45455d514ff4e9fc43035649-1000x1000.png?auto=format&fit=max&q=75&w=250 250w',
      '/image/79f37b3f070b144d45455d514ff4e9fc43035649-1000x1000.png?auto=format&fit=max&q=75&w=500 500w',
      '/image/79f37b3f070b144d45455d514ff4e9fc43035649-1000x1000.png?auto=format&fit=max&q=75&w=750 750w',
      '/image/79f37b3f070b144d45455d514ff4e9fc43035649-1000x1000.png?auto=format&fit=max&q=75&w=1000 1000w',
    ]);
  });

  it("doesn't scale up images", () => {
    expect(buildSrcSet({ baseUrl, id: image.asset._id, width: 1000 })).toEqual([
      '/image/79f37b3f070b144d45455d514ff4e9fc43035649-1000x1000.png?auto=format&fit=max&q=75&w=250 250w',
      '/image/79f37b3f070b144d45455d514ff4e9fc43035649-1000x1000.png?auto=format&fit=max&q=75&w=500 500w',
      '/image/79f37b3f070b144d45455d514ff4e9fc43035649-1000x1000.png?auto=format&fit=max&q=75&w=750 750w',
      '/image/79f37b3f070b144d45455d514ff4e9fc43035649-1000x1000.png?auto=format&fit=max&q=75&w=1000 1000w',
    ]);

    expect(buildSrcSet({ baseUrl, id: image.asset._id, width: 2000 })).toEqual([
      '/image/79f37b3f070b144d45455d514ff4e9fc43035649-1000x1000.png?auto=format&fit=max&q=75&w=250 250w',
      '/image/79f37b3f070b144d45455d514ff4e9fc43035649-1000x1000.png?auto=format&fit=max&q=75&w=500 500w',
      '/image/79f37b3f070b144d45455d514ff4e9fc43035649-1000x1000.png?auto=format&fit=max&q=75&w=750 750w',
      '/image/79f37b3f070b144d45455d514ff4e9fc43035649-1000x1000.png?auto=format&fit=max&q=75&w=1000 1000w',
    ]);
  });

  it('generates a smaller set for small images', () => {
    expect(buildSrcSet({ baseUrl, id: image.asset._id, width: 100 })).toEqual([
      '/image/79f37b3f070b144d45455d514ff4e9fc43035649-1000x1000.png?auto=format&fit=max&q=75&w=50 50w',
      '/image/79f37b3f070b144d45455d514ff4e9fc43035649-1000x1000.png?auto=format&fit=max&q=75&w=100 100w',
      '/image/79f37b3f070b144d45455d514ff4e9fc43035649-1000x1000.png?auto=format&fit=max&q=75&w=200 200w',
    ]);
  });

  it('skips tiny variants', () => {
    expect(buildSrcSet({ baseUrl, id: image.asset._id, width: 60 })).toEqual([
      '/image/79f37b3f070b144d45455d514ff4e9fc43035649-1000x1000.png?auto=format&fit=max&q=75&w=60 60w',
      '/image/79f37b3f070b144d45455d514ff4e9fc43035649-1000x1000.png?auto=format&fit=max&q=75&w=120 120w',
    ]);
  });

  it('generates a broader srcset for large images', () => {
    expect(
      buildSrcSet({
        baseUrl,
        id: 'image-79f37b3f070b144d45455d514ff4e9fc43035649-10000x10000-png',
        width: 2000,
      }),
    ).toEqual([
      '/image/79f37b3f070b144d45455d514ff4e9fc43035649-10000x10000.png?auto=format&fit=max&q=75&w=500 500w',
      '/image/79f37b3f070b144d45455d514ff4e9fc43035649-10000x10000.png?auto=format&fit=max&q=75&w=1000 1000w',
      '/image/79f37b3f070b144d45455d514ff4e9fc43035649-10000x10000.png?auto=format&fit=max&q=75&w=1500 1500w',
      '/image/79f37b3f070b144d45455d514ff4e9fc43035649-10000x10000.png?auto=format&fit=max&q=75&w=2000 2000w',
      '/image/79f37b3f070b144d45455d514ff4e9fc43035649-10000x10000.png?auto=format&fit=max&q=75&w=2500 2500w',
      '/image/79f37b3f070b144d45455d514ff4e9fc43035649-10000x10000.png?auto=format&fit=max&q=75&w=3000 3000w',
      '/image/79f37b3f070b144d45455d514ff4e9fc43035649-10000x10000.png?auto=format&fit=max&q=75&w=3500 3500w',
      '/image/79f37b3f070b144d45455d514ff4e9fc43035649-10000x10000.png?auto=format&fit=max&q=75&w=4000 4000w',
    ]);
  });

  it('considers the post-crop dimensions', () => {
    expect(
      buildSrcSet({
        baseUrl,
        crop: image.crop,
        height: 500,
        id: image.asset._id,
        width: 500,
      }),
    ).toEqual([
      '/image/79f37b3f070b144d45455d514ff4e9fc43035649-1000x1000.png?auto=format&fit=max&q=75&rect=0,0,750,750&w=250 250w',
      '/image/79f37b3f070b144d45455d514ff4e9fc43035649-1000x1000.png?auto=format&fit=max&q=75&rect=0,0,750,750&w=500 500w',
      '/image/79f37b3f070b144d45455d514ff4e9fc43035649-1000x1000.png?auto=format&fit=max&q=75&rect=0,0,750,750&w=750 750w',
    ]);
  });

  it('handles cover=mode', () => {
    expect(
      buildSrcSet({
        baseUrl,
        crop: image.crop,
        height: 500,
        id: image.asset._id,
        mode: 'cover',
        width: 300,
      }),
    ).toEqual([
      '/image/79f37b3f070b144d45455d514ff4e9fc43035649-1000x1000.png?auto=format&crop=entropy&fit=crop&h=250&q=75&rect=0,0,750,750&w=150 150w',
      '/image/79f37b3f070b144d45455d514ff4e9fc43035649-1000x1000.png?auto=format&crop=entropy&fit=crop&h=500&q=75&rect=0,0,750,750&w=300 300w',
      '/image/79f37b3f070b144d45455d514ff4e9fc43035649-1000x1000.png?auto=format&crop=entropy&fit=crop&h=750&q=75&rect=0,0,750,750&w=450 450w',
    ]);
  });

  it('handles complex height-constrained cases', () => {
    expect(
      buildSrcSet({
        baseUrl,
        crop: { bottom: 0.2, left: 0.3, right: 0, top: 0 },
        height: 1000,
        hotspot: { x: 1, y: 1 },
        id: image.asset._id,
        mode: 'cover',
        width: 500,
      }),
    ).toEqual([
      '/image/79f37b3f070b144d45455d514ff4e9fc43035649-1000x1000.png?auto=format&fit=crop&fp-x=1&fp-y=1&h=400&q=75&rect=300,0,700,800&w=200 200w',
      '/image/79f37b3f070b144d45455d514ff4e9fc43035649-1000x1000.png?auto=format&fit=crop&fp-x=1&fp-y=1&h=800&q=75&rect=300,0,700,800&w=400 400w',
    ]);
  });

  it("uses the largest image possible if a 2x isn't possible", () => {
    expect(
      buildSrcSet({
        baseUrl,
        id: image.asset._id,
        width: 600,
      }),
    ).toEqual([
      '/image/79f37b3f070b144d45455d514ff4e9fc43035649-1000x1000.png?auto=format&fit=max&q=75&w=300 300w',
      '/image/79f37b3f070b144d45455d514ff4e9fc43035649-1000x1000.png?auto=format&fit=max&q=75&w=600 600w',
      '/image/79f37b3f070b144d45455d514ff4e9fc43035649-1000x1000.png?auto=format&fit=max&q=75&w=900 900w',
      '/image/79f37b3f070b144d45455d514ff4e9fc43035649-1000x1000.png?auto=format&fit=max&q=75&w=1000 1000w',
    ]);
  });

  it('respects queryParams', () => {
    expect(
      buildSrcSet({
        baseUrl,
        id: image.asset._id,
        queryParams: {
          blur: 222,
          q: 37,
        },
        width: 600,
      }),
    ).toEqual([
      '/image/79f37b3f070b144d45455d514ff4e9fc43035649-1000x1000.png?auto=format&blur=222&fit=max&q=37&w=300 300w',
      '/image/79f37b3f070b144d45455d514ff4e9fc43035649-1000x1000.png?auto=format&blur=222&fit=max&q=37&w=600 600w',
      '/image/79f37b3f070b144d45455d514ff4e9fc43035649-1000x1000.png?auto=format&blur=222&fit=max&q=37&w=900 900w',
      '/image/79f37b3f070b144d45455d514ff4e9fc43035649-1000x1000.png?auto=format&blur=222&fit=max&q=37&w=1000 1000w',
    ]);
  });
});

describe('buildQueryParams', () => {
  it('works with defaults', () => {
    expect(
      buildQueryParams({
        id: image.asset._id,
      }),
    ).toEqual(<ImageQueryParams>{ auto: 'format', fit: 'max', q: 75, w: 500 });
  });

  describe('contain', () => {
    it('converts height to width', () => {
      expect(
        buildQueryParams({
          height: 500,
          id: image.asset._id,
        }),
      ).toEqual(<ImageQueryParams>{ auto: 'format', fit: 'max', q: 75, w: 500 });
    });

    it("doesn't upscale", () => {
      expect(
        buildQueryParams({
          id: image.asset._id,
          width: 2000,
        }),
      ).toEqual(<ImageQueryParams>{
        auto: 'format',
        fit: 'max',
        q: 75,
        w: 1000,
      });

      expect(
        buildQueryParams({
          height: 5000,
          id: image.asset._id,
        }),
      ).toEqual(<ImageQueryParams>{
        auto: 'format',
        fit: 'max',
        q: 75,
        w: 1000,
      });
    });

    it("doesn't upscale when cropping", () => {
      expect(
        buildQueryParams({
          crop: image.crop,
          id: image.asset._id,
          width: 2000,
        }),
      ).toEqual(<ImageQueryParams>{
        auto: 'format',
        fit: 'max',
        q: 75,
        rect: '0,0,750,750',
        w: 750,
      });
    });

    it('applies rect correctly', () => {
      expect(
        buildQueryParams({
          crop: image.crop,
          id: image.asset._id,
          width: 375,
        }),
      ).toEqual(<ImageQueryParams>{
        auto: 'format',
        fit: 'max',
        q: 75,
        rect: '0,0,750,750',
        w: 375,
      });
    });

    it('removes height param while respecting its constraint', () => {
      expect(
        buildQueryParams({
          height: 500,
          id: image.asset._id,
          width: 1000,
        }),
      ).toEqual(<ImageQueryParams>{
        auto: 'format',
        // width adjusted to respect `height` constraint at source aspect ratio
        fit: 'max',
        q: 75,
        w: 500,
      });

      expect(
        buildQueryParams({
          crop: image.crop,
          height: 500,
          id: image.asset._id,
          width: 2000,
        }),
      ).toEqual(<ImageQueryParams>{
        auto: 'format',
        fit: 'max',
        q: 75,
        rect: '0,0,750,750',
        w: 500,
      });
    });
  });

  describe('cover', () => {
    it('returns correct params', () => {
      expect(
        buildQueryParams({
          height: 375,
          id: image.asset._id,
          mode: 'cover',
          width: 200,
        }),
      ).toEqual(<ImageQueryParams>{
        auto: 'format',
        crop: 'entropy',
        fit: 'crop',
        h: 375,
        q: 75,
        w: 200,
      });
    });

    it("doesn't upscale", () => {
      expect(
        buildQueryParams({
          crop: image.crop,
          height: 1000,
          id: image.asset._id,
          mode: 'cover',
          width: 2000,
        }),
      ).toEqual(<ImageQueryParams>{
        auto: 'format',
        crop: 'entropy',
        fit: 'crop',
        h: 375,
        q: 75,
        rect: '0,0,750,750',
        w: 750,
      });

      expect(
        buildQueryParams({
          crop: image.crop,
          height: 2000,
          id: image.asset._id,
          mode: 'cover',
          width: 1000,
        }),
      ).toEqual(<ImageQueryParams>{
        auto: 'format',
        crop: 'entropy',
        fit: 'crop',
        h: 750,
        q: 75,
        rect: '0,0,750,750',
        w: 375,
      });

      expect(
        buildQueryParams({
          height: 2000,
          id: image.asset._id,
          mode: 'cover',
          width: 1000,
        }),
      ).toEqual(<ImageQueryParams>{
        auto: 'format',
        crop: 'entropy',
        fit: 'crop',
        h: 1000,
        q: 75,
        w: 500,
      });
    });

    it('applies hotspot', () => {
      expect(
        buildQueryParams({
          height: 100,
          hotspot: image.hotspot,
          id: image.asset._id,
          mode: 'cover',
          width: 375,
        }),
      ).toEqual(<ImageQueryParams>{
        auto: 'format',
        fit: 'crop',
        'fp-x': 0.25,
        'fp-y': 0.25,
        h: 100,
        q: 75,
        w: 375,
      });
    });

    it('hotspot compensates for crop input', () => {
      expect(
        buildQueryParams({
          crop: image.crop,
          height: 100,
          hotspot: image.hotspot,
          id: image.asset._id,
          mode: 'cover',
          width: 375,
        }),
      ).toEqual(<ImageQueryParams>{
        auto: 'format',
        fit: 'crop',
        'fp-x': 0.333,
        'fp-y': 0.333,
        h: 100,
        q: 75,
        rect: '0,0,750,750',
        w: 375,
      });
    });

    it('tolerates out-of-bounds focal points', () => {
      expect(
        buildQueryParams({
          crop: { bottom: 0.2, left: 0.3, right: 0, top: 0 },
          height: 1000,
          hotspot: { x: 1, y: 1 },
          id: image.asset._id,
          mode: 'cover',
          width: 500,
        }),
      ).toEqual(<ImageQueryParams>{
        auto: 'format',
        fit: 'crop',
        'fp-x': 1,
        'fp-y': 1,
        h: 800,
        q: 75,
        rect: '300,0,700,800',
        w: 400,
      });

      expect(
        buildQueryParams({
          crop: { bottom: 0.2, left: 0.3, right: 0, top: 0 },
          height: 400,
          hotspot: { x: 1, y: 1 },
          id: image.asset._id,
          mode: 'cover',
          width: 200,
        }),
      ).toEqual(<ImageQueryParams>{
        auto: 'format',
        fit: 'crop',
        'fp-x': 1,
        'fp-y': 1,
        h: 400,
        q: 75,
        rect: '300,0,700,800',
        w: 200,
      });
    });

    it('uses entropy crop if no hotspot', () => {
      expect(
        buildQueryParams({
          crop: image.crop,
          height: 100,
          id: image.asset._id,
          mode: 'cover',
          width: 375,
        }),
      ).toEqual(<ImageQueryParams>{
        auto: 'format',
        crop: 'entropy',
        fit: 'crop',
        h: 100,
        q: 75,
        rect: '0,0,750,750',
        w: 375,
      });
    });

    it('falls back to max if not changing aspect ratio', () => {
      expect(
        buildQueryParams({
          crop: image.crop,
          height: 500,
          id: image.asset._id,
          mode: 'cover',
          width: 500,
        }),
      ).toEqual(<ImageQueryParams>{
        auto: 'format',
        fit: 'max',
        q: 75,
        rect: '0,0,750,750',
        w: 500,
      });
    });
  });

  describe('metadata', () => {
    it('returns dimensions', () => {
      expect(
        buildQueryParams({
          id: image.asset._id,
          options: { includeMetadata: true },
        }).metadata,
      ).toEqual(<ImageQueryParams['metadata']>{
        outputDimensions: { aspectRatio: 1, height: 500, width: 500 },
        sourceDimensions: { aspectRatio: 1, height: 1000, width: 1000 },
      });

      expect(
        buildQueryParams({
          crop: image.crop,
          height: 1000,
          id: image.asset._id,
          mode: 'cover',
          options: { includeMetadata: true },
          width: 2000,
        }).metadata,
      ).toEqual(<ImageQueryParams['metadata']>{
        outputDimensions: { aspectRatio: 2, height: 375, width: 750 },
        sourceDimensions: { aspectRatio: 1, height: 1000, width: 1000 },
      });

      expect(
        buildQueryParams({
          crop: image.crop,
          height: 1000,
          id: image.asset._id,
          mode: 'contain',
          options: { includeMetadata: true },
          width: 2000,
        }).metadata,
      ).toEqual(<ImageQueryParams['metadata']>{
        outputDimensions: { aspectRatio: 1, height: 750, width: 750 },
        sourceDimensions: { aspectRatio: 1, height: 1000, width: 1000 },
      });

      expect(
        buildQueryParams({
          crop: image.crop,
          height: 500,
          id: image.asset._id,
          mode: 'contain',
          options: { includeMetadata: true },
          width: 2000,
        }).metadata,
      ).toEqual(<ImageQueryParams['metadata']>{
        outputDimensions: { aspectRatio: 1, height: 500, width: 500 },
        sourceDimensions: { aspectRatio: 1, height: 1000, width: 1000 },
      });
    });
  });

  describe('queryParams', () => {
    it('only uses auto format if no format is specified', () => {
      expect(
        buildQueryParams({
          id: image.asset._id,
          queryParams: { fm: 'webp' },
        }).auto,
      ).toEqual(undefined);
    });

    it('passes through valid query params', () => {
      expect(
        buildQueryParams({
          id: image.asset._id,
          queryParams: {
            blur: 20,
            flip: 'hv',
            fm: 'webp',
            q: 20,
            sat: -100,
            sharpen: 42,
          },
        }),
      ).toEqual(<ImageQueryParams>{
        blur: 20,
        fit: 'max',
        flip: 'hv',
        fm: 'webp',
        q: 20,
        sat: -100,
        sharpen: 42,
        w: 500,
      });
    });
  });
});

describe('croppedImageSize', () => {
  it('works with zeroed crop values', () => {
    expect(
      croppedImageSize({ height: 1000, width: 2000 }, { bottom: 0, left: 0, right: 0, top: 0 }),
    ).toEqual({ aspectRatio: 2, height: 1000, width: 2000 });
  });

  it('works for complex crop values', () => {
    expect(
      croppedImageSize(
        { height: 1000, width: 2000 },
        { bottom: 0.05, left: 0.1, right: 0.25, top: 0.15 },
      ),
    ).toEqual({ aspectRatio: 1.625, height: 800, width: 1300 });
  });
});

describe('buildRect', () => {
  it('works with zeroed crop values', () => {
    expect(buildRect({ height: 1000, width: 2000 }, { bottom: 0, left: 0, right: 0, top: 0 })).toBe(
      '0,0,2000,1000',
    );
  });

  it('works for complex crop values', () => {
    expect(
      buildRect({ height: 1000, width: 2000 }, { bottom: 0.05, left: 0.1, right: 0.25, top: 0.15 }),
    ).toBe('200,150,1300,800');
  });

  it('throws an error for inaccurate/pixel based crop values', () => {
    expect(() =>
      buildRect({ height: 1000, width: 2000 }, { bottom: 1000, left: 200, right: 500, top: 100 }),
    ).toThrowError();
  });

  it('rounds values', () => {
    expect(
      buildRect({ height: 90, width: 30 }, { bottom: 0.05, left: 0.1, right: 0.25, top: 0.15 }),
    ).toBe('3,14,20,72');
  });
});

describe('buildQueryString', () => {
  it('converts object to sorted query string', () => {
    expect(
      buildQueryString({
        auto: 'format',
        fit: 'crop',
        'fp-x': 0.333,
        'fp-y': 0.333,
        h: 100,
        q: 75,
        rect: '0,0,750,750',
        w: 375,
      }),
    ).toEqual('auto=format&fit=crop&fp-x=0.333&fp-y=0.333&h=100&q=75&rect=0,0,750,750&w=375');
  });
});
