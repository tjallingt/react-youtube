/**
 * Module dependencies
 */

import assign from 'lodash/assign';
import expect from 'expect';
import proxyquire from 'proxyquire';

/**
 * Create & provide access to a mocked youtube player used inside `YouTube`
 *
 * Calling a function returns a promise, see: https://github.com/gajus/youtube-player/blob/59ea18f044401f3b9ca282f47224f967a8df4712/src/index.js#L48
 *
 * @returns {Object}
 */

const setupYouTube = () => {
  const playerMethods = {
    on: expect.createSpy().andReturn(Promise.resolve()),
    cueVideoById: expect.createSpy().andReturn(Promise.resolve()),
    loadVideoById: expect.createSpy().andReturn(Promise.resolve()),
    getIframe: expect.createSpy().andReturn(Promise.resolve()),
    stopVideo: expect.createSpy().andReturn(Promise.resolve()),
    destroy: expect.createSpy().andReturn(Promise.resolve()),
  };
  const playerMock = expect.createSpy().andReturn(playerMethods);

  // Add the mocked methods to the playerMock object too, so they can be
  // accessed easily by tests.
  assign(playerMock, playerMethods);

  const YouTube = proxyquire('../../src/YouTube', {
    'youtube-player': playerMock,
  }).default;

  return {
    playerMock,
    YouTube,
  };
};

export default setupYouTube;
