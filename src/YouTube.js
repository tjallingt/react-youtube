import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';
import youTubePlayer from 'youtube-player';

const YouTube = (props) => {
  const {
    videoId,
    id = null,
    className = null,
    opts = {
      playerVars: {}
    },
    containerClassName = '',
    onReady = () => {},
    onError = () => {},
    onPlay = () => {},
    onPause = () => {},
    onEnd = () => {},
    onStateChange = () => {},
    onPlaybackRateChange = () => {},
    onPlaybackQualityChange = () => {},
  } = props;

  const containerRef = useRef(null);
  const internalPlayerRef = useRef(null);

  useEffect(() => {
    console.log('createPlayer', id, className);
    createPlayer();

    return () => {
      /**
       * Note: The `youtube-player` package that is used promisifies all Youtube
       * Player API calls, which introduces a delay of a tick before it actually
       * gets destroyed. Since React attempts to remove the element instantly
       * this method isn't quick enough to reset the container element.
       */
      if (internalPlayerRef.current) {
        internalPlayerRef.current.destroy();
      }
    }
  }, []);

  useEffect(() => {
    if (id || className) {
      updatePlayer();
    }
  }, [id, className]);

  useEffect(() => {
    resetPlayer();
  }, [opts]);

  useEffect(() => {
    updateVideo();
  }, [videoId, opts.playerVars.start, opts.playerVars.end]);

  /**
   * https://developers.google.com/youtube/iframe_api_reference#onReady
   *
   * @param {Object} event
   *   @param {Object} target - player object
   */
  const onPlayerReady = event => onReady(event);

  /**
   * https://developers.google.com/youtube/iframe_api_reference#onError
   *
   * @param {Object} event
   *   @param {Integer} data  - error type
   *   @param {Object} target - player object
   */
  const onPlayerError = event => onError(event);

  /**
   * https://developers.google.com/youtube/iframe_api_reference#onStateChange
   *
   * @param {Object} event
   *   @param {Integer} data  - status change type
   *   @param {Object} target - actual YT player
   */
  const onPlayerStateChange = (event) => {
    onStateChange(event);

    switch (event.data) {
      case YouTube.PlayerState.ENDED:
        onEnd(event);
        break;

      case YouTube.PlayerState.PLAYING:
        onPlay(event);
        break;

      case YouTube.PlayerState.PAUSED:
        onPause(event);
        break;

      default:
    }
  };

  /**
   * https://developers.google.com/youtube/iframe_api_reference#onPlaybackRateChange
   *
   * @param {Object} event
   *   @param {Float} data    - playback rate
   *   @param {Object} target - actual YT player
   */
  const onPlayerPlaybackRateChange = event => onPlaybackRateChange(event);

  /**
   * https://developers.google.com/youtube/iframe_api_reference#onPlaybackQualityChange
   *
   * @param {Object} event
   *   @param {String} data   - playback quality
   *   @param {Object} target - actual YT player
   */
  const onPlayerPlaybackQualityChange = event => onPlaybackQualityChange(event);

  /**
   * Initialize the Youtube Player API on the container and attach event handlers
   */
  const createPlayer = () => {
    // do not attempt to create a player server-side, it won't work
    if (typeof document === 'undefined') return;
    // create player
    const playerOpts = {
      ...opts,
      // preload the `videoId` video if one is already given
      videoId
    };
    internalPlayerRef.current = youTubePlayer(containerRef.current, playerOpts);
    // attach event handlers
    internalPlayerRef.current.on('ready', onPlayerReady);
    internalPlayerRef.current.on('error', onPlayerError);
    internalPlayerRef.current.on('stateChange', onPlayerStateChange);
    internalPlayerRef.current.on('playbackRateChange', onPlayerPlaybackRateChange);
    internalPlayerRef.current.on('playbackQualityChange', onPlayerPlaybackQualityChange);
  };

  /**
   * Shorthand for destroying and then re-creating the Youtube Player
   */
  const resetPlayer = () => internalPlayerRef.current.destroy().then(createPlayer);

  /**
   * Method to update the id and class of the Youtube Player iframe.
   * React should update this automatically but since the Youtube Player API
   * replaced the DIV that is mounted by React we need to do this manually.
   */
  const updatePlayer = () => {
    internalPlayerRef.current.getIframe().then((iframe) => {
      if (id) iframe.setAttribute('id', id);
      else iframe.removeAttribute('id');
      if (className) iframe.setAttribute('class', className);
      else iframe.removeAttribute('class');
    });
  };

  /**
   * Call Youtube Player API methods to update the currently playing video.
   * Depeding on the `opts.playerVars.autoplay` this function uses one of two
   * Youtube Player API methods to update the video.
   */
  const updateVideo = () => {
    if (typeof videoId === 'undefined' || videoId === null) {
      internalPlayerRef.current.stopVideo();
      return;
    }

    // set queueing options
    let autoplay = false;
    const opts = { videoId };
    if ('playerVars' in opts) {
      autoplay = opts.playerVars.autoplay === 1;
      if ('start' in opts.playerVars) {
        opts.startSeconds = opts.playerVars.start;
      }
      if ('end' in opts.playerVars) {
        opts.endSeconds = opts.playerVars.end;
      }
    }

    // if autoplay is enabled loadVideoById
    if (autoplay) {
      internalPlayerRef.current.loadVideoById(opts);
      return;
    }
    // default behaviour just cues the video
    internalPlayerRef.current.cueVideoById(opts);
  };

  const refContainer = (container) => {
    containerRef.current = container;
  };

  return (
    <div className={containerClassName}>
      <div id={id} className={className} ref={refContainer} />
    </div>
  );
};

/**
 * Expose PlayerState constants for convenience. These constants can also be
 * accessed through the global YT object after the YouTube IFrame API is instantiated.
 * https://developers.google.com/youtube/iframe_api_reference#onStateChange
 */
YouTube.PlayerState = {
  UNSTARTED: -1,
  ENDED: 0,
  PLAYING: 1,
  PAUSED: 2,
  BUFFERING: 3,
  CUED: 5,
}

YouTube.propTypes = {
  videoId: PropTypes.string,

  // custom ID for player element
  id: PropTypes.string,

  // custom class name for player element
  className: PropTypes.string,
  // custom class name for player container element
  containerClassName: PropTypes.string,

  // https://developers.google.com/youtube/iframe_api_reference#Loading_a_Video_Player
  opts: PropTypes.objectOf(PropTypes.any),

  // event subscriptions
  onReady: PropTypes.func,
  onError: PropTypes.func,
  onPlay: PropTypes.func,
  onPause: PropTypes.func,
  onEnd: PropTypes.func,
  onStateChange: PropTypes.func,
  onPlaybackRateChange: PropTypes.func,
  onPlaybackQualityChange: PropTypes.func,
};

export default YouTube;
