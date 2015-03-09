describe("Tests for the Keyboard module.", function () {
  var keyboard = new Keyboard(jQuery);

  describe("The clearShiftDown method", function() {
    it("should set status.shiftDown to false", function() {
      keyboard.setStatus('shiftDown', true);
      expect(keyboard.getStatus('shiftDown')).toBeFalsy();
    });
  });
});
