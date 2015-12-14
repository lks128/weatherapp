var
  React = require('react');

module.exports = React.createClass({
  iconUrl: function() {
    if(typeof this.props.icon !== 'undefined') {
      return "http://openweathermap.org/img/w/" + this.props.icon + ".png";
    } else {
      return "https://placeholdit.imgix.net/~text?w=50&h=50";
    }
  },
  render: function() {
    return (
      <img title={ this.props.title } style={{ width: 50, height: 50 }} src={ this.iconUrl() } />
    );
  }
});
