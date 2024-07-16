import { croppedImageSize } from "@/utils/helpers"

describe("# Cropped image size", () => {
  it("works with zeroed crop values", () => {
    expect(
      croppedImageSize(
        { width: 2000, height: 1000 },
        { top: 0, left: 0, right: 0, bottom: 0 }
      )
    ).toEqual({ width: 2000, height: 1000, aspectRatio: 2 })
  })

  it("works for complex crop values", () => {
    expect(
      croppedImageSize(
        { width: 2000, height: 1000 },
        { top: 0.15, left: 0.1, right: 0.25, bottom: 0.05 }
      )
    ).toEqual({ width: 1300, height: 800, aspectRatio: 1.625 })
  })
})