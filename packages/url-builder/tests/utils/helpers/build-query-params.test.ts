import type { ImageQueryParams } from '@/types';
import { buildQueryParams } from '@/utils/helpers';
import { mockSanityImage } from '@tests/mocks';

describe('# Build query params', () => {
  it('should works with defaults values', () => {
    expect(
      buildQueryParams({
        id: mockSanityImage.asset._id,
      }),
    ).toEqual(<ImageQueryParams>{ w: 500, fit: 'max', q: 75, auto: 'format' });
  });

  describe('## Contain mode', () => {
    it('should converts height to width', () => {
      expect(
        buildQueryParams({
          id: mockSanityImage.asset._id,
          height: 500,
        }),
      ).toEqual(<ImageQueryParams>{ w: 500, fit: 'max', q: 75, auto: 'format' });
    });

    it("shouldn't upscale", () => {
      expect(
        buildQueryParams({
          id: mockSanityImage.asset._id,
          width: 2000,
        }),
      ).toEqual(<ImageQueryParams>{
        w: 1000,
        fit: 'max',
        q: 75,
        auto: 'format',
      });

      expect(
        buildQueryParams({
          id: mockSanityImage.asset._id,
          height: 5000,
        }),
      ).toEqual(<ImageQueryParams>{
        w: 1000,
        fit: 'max',
        q: 75,
        auto: 'format',
      });
    });

    it("shouldn't upscale when cropping", () => {
      expect(
        buildQueryParams({
          id: mockSanityImage.asset._id,
          crop: mockSanityImage.crop,
          width: 2000,
        }),
      ).toEqual(<ImageQueryParams>{
        rect: '0,0,750,750',
        w: 750,
        fit: 'max',
        q: 75,
        auto: 'format',
      });
    });

    it('should applies rect correctly', () => {
      expect(
        buildQueryParams({
          id: mockSanityImage.asset._id,
          crop: mockSanityImage.crop,
          width: 375,
        }),
      ).toEqual(<ImageQueryParams>{
        rect: '0,0,750,750',
        w: 375,
        fit: 'max',
        q: 75,
        auto: 'format',
      });
    });

    it('should removes height param while respecting its constraint', () => {
      expect(
        buildQueryParams({
          id: mockSanityImage.asset._id,
          width: 1000,
          height: 500,
        }),
      ).toEqual(<ImageQueryParams>{
        w: 500, // width adjusted to respect `height` constraint at source aspect ratio
        fit: 'max',
        q: 75,
        auto: 'format',
      });

      expect(
        buildQueryParams({
          id: mockSanityImage.asset._id,
          crop: mockSanityImage.crop,
          width: 2000,
          height: 500,
        }),
      ).toEqual(<ImageQueryParams>{
        rect: '0,0,750,750',
        w: 500,
        fit: 'max',
        q: 75,
        auto: 'format',
      });
    });
  });

  describe('## Cover mode', () => {
    it('should returns correct params', () => {
      expect(
        buildQueryParams({
          id: mockSanityImage.asset._id,
          width: 200,
          height: 375,
          mode: 'cover',
        }),
      ).toEqual(<ImageQueryParams>{
        crop: 'entropy',
        w: 200,
        h: 375,
        fit: 'crop',
        q: 75,
        auto: 'format',
      });
    });

    it("shouldn't upscale", () => {
      expect(
        buildQueryParams({
          id: mockSanityImage.asset._id,
          crop: mockSanityImage.crop,
          width: 2000,
          height: 1000,
          mode: 'cover',
        }),
      ).toEqual(<ImageQueryParams>{
        crop: 'entropy',
        rect: '0,0,750,750',
        w: 750,
        h: 375,
        fit: 'crop',
        q: 75,
        auto: 'format',
      });

      expect(
        buildQueryParams({
          id: mockSanityImage.asset._id,
          crop: mockSanityImage.crop,
          width: 1000,
          height: 2000,
          mode: 'cover',
        }),
      ).toEqual(<ImageQueryParams>{
        crop: 'entropy',
        rect: '0,0,750,750',
        w: 375,
        h: 750,
        fit: 'crop',
        q: 75,
        auto: 'format',
      });

      expect(
        buildQueryParams({
          id: mockSanityImage.asset._id,
          width: 1000,
          height: 2000,
          mode: 'cover',
        }),
      ).toEqual(<ImageQueryParams>{
        crop: 'entropy',
        w: 500,
        h: 1000,
        fit: 'crop',
        q: 75,
        auto: 'format',
      });
    });

    it('should applies hotspot', () => {
      expect(
        buildQueryParams({
          id: mockSanityImage.asset._id,
          width: 375,
          height: 100,
          mode: 'cover',
          hotspot: mockSanityImage.hotspot,
        }),
      ).toEqual(<ImageQueryParams>{
        'fp-x': 0.25,
        'fp-y': 0.25,
        w: 375,
        h: 100,
        fit: 'crop',
        q: 75,
        auto: 'format',
      });
    });

    it('should hotspot compensates for crop input', () => {
      expect(
        buildQueryParams({
          id: mockSanityImage.asset._id,
          crop: mockSanityImage.crop,
          width: 375,
          height: 100,
          mode: 'cover',
          hotspot: mockSanityImage.hotspot,
        }),
      ).toEqual(<ImageQueryParams>{
        rect: '0,0,750,750',
        'fp-x': 0.333,
        'fp-y': 0.333,
        w: 375,
        h: 100,
        fit: 'crop',
        q: 75,
        auto: 'format',
      });
    });

    it('should tolerates out-of-bounds focal points', () => {
      expect(
        buildQueryParams({
          id: mockSanityImage.asset._id,
          crop: { top: 0, bottom: 0.2, left: 0.3, right: 0 },
          width: 500,
          height: 1000,
          mode: 'cover',
          hotspot: { x: 1, y: 1 },
        }),
      ).toEqual(<ImageQueryParams>{
        rect: '300,0,700,800',
        'fp-x': 1,
        'fp-y': 1,
        w: 400,
        h: 800,
        fit: 'crop',
        q: 75,
        auto: 'format',
      });

      expect(
        buildQueryParams({
          id: mockSanityImage.asset._id,
          crop: { top: 0, bottom: 0.2, left: 0.3, right: 0 },
          width: 200,
          height: 400,
          mode: 'cover',
          hotspot: { x: 1, y: 1 },
        }),
      ).toEqual(<ImageQueryParams>{
        rect: '300,0,700,800',
        'fp-x': 1,
        'fp-y': 1,
        w: 200,
        h: 400,
        fit: 'crop',
        q: 75,
        auto: 'format',
      });
    });

    it('should uses entropy crop if no hotspot', () => {
      expect(
        buildQueryParams({
          id: mockSanityImage.asset._id,
          crop: mockSanityImage.crop,
          width: 375,
          height: 100,
          mode: 'cover',
        }),
      ).toEqual(<ImageQueryParams>{
        rect: '0,0,750,750',
        w: 375,
        h: 100,
        fit: 'crop',
        crop: 'entropy',
        q: 75,
        auto: 'format',
      });
    });

    it('should falls back to max if not changing aspect ratio', () => {
      expect(
        buildQueryParams({
          id: mockSanityImage.asset._id,
          crop: mockSanityImage.crop,
          width: 500,
          height: 500,
          mode: 'cover',
        }),
      ).toEqual(<ImageQueryParams>{
        rect: '0,0,750,750',
        w: 500,
        fit: 'max',
        q: 75,
        auto: 'format',
      });
    });
  });

  describe('## Metadata', () => {
    it('should returns dimensions', () => {
      expect(
        buildQueryParams({
          id: mockSanityImage.asset._id,
          options: { includeMetadata: true },
        }).metadata,
      ).toEqual(<ImageQueryParams['metadata']>{
        sourceDimensions: { width: 1000, height: 1000, aspectRatio: 1 },
        outputDimensions: { width: 500, height: 500, aspectRatio: 1 },
      });

      expect(
        buildQueryParams({
          id: mockSanityImage.asset._id,
          crop: mockSanityImage.crop,
          width: 2000,
          height: 1000,
          mode: 'cover',
          options: { includeMetadata: true },
        }).metadata,
      ).toEqual(<ImageQueryParams['metadata']>{
        sourceDimensions: { width: 1000, height: 1000, aspectRatio: 1 },
        outputDimensions: { width: 750, height: 375, aspectRatio: 2 },
      });

      expect(
        buildQueryParams({
          id: mockSanityImage.asset._id,
          crop: mockSanityImage.crop,
          width: 2000,
          height: 1000,
          mode: 'contain',
          options: { includeMetadata: true },
        }).metadata,
      ).toEqual(<ImageQueryParams['metadata']>{
        sourceDimensions: { width: 1000, height: 1000, aspectRatio: 1 },
        outputDimensions: { width: 750, height: 750, aspectRatio: 1 },
      });

      expect(
        buildQueryParams({
          id: mockSanityImage.asset._id,
          crop: mockSanityImage.crop,
          width: 2000,
          height: 500,
          mode: 'contain',
          options: { includeMetadata: true },
        }).metadata,
      ).toEqual(<ImageQueryParams['metadata']>{
        sourceDimensions: { width: 1000, height: 1000, aspectRatio: 1 },
        outputDimensions: { width: 500, height: 500, aspectRatio: 1 },
      });
    });
  });

  describe('## Query params', () => {
    it('only uses auto format if no format is specified', () => {
      expect(
        buildQueryParams({
          id: mockSanityImage.asset._id,
          queryParams: { fm: 'webp' },
        }).auto,
      ).toEqual(undefined);
    });

    it('passes through valid query params', () => {
      expect(
        buildQueryParams({
          id: mockSanityImage.asset._id,
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
