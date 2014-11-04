/** @jsx React.DOM */

/**
 * Module dependencies
 */

var React = require('react');
var sdk = require('require-sdk')('https://www.youtube.com/iframe_api', 'YT');
var loadTrigger = sdk.trigger();

/**
 * Create a new `YouTube` component.
 */

var YouTube = React.createClass({
  propTypes: {

    // url to play. It's kept in sync, changing it will
    // cause the player to refresh and play the new url.
    url: React.PropTypes.string.isRequired,

    // custom ID for player element
    id: React.PropTypes.string,

    // autoplay the video when loaded.
    autoplay: React.PropTypes.bool,

    // event subscriptions
    onPlay: React.PropTypes.func,
    onPause: React.PropTypes.func,
    onEnd: React.PropTypes.func
  },

  getDefaultProps: function() {
    return {
      id: 'react-yt-player',
      autoplay: false,
      onPlay: noop,
      onPause: noop,
      onEnd: noop
    };
  },

  getInitialState: function() {
    return {
      player: null
    };
  },

  /**
   * Once YouTube API had loaded, a new YT.Player
   * instance will be created and its events bound.
   */
  
  componentDidMount: function() {
    var _this = this;

    var opts = {
      id: this.props.id,
      url: this.props.url,
      listener: this._handlePlayerStateChange
    };

    createPlayer(opts, function(player) {
      _this.setState({player: player});
    });
  },

  /**
   * If the `url` has changed, load it.
   *
   * @param {Object} nextProps
   */

  componentWillUpdate: function(nextProps) {
    if (this.props.url !== nextProps.url) {
      this._loadUrl(nextProps.url);
    }
  },

  render: function() {
    return (
      <div id={this.props.id}></div>
    );
  },

  /**
   * Start a new video
   *
   * @param {String} url
   */
  
  _loadUrl: function(url) {
    if (this.props.autoplay) {
      this.state.player.loadVideoById(getVideoId(url));
    } else {
      this.state.player.cueVideoById(getVideoId(url));
    }
  },

  /**
   * Respond to player events
   *
   * @param {Object} event
   */
  
  _handlePlayerStateChange: function(event) {
    switch(event.data) {
      case 0: 
        this.props.onEnd();
        break;

      case 1:
        this.props.onPlay();
        break;

      case 2:
        this.props.onPause();
        break;

      default: 
        return;
    }
  }
});

/**
 * YT API required global ready event handler
 */

window.onYouTubeIframeAPIReady = function () {
  loadTrigger();
  delete window.onYouTubeIframeAPIReady;
};

/**
 * Create a new `player` by requesting and using the YouTube Iframe API
 *
 * @param {Object} opts
 *    @param {String} id - reference to element for player
 *    @param {String} url - the first url to play
 *    @param {Function} listener - function listening to player events
 *    @param {Function} cb
 */

function createPlayer(opts, cb) {
  return sdk(function(err, youtube) {
    var player = new youtube.Player(opts.id, {
      videoId: getVideoId(opts.url),
      events: {
        'onStateChange': opts.listener
      }
    });

    return cb(player);
  });
}

/**
 * Separates video ID from valid YouTube URL
 *
 * @param {String} url
 * @return {String}
 */

function getVideoId(url) {
  var regex = /(youtu\.be\/|youtube\.com\/(watch\?(.*&)?v=|(embed|v)\/))([^\?&"'>]+)/;
  if (url) return url.match(regex)[5];
}

/**
 * Do nothing
 */

function noop() {}

/**
 * Expose `YouTube` component
 */

module.exports = YouTube;
