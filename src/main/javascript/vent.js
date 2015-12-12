"use strict";

var // required libraries
	Wreqr = require("backbone.wreqr");

var // initializing variables
	vent = new Wreqr.EventAggregator();

// we want to see every event in the log
// note: if one event triggers another at once,
//       they will be logged in a reversed order
vent.on("all", function(){
	console.log("(" + arguments[0] + ")", Array.prototype.slice.call(arguments, 1));
});

window.vent = vent;
module.exports = vent;
