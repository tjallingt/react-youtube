/**
 * Module dependencies
 */

import assign from 'object-assign';
import getYouTubeId from 'get-youtube-id';
import YouTubeIframeLoader from 'youtube-iframe';

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
  const params = assign({}, props.opts, {
    videoId: getYouTubeId(props.url)
  });

  return YouTubeIframeLoader.load((YT) => cb(new YT.Player(props.id, params)));
};

/**
 * Expose `createPlayer`
 */

export default createPlayer;
