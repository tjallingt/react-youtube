/**
 * Module dependencies
 */

import React from 'react';
import globalize from 'random-global';
import randomize from 'random-string';
import createPlayer from './lib/createPlayer';

/**
 * Create a new `YouTube` component.
 */

class YouTube extends React.Component {
  static propTypes = {
    // changing the url will cause a new player to be loaded
    url: React.PropTypes.string.isRequired,

    // custom ID for player element
    id: React.PropTypes.string,

    // custom class name for player element
    className: React.PropTypes.string,

    // https://developers.google.com/youtube/iframe_api_reference#Loading_a_Video_Player
    opts: React.PropTypes.object,

    // event subscriptions
    onReady: React.PropTypes.func,
    onError: React.PropTypes.func,
    onPlay: React.PropTypes.func,
    onPause: React.PropTypes.func,
    onEnd: React.PropTypes.func,
    onStateChange: React.PropTypes.func,
  };

  static defaultProps = {
    opts: {},
    onReady: () => {},
    onError: () => {},
    onPlay: () => {},
    onPause: () => {},
    onEnd: () => {},
    onStateChange: () => {},
  };

  /**
   * @param {Object} props
   */

  constructor(props) {
    super(props);

    this._containerId = props.id || randomize();
    this._internalPlayer = null;
    this._playerReadyHandle = null;
    this._playerErrorHandle = null;
    this._stateChangeHandle = null;

    this.onPlayerReady = this.onPlayerReady.bind(this);
    this.onPlayerError = this.onPlayerError.bind(this);
    this.onPlayerStateChange = this.onPlayerStateChange.bind(this);
  }

  componentDidMount() {
    this.onChangeUrl();
  }

  /**
   * @param {Object} nextProps
   * @returns {Boolean}
   */

  shouldComponentUpdate(nextProps) {
    return nextProps.url !== this.props.url;
  }

  componentDidUpdate() {
    this.onChangeUrl();
  }

  componentWillUnmount() {
    this.onReset();
  }

  onChangeUrl() {
    this.onReset();

    createPlayer(this._containerId, this.props, (player) => {
      this._internalPlayer = player;

      // YT API requires event handlers to be globalized
      this._playerReadyHandle = globalize(this.onPlayerReady);
      this._playerErrorHandle = globalize(this.onPlayerError);
      this._stateChangeHandle = globalize(this.onPlayerStateChange);

      this._internalPlayer.addEventListener('onReady', this._playerReadyHandle);
      this._internalPlayer.addEventListener('onError', this._playerErrorHandle);
      this._internalPlayer.addEventListener('onStateChange', this._stateChangeHandle);
    });
  }

  onReset() {
    if (this._internalPlayer && typeof this._internalPlayer.removeEventListener === 'function') {
      this._internalPlayer.removeEventListener('onReady', this._playerReadyHandle);
      this._internalPlayer.removeEventListener('onError', this._playerErrorHandle);
      this._internalPlayer.removeEventListener('onStateChange', this._stateChangeHandle);
    }
    if (this._internalPlayer) {
      this._internalPlayer.destroy();
    }

    delete this._playerReadyHandle;
    delete this._playerErrorHandle;
    delete this._stateChangeHandle;
  }

  /**
   * https://developers.google.com/youtube/iframe_api_reference#onReady
   *
   * @param {Object} event
   *   @param {Object} target - player object
   */

  onPlayerReady(event) {
    this.props.onReady(event);
  }

  /**
   * https://developers.google.com/youtube/iframe_api_reference#onError
   *
   * @param {Object} event
   *   @param {Integer} data  - error type
   *   @param {Object} target - player object
   */

  onPlayerError(event) {
    this.props.onError(event);
  }

  /**
   * https://developers.google.com/youtube/iframe_api_reference#onStateChange
   *
   * @param {Object} event
   *   @param {Integer} data  - status change type
   *   @param {Object} target - actual YT player
   */

  onPlayerStateChange(event) {
    this.props.onStateChange(event);
    
    switch (event.data) {

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
   * @returns Object
   */

  render() {
    return (
      <div id={this._containerId} className={this.props.className || ''} />
    );
  }
}

/**
 * Expose `YouTube`
 */

export default YouTube;
