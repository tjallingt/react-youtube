react-youtube player component
=============================

Simple [React](http://facebook.github.io/react/ ) component acting as a thin layer over the [YouTube JS Player API](https://developers.google.com/youtube/js_api_reference)

## Features
- url playback
- playback event bindings
- lazy API loading

## Installation

```
$ npm install react-youtube
```

Usage
-----

```js
var React = require('react');
var YouTube = require('react-youtube');

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

        <YouTube id={'react-player'}
                      autoplay={false}
                      url={'https://www.youtube.com/watch?v=OvJDiZwGGd4'}
                      onPlay={this._handlePlay}
                      onPause={this._handleStop}
                      onEnd={this._handleEnd}
        />

        // Simplest version of component
        <YouTube url={'https://www.youtube.com/watch?v=OvJDiZwGGd4'} />
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
```

## Caveat

 Programmatic control of the player as outlined in the [API docs](https://developers.google.com/youtube/js_api_reference) isn't included.

If decide to take control of it, be aware that the react-youtube uses `loadVideoById`, `cueVideoById`, `addEventListener` and `removeEventListener` internally. 

Using these methods outside the component may cause problems. 

# License

  MIT
