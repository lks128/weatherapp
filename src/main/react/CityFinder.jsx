var
  React = require('react'),
  vent = require('../javascript/vent.js'),
  store = require('../javascript/store.js');

require('../less/CityFinder.less');

module.exports = React.createClass({
  getInitialState: function() {
    return {
      predictions: []
    };
  },
  componentDidMount: function() {
    var that = this;
    vent.on('store:updated', function() {
      that.setState({
        predictions: store().predictions
      });
    });
  },
  inputChange: function(e) {
    vent.trigger('city-finder:type', e.target.value);
  },
  selectCityFunc: function(city) {
    var that = this;
    return function() {
      that.refs.city.value = "";
      vent.trigger('city-finder:selected', city);
    };
  },
  render: function() {
    var that = this;
    var variants = this.state.predictions.map(function(x) {
      return <li onClick={that.selectCityFunc(x)}>{ x.description }</li>
    });
    return (
      <div data-component="CityFinder">
        <input ref="city" onChange={ this.inputChange } type="text" placeholder="Добавить город"/>
        <ul>{ variants }</ul>
      </div>
    );
  }
});
