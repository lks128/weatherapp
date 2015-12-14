var //
  React = require('react');

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
    var iconUrl = "http://openweathermap.org/img/w/" + this.props.icon + ".png";

    return (
      <div data-component="WeatherSmall">
        <div className="day">{weekday}</div>
        <img title={this.props.title} src={iconUrl}/>
        <div className="temps">
          <span title="днём">{formatTemperature(this.props.day)}</span> <span title="ночью" className="night">{formatTemperature(this.props.night)}</span>
        </div>
      </div>
    )
  }
});
