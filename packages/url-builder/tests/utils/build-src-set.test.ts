import { buildSrcSet } from '@/utils';
import { mockSanityImage } from '@tests/mocks';

describe('# Build image source set', () => {
  const baseUrl = '/image/';

  it('generates a default srcset for mid-size images', () => {
    expect(buildSrcSet({ id: mockSanityImage.asset._id, width: 500, baseUrl })).toEqual(
      [
        '/image/79f37b3f070b144d45455d514ff4e9fc43035649-1000x1000.png?auto=format&fit=max&q=75&w=250 250w',
        '/image/79f37b3f070b144d45455d514ff4e9fc43035649-1000x1000.png?auto=format&fit=max&q=75&w=500 500w',
        '/image/79f37b3f070b144d45455d514ff4e9fc43035649-1000x1000.png?auto=format&fit=max&q=75&w=750 750w',
        '/image/79f37b3f070b144d45455d514ff4e9fc43035649-1000x1000.png?auto=format&fit=max&q=75&w=1000 1000w',
      ],
    );
  });

  it("doesn't scale up images", () => {
    expect(
      buildSrcSet({ id: mockSanityImage.asset._id, width: 1000, baseUrl }),
    ).toEqual([
      '/image/79f37b3f070b144d45455d514ff4e9fc43035649-1000x1000.png?auto=format&fit=max&q=75&w=250 250w',
      '/image/79f37b3f070b144d45455d514ff4e9fc43035649-1000x1000.png?auto=format&fit=max&q=75&w=500 500w',
      '/image/79f37b3f070b144d45455d514ff4e9fc43035649-1000x1000.png?auto=format&fit=max&q=75&w=750 750w',
      '/image/79f37b3f070b144d45455d514ff4e9fc43035649-1000x1000.png?auto=format&fit=max&q=75&w=1000 1000w',
    ]);

    expect(
      buildSrcSet({ id: mockSanityImage.asset._id, width: 2000, baseUrl }),
    ).toEqual([
      '/image/79f37b3f070b144d45455d514ff4e9fc43035649-1000x1000.png?auto=format&fit=max&q=75&w=250 250w',
      '/image/79f37b3f070b144d45455d514ff4e9fc43035649-1000x1000.png?auto=format&fit=max&q=75&w=500 500w',
      '/image/79f37b3f070b144d45455d514ff4e9fc43035649-1000x1000.png?auto=format&fit=max&q=75&w=750 750w',
      '/image/79f37b3f070b144d45455d514ff4e9fc43035649-1000x1000.png?auto=format&fit=max&q=75&w=1000 1000w',
    ]);
  });

  it('generates a smaller set for small images', () => {
    expect(buildSrcSet({ id: mockSanityImage.asset._id, width: 100, baseUrl })).toEqual(
      [
        '/image/79f37b3f070b144d45455d514ff4e9fc43035649-1000x1000.png?auto=format&fit=max&q=75&w=50 50w',
        '/image/79f37b3f070b144d45455d514ff4e9fc43035649-1000x1000.png?auto=format&fit=max&q=75&w=100 100w',
        '/image/79f37b3f070b144d45455d514ff4e9fc43035649-1000x1000.png?auto=format&fit=max&q=75&w=200 200w',
      ],
    );
  });

  it('skips tiny variants', () => {
    expect(buildSrcSet({ id: mockSanityImage.asset._id, width: 60, baseUrl })).toEqual([
      '/image/79f37b3f070b144d45455d514ff4e9fc43035649-1000x1000.png?auto=format&fit=max&q=75&w=60 60w',
      '/image/79f37b3f070b144d45455d514ff4e9fc43035649-1000x1000.png?auto=format&fit=max&q=75&w=120 120w',
    ]);
  });

  it('generates a broader srcset for large images', () => {
    expect(
      buildSrcSet({
        id: 'image-79f37b3f070b144d45455d514ff4e9fc43035649-10000x10000-png',
        width: 2000,
        baseUrl,
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
        id: mockSanityImage.asset._id,
        crop: mockSanityImage.crop,
        width: 500,
        height: 500,
        baseUrl,
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
        id: mockSanityImage.asset._id,
        crop: mockSanityImage.crop,
        width: 300,
        height: 500,
        mode: 'cover',
        baseUrl,
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
        id: mockSanityImage.asset._id,
        crop: { top: 0, bottom: 0.2, left: 0.3, right: 0 },
        width: 500,
        height: 1000,
        mode: 'cover',
        hotspot: { x: 1, y: 1 },
        baseUrl,
      }),
    ).toEqual([
      '/image/79f37b3f070b144d45455d514ff4e9fc43035649-1000x1000.png?auto=format&fit=crop&fp-x=1&fp-y=1&h=400&q=75&rect=300,0,700,800&w=200 200w',
      '/image/79f37b3f070b144d45455d514ff4e9fc43035649-1000x1000.png?auto=format&fit=crop&fp-x=1&fp-y=1&h=800&q=75&rect=300,0,700,800&w=400 400w',
    ]);
  });

  it("uses the largest image possible if a 2x isn't possible", () => {
    expect(
      buildSrcSet({
        id: mockSanityImage.asset._id,
        width: 600,
        baseUrl,
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
        id: mockSanityImage.asset._id,
        width: 600,
        baseUrl,
        queryParams: {
          q: 37,
          blur: 222,
        },
      }),
    ).toEqual([
      '/image/79f37b3f070b144d45455d514ff4e9fc43035649-1000x1000.png?auto=format&blur=222&fit=max&q=37&w=300 300w',
      '/image/79f37b3f070b144d45455d514ff4e9fc43035649-1000x1000.png?auto=format&blur=222&fit=max&q=37&w=600 600w',
      '/image/79f37b3f070b144d45455d514ff4e9fc43035649-1000x1000.png?auto=format&blur=222&fit=max&q=37&w=900 900w',
      '/image/79f37b3f070b144d45455d514ff4e9fc43035649-1000x1000.png?auto=format&blur=222&fit=max&q=37&w=1000 1000w',
    ]);
  });
});
