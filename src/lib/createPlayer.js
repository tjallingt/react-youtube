/**
 * Module dependencies
 */

import load from 'require-sdk';
import assign from 'object-assign';
import getYouTubeId from 'get-youtube-id';

/**
 * Create a new `player` by requesting and using the YouTube Iframe API
 *
 * @param {Object} props
 *   @param {String} url - url to be loaded
 *   @param {String} id - id of div container
 *   @param {Object} playerVars - https://developers.google.com/youtube/player_parameters
 *
 * @param {Function} cb
 */

const createPlayer = (props, cb) => {
  const sdk = loadApi();

  const params = assign({}, props.opts, {
    videoId: getYouTubeId(props.url)
  });


  return sdk((err) => {
    // need to handle err better.
    if (err) {
      console.error(err);
    }

    return cb(new window.YT.Player(props.id, params));
  });
};

/**
 * Load the YouTube API
 *
 * @returns {Function}
 */

const loadApi = () => {
  const sdk = load('https://www.youtube.com/iframe_api', 'YT');
  const loadTrigger = sdk.trigger();

  /**
   * The YouTube API requires a global ready event handler.
   * The YouTube API really sucks.
   */

  window.onYouTubeIframeAPIReady = () => {
    loadTrigger();
    delete window.onYouTubeIframeAPIReady;
  };

  return sdk;
};

/**
 * Expose `createPlayer`
 */

export default createPlayer;
