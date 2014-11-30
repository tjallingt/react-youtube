/**
 * Module dependencies
 */

var React = require('react');
var YouTube = require('../');

var url = 'http://www.youtube.com/watch?v=2g811Eo7K8U';
var url2 = 'http://www.youtube.com/watch?v=_OBlgSz8sSM';

var Example = React.createClass({
  getInitialState: function() {
    return {
      url: url
    };
  },

  _changeUrl: function() {
    var newUrl = this.state.url === url ? url2 : url;
    this.setState({url: newUrl});
  },

  _onPlayerReady: function() {
    console.log('PLAYER READY');
  },

  _onVideoReady: function() {
    console.log('VIDEO READY');
  },

  _onPlay: function() {
    console.log('PLAYING');
  },

  _onPause: function() {
    console.log('PAUSED');
  },

  _onEnd: function() {
    console.log('ENDED');
  },

  render: function() {
    return (
      <div className='example'>
        <YouTube url={this.state.url} 
                 onPlayerReady={this._onPlayerReady}
                 onVideoReady={this._onVideoReady}
                 onPlay={this._onPlay} 
                 onPause={this._onPause}
                 onEnd={this._onEnd} />

        <div className='changeUrl'>
          <button onClick={this._changeUrl}>Change url</button>
        </div>
      </div>
    );
  }
});

/**
 * Render Example
 */

React.render(<Example />, document.querySelector('section.content'));
