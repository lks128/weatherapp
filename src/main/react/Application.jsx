var React = require('react');

//require('../less/TestComponent.less');

var // components
  CityFinder = require('./CityFinder.jsx'),
  CityList = require('./CityList.jsx');

module.exports = React.createClass({
  render: function() {
    return (
      <div>
        <CityList />
        <CityFinder />
      </div>
    );
  }
});
