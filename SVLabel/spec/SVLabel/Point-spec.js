// Introduction to Jasmine
// http://jasmine.github.io/2.0/introduction.html

// Comment out the Todo for Alex and pass all the tests

describe("The Point module's basic API", function () {
  describe("canvas coordinate API", function () {
    var pov = {
      heading: 0,
      pitch: 0,
      zoom: 1
    };
    var param = {};

    // Test X-coordinate
    var p1 = new Point(1, 1, pov, param);
    it("should initialize canvas x-coordinate to 0", function () {
      expect(p1.getCanvasX()).toBe(0);
    });

    var p2 = new Point(1, 0, pov, param);
    it("should not initialize canvas x-coordinate to 0", function () {
      expect(p2.getCanvasX()).not.toBe(0);
    });

    it("should initialize canvas x-coordinate to 1", function () {
      expect(p2.getCanvasX()).toBe(1);
    });

    // Todo for Alex
    it("should initialize canvas y-coordinate to 0", function () {
      expect(p1.getCanvasY()).toBe(0);
    });

    var p3 = new Point(1, 1, pov, param);
    it("should not initialize canvas y-coordinate to 0", function () {
      expect(p3.getCanvasY()).not.toBe(0);
    });

    it("should initialize canvas y-coordinate to 0", function () {
      expect(p3.getCanvasY()).toBe(1);
    });
  });
});

describe("The Point module's constructor", function () {
  var pov = {
    heading: 0,
    pitch: 0,
    zoom: 1
  };
  var param = {};
  var p1 = Point(0, 0, pov, {});

  it("should initialize fillStyle with 'rgba(255,255,255,0.5)'", function () {
      expect(p1.getFill()).toBe("rgba(255,255,255,0.5)");
  });

  it("should not initialize fillStyle with 'abcdef'", function () {
    expect(p1.getFill()).not.toBe('abcdef');
  });

  var p2 = Point(0, 0, pov, {fillStyle: 'rgba(255,255,255,0.5)'});
  it("should initialize fillStyle with 'rgba(255,255,255,0.5)'", function () {
    expect(p2.getFill()).toBe("rgba(255,255,255,0.5)");
  });

  var p3 = Point(0, 0, pov, {fillStyle: 'rgba(0,0,0,0.5)'});
  it("should not initialize fillStyle with 'rgba(255,255,255,0.5)'", function () {
    expect(p3.getFill()).not.toBe("rgba(255,255,255,0.5)");
  });
  it("should initialize fillStyle with 'rgba(0,0,0,0.5)'", function () {
    expect(p3.getFill()).toBe('rgba(0,0,0,0.5)');
  });

});
