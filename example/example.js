/** @jsx React.DOM */

/**
 * Module dependencies
 */

var React = require('react');
var YouTube = require('../');

window.React = React;

var url = 'https://www.youtube.com/watch?v=tITYj52gXxU';
var url2 = 'https://www.youtube.com/watch?v=vW7qFzT7cbA';

var Example = React.createClass({
  getInitialState: function() {
    return {
      url: url
    };
  },

  _changeUrl: function() {
    var newUrl = this.state.url === url ? url2 : url;
    this.setState({url: newUrl});
  },

  _onPlay: function() {
    console.log('playing');
  },

  render: function() {
    return (
      <div>
        <button onClick={this._changeUrl}>Change URL</button>
        <YouTube url={this.state.url} onPlay={this._onPlay} />
      </div>
    );
  }
});

/**
 * Render Example
 */

React.renderComponent(<Example />, document.body);
