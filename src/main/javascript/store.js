var
  vent = require('./vent'),
  update = require('react-addons-update');

var defaultStore = {
  cities: [
    {
      name: "Санкт-Петербург",
      latitude: 0,
      longitude: 0
    }
  ]
};

var store = {
    cities: []
};

module.exports = function() {
  return store;
};

vent.on('store:cities:add', function(data) {
  var query = { cities: { $push: [data] }};
  store = update(store, query);
  vent.trigger('store:updated');
});

vent.on('store:cities:delete', function(name) {
  var index = -1;
  for(var i = 0; i < store.cities.length; i++) {
    if(store.cities[i].name === name) {
      index = i;
      break;
    }
  }

  if(index > -1) {
    var query = { cities: { $splice: [[index, 1]] } };
    store = update(store, query);
    vent.trigger('store:updated');
  } else {
    console.log('no such city', name);
  }
});

vent.on('store:clear', function() {
  var query = { cities: { $set: [] }};
  store = update(store, query);
  vent.trigger('store:updated');
});

vent.on('store:save', function() {
  localStorage.weatherAppData = JSON.stringify(store);
  vent.trigger('store:saved');
});

vent.on('store:load', function() {
  var data = JSON.parse(localStorage.weatherAppData);

  if(data === null || typeof data.cities === 'undefined') {
    vent.trigger('store:cities:detect');
  } else {
    var query = { $set: data };
    store = update(store, query);
    vent.trigger('store:updated');
  }
});

vent.on('store:cities:detect:failed', function() {
  var query = { cities: { $set: defaultStore.cities }};
  store = update(store, query);
  vent.trigger('store:updated');
});
