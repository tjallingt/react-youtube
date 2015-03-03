/**
 * Module dependencies
 */

var React = require('react');
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

    // Parameters passed to a new `YT.Player` instance
    // https://developers.google.com/youtube/iframe_api_reference#Loading_a_Video_Player
    //
    // NOTE: Do not include event listeners in here, they will be ignored.
    //
    playerParameters: React.PropTypes.object
  },

  getDefaultProps: function() {
    return {
      id: 'react-yt-player',
      playerParameters: {},
      onReady: noop,
      onPlay: noop,
      onPause: noop,
      onEnd: noop
    };
  },

  shouldComponentUpdate: function(nextProps) {
    return nextProps.url !== this.props.url;
  },

  componentWillUnmount: function() {
    this._destroyPlayer();
  },

  render: function() {
    this._createPlayer();

    return (
      React.createElement('div', {id: this.props.id})
    );
  },

  /**
   * Create a new `internalPlayer`.
   *
   * This is called on every render, which is only triggered after
   * `props.url` has changed. Setting or changing any other props
   * will *not* cause a new player to be loaded.
   */

  _createPlayer: function() {
    this._destroyPlayer();

    createPlayer(this.props, function(player) {
      this._setupPlayer(player);
    }.bind(this));
  },

  /**
   * Destroy the currently embedded player/iframe and remove any event listeners
   * bound to it.
   */

  _destroyPlayer: function() {
    if (internalPlayer) {
      this._unbindEvents();
      this._destroyGlobalEventHandlers();
      internalPlayer.destroy();
    }
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
   * When the player is all loaded up, load the url
   * passed via `props.url` and notify anybody listening.
   *
   * Is exposed in the global namespace under a random
   * name, see `_globalizeEventHandlers`
   */

  _handlePlayerReady: function() {
    this.props.onReady();
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
