/**
 * Expose `getVideoId`
 */

module.exports = getVideoId;

/**
 * Separates video ID from valid YouTube URL
 *
 * Taken gratefully from https://gist.github.com/afeld/1254889
 *
 * @param {String} url
 * @return {String}
 */

function getVideoId(url) {
  var regex = /(youtu\.be\/|youtube\.com\/(watch\?(.*&)?v=|(embed|v)\/))([^\?&"'>]+)/;
  if (url) return url.match(regex)[5];
}
