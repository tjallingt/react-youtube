/**
 * Module dependencies
 */

var React = require('react');
var getYouTubeId = require('get-youtube-id');
var globalize = require('random-global');
var createPlayer = require('./lib/createPlayer');

var internalPlayer;
var playerReadyHandle;
var stateChangeHandle;

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

    // event subscriptions
    onReady: React.PropTypes.func,
    onPlay: React.PropTypes.func,
    onPause: React.PropTypes.func,
    onEnd: React.PropTypes.func,

    // YT.Player parameters
    // https://developers.google.com/youtube/player_parameters
    playerParameters: React.PropTypes.object
  },

  getDefaultProps: function() {
    return {
      id: 'react-yt-player',
      onReady: noop,
      onPlay: noop,
      onPause: noop,
      onEnd: noop,
      playerParameters: {}
    };
  },

  /**
   * Once YouTube API had loaded, a new YT.Player
   * instance will be created and its events bound.
   */

  componentDidMount: function() {
    createPlayer(this.props.id, this.props.playerParameters, function(player) {
      this._setupPlayer(player);
    }.bind(this));
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

  componentWillUnmount: function() {
    this._unbindEvents();
    this._destroyGlobalEventHandlers();
  },

  render: function() {
    return (
      React.createElement('div', {id: this.props.id})
    );
  },

  /**
   * Integrate a newly created `player` with the rest of the component.
   *
   * @param {Object} player
   */

  _setupPlayer: function(player) {
    internalPlayer = player;
    this._globalizeEventHandlers();
    this._bindEvents();
  },

  /**
   * Start a new video
   *
   * @param {String} url
   */

  _loadUrl: function(url) {
    internalPlayer.cueVideoById(getYouTubeId(url));
  },

  /**
   * When the player is all loaded up, load the url
   * passed via `props.url` and notify anybody listening.
   *
   * Is exposed in the global namespace under a random
   * name, see `_globalizeEventHandlers`
   */

  _handlePlayerReady: function() {
    this.props.onReady();
    this._loadUrl(this.props.url);
  },

  /**
   * Respond to player events
   *
   * Event definitions at https://developers.google.com/youtube/js_api_reference#Events
   *
   * Is exposed in the global namespace under a random
   * name, see `_globalizeEventHandlers`
   *
   * @param {Object} event
   */

  _handlePlayerStateChange: function(event) {
    switch(event.data) {

      case window.YT.PlayerState.ENDED:
        this.props.onEnd();
        break;

      case window.YT.PlayerState.PLAYING:
        this.props.onPlay();
        break;

      case window.YT.PlayerState.PAUSED:
        this.props.onPause();
        break;

      default:
        return;
    }
  },

  /**
   * Expose our player event handlers onto the global namespace
   * under random handles, then store those handles into `state`.
   *
   * The YouTube API requires a `player`s event handlers to be
   * exposed in the global namespace, so this is unfortunate but necessary.
   */

  _globalizeEventHandlers: function() {
    playerReadyHandle = globalize(this._handlePlayerReady);
    stateChangeHandle = globalize(this._handlePlayerStateChange);
  },

  /**
   * Clean up the ickyness of globalness.
   */

  _destroyGlobalEventHandlers: function() {
    delete window[playerReadyHandle];
    delete window[stateChangeHandle];
  },

  /**
   * Listen for events coming from `player`.
   */

  _bindEvents: function() {
    internalPlayer.addEventListener('onReady', playerReadyHandle);
    internalPlayer.addEventListener('onStateChange', stateChangeHandle);
  },

  /**
   * Remove all event bindings.
   */

  _unbindEvents: function() {
    internalPlayer.removeEventListener('onReady', playerReadyHandle);
    internalPlayer.removeEventListener('onStateChange', stateChangeHandle);
  }
});

/**
 * Do nothing
 */

function noop() {}

/**
 * Expose `YouTube` component
 */

module.exports = YouTube;
