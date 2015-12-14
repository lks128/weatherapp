var
  React = require('react'),
  vent = require('../javascript/vent.js'),
  store = require('../javascript/store.js');

var // components
  WeatherIcon = require('./WeatherIcon.jsx'),
  CityForecast = require('./CityForecast.jsx');

require('../less/CityListItem.less');

module.exports = React.createClass({
  triggerSelected: function() {
    vent.trigger('city-list:selected', this.props.guid);
  },
  triggerUnselected: function() {
    vent.trigger('city-list:unselected');
  },
  triggerDelete: function() {
    vent.trigger('store:cities:delete', this.props.guid);
  },
  currentWeather: function() {
    return store().cities[this.props.guid].weather.current || { weather: [{}], wind: {}, main: {}};
  },
  currentWeatherIcon: function() {
    return this.currentWeather().weather[0].icon;
  },
  currentWeatherTitle: function() {
    return this.currentWeather().weather[0].description;
  },
  currentTemp: function() {
    return Math.round(this.currentWeather().main.temp || 0);
  },
  currentInfo: function() {
    return [
      this.currentWeatherTitle(),
      'ветер: ' + this.currentWeather().wind.speed + ' м/с',
      'влажность: ' + this.currentWeather().main.humidity + '%'
    ].join(', ');
  },
  city: function() {
    return store().cities[this.props.guid];
  },
  render: function() {
    var onlyWhenSelected = null;

    if(this.props.selected) {
      onlyWhenSelected = [
        <CityForecast guid={ this.props.guid } />,
        <div className="actions">
          <a onClick={this.triggerDelete}>удалить</a> | <a onClick={this.triggerUnselected}>скрыть прогноз</a>
        </div>
      ];
    }

    return (
      <li className={ this.props.selected ? 'selected' : null }
          onClick={ this.props.selected ? null : this.triggerSelected}
          data-component="CityListItem">
        <div className="top">
          <div className="left">
            <WeatherIcon icon={ this.currentWeatherIcon() } title={ this.currentWeatherTitle() } />
          </div>
          <div className="center">
            <div className="name">{ this.city().name }</div>
            <div className="info">{ this.currentInfo() }</div>
          </div>
          <div className="right">
            <div className="temp">{this.currentTemp()}</div>
            <div className="celsius">°C</div>
          </div>
        </div>
        { onlyWhenSelected }
      </li>
    );
  }
});
