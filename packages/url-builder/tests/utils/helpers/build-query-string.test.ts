import { buildQueryString } from "@/utils/helpers"

describe("# Build query string", () => {
  it("converts object to sorted query string", () => {
    expect(
      buildQueryString({
        rect: "0,0,750,750",
        "fp-x": 0.333,
        "fp-y": 0.333,
        w: 375,
        h: 100,
        fit: "crop",
        q: 75,
        auto: "format",
      })
    ).toEqual(
      "auto=format&fit=crop&fp-x=0.333&fp-y=0.333&h=100&q=75&rect=0,0,750,750&w=375"
    )
  })
})