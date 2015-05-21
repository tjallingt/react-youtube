/**
 * Module dependencies
 */

import React from 'react';
import globalize from 'random-global';
import createPlayer from './lib/createPlayer';

/**
 * Create a new `YouTube` component.
 */

class YouTube extends React.Component {

  /**
   * @returns {Object}
   */

  static get defaultProps() {
    return {
      id: 'react-yt-player',
      opts: {},
      onReady: () => {},
      onPlay: () => {},
      onPause: () => {},
      onEnd: () => {}
    };
  }

  /**
   * @returns {Object}
   */

  static get propTypes() {
    return {
      // url to play. It's kept in sync, changing it will
      // cause the player to refresh and play the new url.
      url: React.PropTypes.string.isRequired,

      // custom ID for player element
      id: React.PropTypes.string,

      // Options passed to a new `YT.Player` instance
      // https://developers.google.com/youtube/iframe_api_reference#Loading_a_Video_Player
      //
      // NOTE: Do not include event listeners in here, they will be ignored.
      //
      opts: React.PropTypes.object,

      // event subscriptions
      onReady: React.PropTypes.func,
      onPlay: React.PropTypes.func,
      onPause: React.PropTypes.func,
      onEnd: React.PropTypes.func
    };
  }

  /**
   * @param {Object} props
   */

  constructor(props) {
    super(props);

    this._internalPlayer = null;
    this._playerReadyHandle = null;
    this._stateChangeHandle = null;

    this._handlePlayerReady = this._handlePlayerReady.bind(this);
    this._handlePlayerStateChange = this._handlePlayerStateChange.bind(this);
  }

  /**
   * @param {Object} nextProps
   * @returns {Boolean}
   */

  shouldComponentUpdate(nextProps) {
    return nextProps.url !== this.props.url;
  }

  componentDidMount() {
    this._createPlayer();
  }

  componentDidUpdate() {
    this._createPlayer();
  }

  componentWillUnmount() {
    this._destroyPlayer();
  }

  /**
   * @returns Object
   */

  render() {
    return (
      <div id={this.props.id} />
    );
  }

  /**
   * Create a new `internalPlayer`.
   *
   * This is called on every render, which is only triggered after
   * `props.url` has changed. Setting or changing any other props
   * will *not* cause a new player to be loaded.
   */

  _createPlayer() {
    this._destroyPlayer();

    createPlayer(this.props, (player) => {
      this._setupPlayer(player);
    }.bind(this));
  }

  /**
   * Destroy the currently embedded player/iframe and remove any event listeners
   * bound to it.
   */

  _destroyPlayer() {
    if (this._internalPlayer) {
      this._unbindEvents();
      this._destroyGlobalEventHandlers();
      this._internalPlayer.destroy();
    }
  }

  /**
   * Integrate a newly created `player` with the rest of the component.
   *
   * @param {Object} player
   */

  _setupPlayer(player) {
    this._internalPlayer = player;
    this._globalizeEventHandlers();
    this._bindEvents();
  }

  /**
   * When the player is all loaded up, load the url
   * passed via `props.url` and notify anybody listening.
   *
   * Is exposed in the global namespace under a random
   * name, see `_globalizeEventHandlers`
   */

  _handlePlayerReady() {
    this.props.onReady();
  }

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

  _handlePlayerStateChange(event) {
    switch(event.data) {

      case window.YT.PlayerState.ENDED:
        this.props.onEnd(event);
        break;

      case window.YT.PlayerState.PLAYING:
        this.props.onPlay(event);
        break;

      case window.YT.PlayerState.PAUSED:
        this.props.onPause(event);
        break;

      default:
        return;
    }
  }

  /**
   * Expose our player event handlers onto the global namespace
   * under random handles, then store those handles into `state`.
   *
   * The YouTube API requires a `player`s event handlers to be
   * exposed in the global namespace, so this is unfortunate but necessary.
   */

  _globalizeEventHandlers() {
    this._playerReadyHandle = globalize(this._handlePlayerReady);
    this._stateChangeHandle = globalize(this._handlePlayerStateChange);
  }

  /**
   * Clean up the ickyness of globalness.
   */

  _destroyGlobalEventHandlers() {
    delete window[this._playerReadyHandle];
    delete window[this._stateChangeHandle];
  }

  /**
   * Listen for events coming from `player`.
   */

  _bindEvents() {
    this._internalPlayer.addEventListener('onReady', this._playerReadyHandle);
    this._internalPlayer.addEventListener('onStateChange', this._stateChangeHandle);
  }

  /**
   * Remove all event bindings.
   */

  _unbindEvents() {
    this._internalPlayer.removeEventListener('onReady', this._playerReadyHandle);
    this._internalPlayer.removeEventListener('onStateChange', this._stateChangeHandle);
  }
}

/**
 * Expose `YouTube`
 */

export default YouTube;
