import { buildSrc } from "@/utils";
import { mockSanityImage } from "@tests/mocks";

describe("# Build image source", () => {
  // Returns metadata as well as single `src` url
  it("builds a src with metadata", () => {
    expect(
      buildSrc({ id: mockSanityImage.asset._id, width: 500, baseUrl: "/images/" }),
    ).toEqual({
      src: "/images/79f37b3f070b144d45455d514ff4e9fc43035649-1000x1000.png?auto=format&fit=max&q=75&w=500",
      width: 500,
      height: 500,
    });
  });
});
