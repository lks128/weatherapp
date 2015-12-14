var
  vent = require('./vent'),
  update = require('react-addons-update'),
  get = require('jquery').get,
  guid = require('./guid');

var defaultStore = (function() {
  var city = {
    guid: guid(),
    name: "Санкт-Петербург",
    description: "Санкт-Петербург, Россия",
    latitude: 59.938531,
    longitude: 30.313497
  };

  var obj = { cities: {}, predictions: [] };
  obj.cities[city.guid] = city;

  return obj
}());

var store = {
    cities: {},
    predictions: []
};

module.exports = function() {
  return store;
};

vent.on('init', function() {
  vent.trigger('store:load');
});

vent.on('store:updated', function() {
  console.log('STORE', store);
});

vent.on('store:cities:add', function(data) {
  var query = { cities: { }, predictions: { $set: [] } };
  data.guid = data.guid || guid();
  query.cities[data.guid] = { $set: data };
  store = update(store, query);
  vent.trigger('store:updated');
  vent.trigger('store:save');
  vent.trigger('store:weather:fetch-current', data);
});

vent.on('store:cities:delete', function(guid) {
  delete store.cities[guid];

  // force reference update
  var query = { cities: { $set: store.cities }};
  store = update(store, query);
  vent.trigger('store:updated');
  vent.trigger('store:save');
});

vent.on('store:clear', function() {
  var query = { cities: { $set: {} }, predictions: { $set: [] }};
  store = update(store, query);
  vent.trigger('store:updated');
  vent.trigger('store:save');
});

vent.on('store:save', function() {
  localStorage.weatherAppData = JSON.stringify(store);
  vent.trigger('store:saved');
});

vent.on('store:load', function() {
  var data = JSON.parse(localStorage.weatherAppData || null);

  if(data === null || typeof data.cities === 'undefined') {
    vent.trigger('store:cities:detect');
  } else {
    var query = { $set: data };
    store = update(store, query);
    Object.keys(store.cities).forEach(function(guid) {
      vent.trigger('store:weather:fetch-current', store.cities[guid]);
    });
    vent.trigger('store:updated');
  }
});

vent.on('store:cities:detect', function() {
  if(typeof ymaps !== 'undefined') {
    ymaps.ready(function() {
      var geo = ymaps.geolocation;
      var city = {
        name: geo.city,
        description: geo.city + ", " + geo.country,
        latitude: geo.latitude,
        longitude: geo.longitude
      };
      if((typeof city.name !== undefined)
        && (typeof city.description !== undefined)
        && (typeof city.latitude !== undefined)
        && (typeof city.longitude !== undefined)) {
          vent.trigger('store:cities:add', city);
          vent.trigger('store:updated');
        } else {
          vent.trigger('store:cities:detect:failed');
        }
    });
  } else {
    vent.trigger('store:cities:detect:failed');
  }
});

vent.on('store:cities:detect:failed', function() {
  var query = { cities: { $set: defaultStore.cities }};
  store = update(store, query);
  vent.trigger('store:updated');
});

vent.on('city-finder:type', function(text) {
  var url = "https://maps.googleapis.com/maps/api/place/autocomplete/json" +
    "?types=(cities)&language=ru&key=AIzaSyA5DRWBKD8yuM7UHm3voNT5eTgK_36aIaA" +
    "&input=" + text;

  get(url, function(data) {
    var query = { predictions: { $set: data.predictions } };
    store = update(store, query);
    vent.trigger('store:updated');
  });
});

vent.on('city-finder:selected', function(data) {
  var url = "https://maps.googleapis.com/maps/api/place/details/json" +
    "?key=AIzaSyA5DRWBKD8yuM7UHm3voNT5eTgK_36aIaA&language=ru" +
    "&reference=" + data.reference;

  get(url, function(data) {
    var city = {
      latitude: data.result.geometry.location.lat,
      longitude: data.result.geometry.location.lng,
      name: data.result.name,
      description: data.result.formatted_address
    };
    vent.trigger('store:cities:add', city);
  });
});

vent.on('store:weather:fetch-current', function(cityObj) {
  var url = "http://api.openweathermap.org/data/2.5/weather" +
    "?lat=" + cityObj.latitude + "&lon=" + cityObj.longitude + "&units=metric" +
    "&lang=ru&appid=f31ee16ddee5e607b770d4a58492e0fe";

  get(url, function(data) {
    var query = { cities: {} };
    query.cities[cityObj.guid] = { weather: { $set: { current: data } } };
    store = update(store, query);
    vent.trigger('store:updated');
    vent.trigger('store:save');
  });
});
