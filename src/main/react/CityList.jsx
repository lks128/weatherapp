var
  React = require('react'),
  vent = require('../javascript/vent.js'),
  store = require('../javascript/store.js');

require('../less/CityList.less');

module.exports = React.createClass({
  getInitialState: function() {
    return {
      cities: {}
    };
  },
  componentDidMount: function() {
    var that = this;
    vent.on('store:updated', function() {
      that.setState({
        cities: store().cities
      });
    });
  },
  deleteCityFunc: function(name) {
    return function() {
      vent.trigger('store:cities:delete', name);
    };
  },
  //  <a onClick={ that.deleteCityFunc(x.guid) }>del</a>
  render: function() {
    var that = this;
    var cities = Object.keys(this.state.cities).map(function(guid) {
      var x = that.state.cities[guid];
      var weather = null;
      var icon = null;

      if(x.weather && x.weather.current) {
        var parts = [];

        parts.push(x.weather.current.weather.map(function(x){
          return x.description;
        }).join(', '));

        parts.push("ветер: " + x.weather.current.wind.speed + " м/с");

        //parts.push("давление: " + x.weather.current.main.pressure + " hPa");

        parts.push("влажность: " + x.weather.current.main.humidity + "%");

        weather = parts.join(", ");

        icon = "http://openweathermap.org/img/w/" + x.weather.current.weather[0].icon + ".png";
      }

      return (
        <li>
          <div className="left">
            <img src={icon}/>
            <div>
              <div className="name" onClick={function(){vent.trigger('store:weather:fetch-current',x)}}>{ x.name }</div>
              <div className="subline">{weather}</div>
            </div>
          </div>
          <div>
            <div className="temp">{ x.weather && Math.round(x.weather.current.main.temp || 0) }</div>
            <div className="oc">°C</div>
          </div>
        </li>
      );
    });
    return (
      <div data-component="CityList">
        <ul>{ cities }</ul>
      </div>
    );
  }
});
