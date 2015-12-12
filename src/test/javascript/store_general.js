var store = require('../../main/javascript/store.js');

describe('Store', function() {
  it('should contain cities collection', function() {
    expect(store.cities).toEqual(jasmine.any(Object));
  });
});
