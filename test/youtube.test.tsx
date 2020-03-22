import React from 'react';
import ReactDOM from 'react-dom';
import { YouTube } from '../src/component';

describe('YouTube', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<YouTube />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  // TODO?
});
