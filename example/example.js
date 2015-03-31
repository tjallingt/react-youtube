/**
 * Module dependencies
 */

import React from 'react';
import YouTube from '../';
import './normalize.css';
import './example.css';

const urlA = 'https://www.youtube.com/watch?v=5hGHdETNteE';
const urlB = 'https://www.youtube.com/watch?v=I7IdS-PbEgI';

/**
 * Example component that toggles between two urls while responding
 * to playback events from the widget.
 */

class Example extends React.Component {
  constructor() {
    this.state = {
      url: urlA
    };

    this._changeUrl = this._changeUrl.bind(this);
    this._onPlay = this._onPlay.bind(this);
    this._onPause = this._onPause.bind(this);
    this._onEnd = this._onEnd.bind(this);
  }

  render() {
    const playerOptions = {
      playerVars: {
        autohide: 1,
        modestbranding: 1
      }
    };

    return (
      <div className='example'>
        <YouTube
          url={this.state.url}
          id={'gh-pages-youtube'}
          opts={playerOptions}
          onPlay={this._onPlay}
          onPause={this._onPause}
          onEnd={this._onEnd}>
        </YouTube>

        <div className='changeUrl'>
          <button onClick={this._changeUrl}>Change url</button>
        </div>
      </div>
    );
  }

  /**
   * Toggle between urlA & urlB
   */

  _changeUrl() {
    this.setState({
      url: this.state.url === urlA ? urlB : urlA
    });
  }

  _onPlay() {
    console.log('PLAYING');
  }

  _onPause() {
    console.log('PAUSED');
  }

  _onEnd() {
    console.log('ENDED');
  }
}

/**
 * Render the example
 */

/* eslint-disable no-undef */
React.render(<Example />, document.getElementsByClassName('content')[0]);
