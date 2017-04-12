/**
 * Module dependencies
 */

import React from 'react';
import TestUtils from 'react-dom/test-utils';
import setupYouTube from './setupYouTube';

/**
 * Helper for testing the output of a component's `render` method
 *
 * @param {Object} [props] - component instance props
 * @returns {Object}
 */

const shallowRender = (props) => {
  const { YouTube } = setupYouTube();

  const renderer = TestUtils.createRenderer();
  renderer.render(<YouTube { ...props } />);

  const output = renderer.getRenderOutput();

  return {
    props,
    output,
  };
};

export default shallowRender;
