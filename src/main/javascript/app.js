var vent = require('./vent');
var store = require('./store');
var React = require('react');
var ReactDOM = require('react-dom');

var // components
  Application = require('../react/Application.jsx');

// render react
ReactDOM.render(React.createElement(Application, null),
  document.getElementById('app'));

// start app
vent.trigger('init');
