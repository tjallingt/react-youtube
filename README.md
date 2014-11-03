react-youtube player component
=============================

Simple [React](http://facebook.github.io/react/ ) component using the [YouTube JS Player API](https://developers.google.com/youtube/js_api_reference)

Installation
------------

`npm install react-youtube`

Usage
-----

```js
var React = require('react');
var ReactYouTube = require('react-youtube');

var App = React.createClass({
  render: function() {
    return (
      <div>

        // `id` will be the YT Player iframe's container ID. Completely 
        // optional, defaults to 'react-yt-player'
        //
        // `autoplay` decides whether playback needs to be started manually
        //  or not, defaults to 'false'
        //
        // `url` is  the only parameter needed to play a video. Player automatically
        // loads it when it is changed.
        //
        // `playing`, `stopped`, and `ended` are event handlers called by the player.
        // They default to no-ops.

        <ReactYoutube id={'react-player'}
                      autoplay={false}
                      url={'https://www.youtube.com/watch?v=OvJDiZwGGd4'}
                      playing={this._handlePlay}
                      stopped={this._handleStop}
                      ended={this._handleEnd}
        />

        // Simplest version of component
        <ReactYoutube url={'https://www.youtube.com/watch?v=OvJDiZwGGd4'} />
      </div>
    );
  },

  _handlePlay: function() {
    console.log('video is playing');
  },

  _handleStop: function() {
    console.log('video is stopped');
  },

  // load a new video or call an alert or something like that.
  _handleEnd: function() {
  console.log('video has ended');
  }
});
