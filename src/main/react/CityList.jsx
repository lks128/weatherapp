var
  React = require('react'),
  vent = require('../javascript/vent.js'),
  store = require('../javascript/store.js');

//require('../less/CityFinder.less');

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
  render: function() {
    var that = this;
    var cities = Object.keys(this.state.cities).map(function(guid) {
      var x = that.state.cities[guid];
      return (
        <li>
          <div>{ x.name }</div>
          <div>{ x.description }</div>
          <a onClick={ that.deleteCityFunc(x.guid) }>del</a>
        </li>
      );
    });
    return (
      <div>
        <ul>{ cities }</ul>
      </div>
    );
  }
});
