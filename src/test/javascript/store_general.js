var
  vent = require('../../main/javascript/vent.js'),
  store = require('../../main/javascript/store.js'),
  guid = require('../../main/javascript/guid.js');

describe('Store', function() {

  beforeEach(function(done) {
    var callback = function() {
      vent.off('store:updated', callback);
      done();
    }
    vent.on('store:updated', callback);
    vent.trigger('store:clear');
  });

  xit('should contain cities collection', function() {
    expect(store().cities).toEqual(jasmine.any(Object));
  });

  it('should add a city by request', function(done) {
    var city = {
      guid: guid(),
      name: "City",
      latitude: 1,
      longitude: 2
    };

    var oldCities = store().cities;

    var callback = function() {
      vent.off('store:updated', callback);
      expect(Object.keys(store().cities)).toContain(city.guid);
      expect(store().cities === oldCities).toBe(false);
      done();
    }

    expect(Object.keys(store().cities)).not.toContain(city.guid);
    vent.on('store:updated', callback);
    vent.trigger('store:cities:add', city);
  });

  it('should delete a city by request', function(done) {
    var city1 = {
      guid: guid(),
      name: "City1",
      latitude: 1,
      longitude: 2
    };

    var city2 = {
      guid: guid(),
      name: "City2",
      latitude: 1,
      longitude: 2
    };

    var afterDelete = function() {
      vent.off('store:updated', afterDelete);
      expect(Object.keys(store().cities)).toEqual([city2.guid]);
      done();
    };

    var afterAdd2 = function() {
      vent.off('store:updated', afterAdd2);
      vent.on('store:updated', afterDelete);
      vent.trigger('store:cities:delete', city1.guid);
    };

    var afterAdd1 = function() {
      vent.off('store:updated', afterAdd1);
      vent.on('store:updated', afterAdd2);
      vent.trigger('store:cities:add', city2);
    };

    vent.on('store:updated', afterAdd1);
    vent.trigger('store:cities:add', city1);
  });

  it('should clear store by request', function(done) {
    var oldStore = store();
    var callback = function() {
      vent.off('store:updated', callback);
      expect(store().cities).toEqual({});
      expect(store() === oldStore).toBe(false);
      done();
    }
    vent.on('store:updated', callback);
    vent.trigger('store:clear');
  });

  it('should be able to store cities to the localStorage and get them back', function(done) {

    var oldStore;

    var loadCallback = function() {
      vent.off('store:updated', loadCallback);
      expect(store()).toEqual(oldStore);
      done();
    };

    var clearCallback = function() {
      vent.off('store:updated', clearCallback);
      vent.on('store:updated', loadCallback);
      vent.trigger('store:load');
    };

    var saveCallback = function() {
      vent.off('store:saved', saveCallback);
      vent.on('store:updated', clearCallback);
      vent.trigger('store:clear');
    };

    var addCallback = function() {
      oldStore = store();
      vent.off('store:updated', addCallback);
      vent.on('store:saved', saveCallback);
      vent.trigger('store:save');
    };

    vent.on('store:updated', addCallback);
    vent.trigger('store:cities:add', {
      name: "City",
      latitude: 1,
      longitude: 2
    });

  });

  it('should try to determine city on load if it is not set', function(done) {

    localStorage.weatherAppData = null;

    var detectCallback = function() {
      vent.off('store:cities:detect', detectCallback);
      done();
    }

    vent.on('store:cities:detect', detectCallback);
    vent.trigger('store:load');

  });

  it('should set default city if automatic detection failed', function(done) {

    var callback = function() {
      vent.off('store:updated', callback);
      var key = Object.keys(store().cities)[0];
      expect(key).not.toBe(null);
      expect(store().cities[key].name).toBe("Санкт-Петербург");
      done();
    }

    vent.on('store:updated', callback);
    vent.trigger('store:cities:detect:failed');
  });

});
