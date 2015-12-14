var
  React = require('react'),
  vent = require('../javascript/vent.js'),
  store = require('../javascript/store.js');

var // components
  WeatherSmall = require('./WeatherSmall.jsx');

require('../less/CityForecast.less');

module.exports = React.createClass({
  city: function() {
    return store().cities[this.props.guid];
  },
  render: function() {
    var items = this.city().weather.daily.list.map(function(w) {
      return <WeatherSmall title={ w.weather[0].description }
                           icon={ w.weather[0].icon }
                           date={ w.dt } day={ Math.round(w.temp.day) }
                           night={ Math.round(w.temp.night) } />
    });
    return (
      <div data-component="CityForecast">
        {items}
      </div>
    );
  }
});
