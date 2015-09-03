/**
 * Module dependencies
 */

import assign from 'object-assign';
import getYouTubeId from 'get-youtube-id';

/**
 * Create a new `player` by requesting and using the YouTube Iframe API
 *
 * @param {String} containerId - id of div container
 * @param {Object} props
 *   @param {String} url - url to be loaded
 *   @param {Object} playerVars - https://developers.google.com/youtube/player_parameters
 *
 * @param {Function} cb
 */

const createPlayer = (containerId, props, cb) => {
  const YouTubeIframeLoader = require('youtube-iframe');

  const params = assign({}, props.opts, {
    videoId: getYouTubeId(props.url)
  });

  return YouTubeIframeLoader.load((YT) => cb(new YT.Player(containerId, params)));
};

/**
 * Expose `createPlayer`
 */

export default createPlayer;
