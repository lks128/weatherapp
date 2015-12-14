var
  React = require('react'),
  vent = require('../javascript/vent.js'),
  store = require('../javascript/store.js');

var // components
  WeatherSmall = require('./WeatherSmall.jsx');

require('../less/CityList.less');

module.exports = React.createClass({
  getInitialState: function() {
    return {
      cities: {},
      selected: null
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
  deleteCityFunc: function(guid) {
    return function() {
      vent.trigger('store:cities:delete', guid);
    };
  },
  selectCityFunc: function(guid) {
    var that = this;
    return function() {
      that.setState({
        selected: (that.state.selected === guid) ? null : guid
      });
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

      var days = [];

      if(x.weather && x.weather.daily) {
        days = x.weather.daily.list.map(function(w) {
          return <WeatherSmall title={ w.weather[0].description } icon={ w.weather[0].icon } date={ w.dt } day={ Math.round(w.temp.day) } night={ Math.round(w.temp.night) } />
        });
      }

      var daily = [
        <div style={{ marginTop: 15, marginBottom: 15, display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
          { days }
        </div>,
        <div className="subline">
          <a onClick={that.deleteCityFunc(x.guid)}>удалить</a> | <a onClick={that.selectCityFunc(x.guid)}>скрыть прогноз</a>
        </div>
      ];

      return (
        <li className={ that.state.selected === x.guid ? 'active' : '' } onClick={ that.state.selected === x.guid ? null : that.selectCityFunc(x.guid)}>
          <div className="top">
            <div className="left">
              <img src={icon}/>
              <div>
                <div className="name">{ x.name }</div>
                <div className="subline">{weather}</div>
              </div>
            </div>
            <div>
              <div className="temp">{ x.weather && x.weather.current && Math.round(x.weather.current.main.temp || 0) }</div>
              <div className="oc">°C</div>
            </div>
          </div>
          <div className="bottom">
            { that.state.selected === x.guid ? daily : null }
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
