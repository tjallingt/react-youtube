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

function noop() {}

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

/**
 * Simple wrapper over YouTube JavaScript API
 */

module.exports = React.createClass({
  propTypes: {
    id: React.PropTypes.string,
    url: React.PropTypes.string,
    autoplay: React.PropTypes.bool,
    playing: React.PropTypes.func,
    stopped: React.PropTypes.func,
    ended: React.PropTypes.func
  },

  getDefaultProps: function() {
    return {
      id: 'react-yt-player',
      url: undefined,
      autoplay: false,
      playing: noop,
      stopped: noop,
      ended: noop
    };
  },

  /**
   * Once YouTube API had loaded, a new YT.Player
   * instance will be created and its events bound.
   */
  
  componentDidMount: function() {
    var _this = this;
    // called once API has loaded.
    sdk(function(err, youtube) {
      var player = new youtube.Player(_this.props.id, {
        videoId: getVideoId(_this.props.url),
        events: {
          'onStateChange': _this._handlePlayerStateChange
        }
      });

      _this.setState({player: player});
    });
  },

  componentWillUpdate: function(nextProps) {
    if (this.props.url !== nextProps.url) {
      this._loadNewUrl(nextProps.url);
    }
  },

  /**
   * Start a new video
   *
   * @param {string} url
   */
  
  _loadNewUrl: function(url) {
    this.props.autoplay
      ? this.state.player.loadVideoById(getVideoId(url))
      : this.state.player.cueVideoById(getVideoId(url));
  },

  /**
   * Respond to player events
   *
   * @param {object} event
   */
  
  _handlePlayerStateChange: function(event) {
    switch(event.data) {
      case 0: 
        this.props.ended();
        break;

      case 1:
        this.props.playing();
        break;

      case 2:
        this.props.stopped();
        break;

      default: 
        return;
    }
  },

  render: function() {
    return (
      <div id={this.props.id}></div>
    );
  }
});
