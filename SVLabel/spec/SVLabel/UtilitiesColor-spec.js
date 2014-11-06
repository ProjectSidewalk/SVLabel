// Introduction to Jasmine
// http://jasmine.github.io/2.0/introduction.html

// Comment out the Todo for Alex and pass all the tests

describe("The UtilitiesColor", function () {
  describe("RGBToRGBA", function () {
    it("should convert rgb to RGBA", function () {
      var rgb = "rgb(255,255,255)";
      expect(svw.util.color.RGBToRGBA(rgb, 0.5)).toBe('rgba(255,255,255,0.5)');
      expect(svw.util.color.RGBToRGBA(rgb, 0.5)).not.toBe('rgba(0,0,0,0.5)');
    });

    it("should set the default alpha to 0.5", function () {
      expect(svw.util.color.RGBToRGBA(rgb)).toBe('rgba(255,255,255,0.5)');
      expect(svw.util.color.RGBToRGBA(rgb)).not.toBe('rgba(255,255,255,0.2)');
    });
  });

  describe("svw.util.color.changeAlphaRGBA", function () {
    it("should convert rgba's alpha", function () {
      svw.util.color.changeAlphaRGBA('rgba(255,255,255,0)', 0.5).toBe('rgba(255,255,255,0.5)');
      svw.util.color.changeAlphaRGBA('rgba(255,255,255,0)', '0.5').toBe('rgba(255,255,255,0.5)');
    });

    it("should not take illegal input", function () {
      svw.util.color.changeAlphaRGBA('rgba(255,255,255,0)', 'baa').toBe('rgba(255,255,255,0)');
    });
  });
});
