/**
 * Module dependencies
 */

import expect from 'expect';
import proxyquire from 'proxyquire';

/**
 * Create & provide access to a mocked youtube player used inside `YouTube`
 *
 * @returns {Object}
 */

const setupYouTube = () => {
  const playerMock = {
    on: expect.createSpy(),
    cueVideoById: expect.createSpy(),
    loadVideoById: expect.createSpy(),
    destroy: expect.createSpy(),
  };

  const YouTube = proxyquire('../../src/YouTube', {
    'youtube-player': () => playerMock,
  }).default;

  return {
    playerMock,
    YouTube,
  };
};

export default setupYouTube;
