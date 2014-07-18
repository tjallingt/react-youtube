/** @jsx React.DOM */

/**
 * Module dependencies
 */

var React = require('react');
var sdk = require('require-sdk')('https://www.youtube.com/iframe_api', 'YT');
var loadTrigger = sdk.trigger();

// YT API requires global ready event handler
window.onYouTubeIframeAPIReady = function () {
  loadTrigger();
  delete window.onYouTubeIframeAPIReady;
};

module.exports = React.createClass({
  getInitialState: function() {
    return {
      player: undefined,
      url: undefined
    };
  },

  componentDidMount: function() {
    var _this = this;

    sdk(function(err, youtube) {
      var player = new youtube.Player('yt-player', {
        videoId: getVideoId(_this.props.url)
      });

      _this.setState({player: player, url: _this.props.url});
    });
  },

  componentDidUpdate: function() {
    if (this.props.url !== this.state.url) {
      this.state.player.cueVideoById(getVideoId(this.props.url));
    }
  },

  render: function() {
    return (
      <div id='yt-player'></div>
    );
  }
});


/**
 * Separates video ID from valid YouTube URL
 *
 * @param {string} url
 * @return {string}
 */

function getVideoId(url) {
  var regex = /(youtu\.be\/|youtube\.com\/(watch\?(.*&)?v=|(embed|v)\/))([^\?&"'>]+)/;
  if (url) return url.match(regex)[5];
}