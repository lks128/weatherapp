var //
  React = require('react'),
  WeatherIcon = require('./WeatherIcon.jsx');

require('../less/WeatherSmall.less');

var weekdays = [
  'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'
]

function formatTemperature(temp) {
  if(temp > 0) {
    return "+" + temp + " °";
  }

  return temp + " °";
}

module.exports = React.createClass({
  render: function() {
    var weekday = weekdays[new Date(this.props.date * 1000).getDay()];

    return (
      <div data-component="WeatherSmall">
        <div className="day">{weekday}</div>
        <WeatherIcon icon={ this.props.icon } title={ this.props.title } />
        <div className="temps">
          <span title="днём">{formatTemperature(this.props.day)}</span> <span title="ночью" className="night">{formatTemperature(this.props.night)}</span>
        </div>
      </div>
    )
  }
});
