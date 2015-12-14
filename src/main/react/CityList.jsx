var
  React = require('react'),
  vent = require('../javascript/vent.js'),
  store = require('../javascript/store.js');

var // components
  CityListItem = require('./CityListItem.jsx'),
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

    vent.on('city-list:selected', function(guid) {
      that.setState({
        selected: guid
      });
    });

    vent.on('city-list:unselected', function() {
      that.setState({
        selected: null
      });
    });
  },
  render: function() {
    var that = this;

    var listItems = Object.keys(this.state.cities).map(function(guid) {
      return <CityListItem selected={that.state.selected === guid} guid={guid} />
    });

    return (
      <div data-component="CityList">
        <ul>{listItems}</ul>
      </div>
    );
  }
});
