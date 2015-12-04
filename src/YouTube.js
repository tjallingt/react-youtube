/**
 * Module dependencies
 */

import React from 'react';
import _ from 'underscore';
import youTubePlayer from 'youtube-player';
import getYouTubeId from 'get-youtube-id';

/**
 * Create a new `YouTube` component.
 */

class YouTube extends React.Component {
  static propTypes = {
    // videoId takes precedence over props.url
    videoId: React.PropTypes.string,

    url: React.PropTypes.string,

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

    this._containerId = props.id || _.uniqueId('player_');
    this._internalPlayer = null;
  }

  componentDidMount() {
    this.createPlayer();
  }

  componentDidUpdate(prevProps) {
    const optsHaveChanged = !(_.isEqual(prevProps.opts, this.props.opts));
    const videoHasChanged = this.getVideoId(prevProps) !== this.getVideoId();

    if (optsHaveChanged) {
      return this.resetPlayer();
    }

    if (videoHasChanged) {
      this.updateVideo();
    }
  }

  componentWillUnmount() {
    this.destroyPlayer();
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

  getVideoId(props = this.props) {
    return props.videoId || getYouTubeId(props.url, {fuzzy: false});
  }

  createPlayer() {
    // create player
    this._internalPlayer = youTubePlayer(this._containerId, { ...this.props.opts });
    // attach event handlers
    this._internalPlayer.on('ready', ::this.onPlayerReady);
    this._internalPlayer.on('error', ::this.onPlayerError);
    this._internalPlayer.on('stateChange', ::this.onPlayerStateChange);
    // update video
    this.updateVideo();
  }

  destroyPlayer() {
    return this._internalPlayer.destroy();
  }

  resetPlayer() {
    this.destroyPlayer().then(this.createPlayer);
  }

  updateVideo() {
    const videoId = this.getVideoId();

    // if autoplay is enabled loadVideoById
    if (typeof this.props.opts.playerVars !== 'undefined' && this.props.opts.playerVars.autoplay === 1) {
      this._internalPlayer.loadVideoById(videoId);
      return;
    }
    // default behaviour just cues the video
    this._internalPlayer.cueVideoById(videoId);
  }

  /**
   * @returns Object
   */

  render() {
    return (
      <div id={this._containerId} className={this.props.className} />
    );
  }
}

/**
 * Expose `YouTube`
 */

export default YouTube;
