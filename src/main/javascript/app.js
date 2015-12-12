var vent = require('./vent');
var store = require('./store');
var React = require('react');
var ReactDOM = require('react-dom');

var // components
  TestComponent = require('../react/TestComponent.jsx');

// render react
ReactDOM.render(React.createElement(TestComponent, null),
  document.getElementById('app'));

// start app
vent.trigger('init');
