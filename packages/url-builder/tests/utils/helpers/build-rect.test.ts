import { buildRect } from "@/utils/helpers"

describe("buildRect", () => {
  it("works with zeroed crop values", () => {
    expect(
      buildRect(
        { width: 2000, height: 1000 },
        { top: 0, left: 0, right: 0, bottom: 0 }
      )
    ).toBe("0,0,2000,1000")
  })

  it("works for complex crop values", () => {
    expect(
      buildRect(
        { width: 2000, height: 1000 },
        { top: 0.15, left: 0.1, right: 0.25, bottom: 0.05 }
      )
    ).toBe("200,150,1300,800")
  })

  it("throws an error for inaccurate/pixel based crop values", () => {
    expect(() =>
      buildRect(
        { width: 2000, height: 1000 },
        { top: 100, left: 200, right: 500, bottom: 1000 }
      )
    ).toThrowError()
  })

  it("rounds values", () => {
    expect(
      buildRect(
        { width: 30, height: 90 },
        { top: 0.15, left: 0.1, right: 0.25, bottom: 0.05 }
      )
    ).toBe("3,14,20,72")
  })
})