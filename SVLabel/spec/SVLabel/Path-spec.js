// Introduction to Jasmine
// http://jasmine.github.io/2.0/introduction.html

// Comment out the Todo for Alex and pass all the tests

describe("The Path module's basic API", function () {
  var pov = {
    heading: 0,
    pitch: 0,
    zoom: 1
  };
  var param = {};

  // Test X-coordinate
  var p1 = new Point(0, 0, pov, param);
  var p2 = new Point(9, 0, pov, param);
  var p3 = new Point(5, 5, pov, param);

  var path = new Path([p1, p2, p3], {});

  describe("Fill coordinate API", function () {
    it("this Path should have three points", function () {
      expect(path.getPoints()).toBe(3);
    });

    it("should have default color 'rgba(255,255,255,0.5)''", function () {
      expect(path.getFill()).toBe('rgba(255,255,255,0.5)');
    });

    it("should allow one to set fill color", function () {
      path.setFill('rgba(10,10,10,0.5)');
      expect(path.getFill()).toBe('rgba(10,10,10,0.5)');

      // convert 'rgb' to 'rgba'. Set default alpha to be 0.5
      path.setFill('rgb(20,20,20)');
      expect(path.getFill()).toBe('rgba(10,10,10,0.5)');
    });
  });

  describe("LineWidth API", function () {

    it("should have default lineWidth '3'", function () {
      expect(path.getLineWidth()).toBe('3');
    });

    it("should allow one to set line width", function () {
      path.setLineWidth('5');
      expect(path.getLineWidth()).toBe('5');

      path.setLineWidth(15);
      expect(path.getLineWidth()).toBe('15');

      path.setLineWidth('foo'); // Should not allow illegal input
      expect(path.getLineWidth()).toBe('15');
    });
  });
});
