describe("Tests for the Tracker module.", function () {
  var tracker = new Tracker();
  describe("The getActions method", function () {
    it("should return the correct number of actions", function () {
      expect(tracker.getActions().length).toBe(0);
    });


  });

  describe("The getAvailableActionTypes method", function () {

    it("should return the list of availableActionTypes", function () {
      // Note: availableActionTypes.length == 107
      expect(tracker.getAvailableActionTypes().length).toBe(0);
    });
  });

  describe("The push method", function () {
    it("should check if a type of action is in the list of availableActionTypes", function () {
      expect(true).toBe(false);
    });

    // Alex. Don't worry about passing 'param' to the method for now.
  });
});
