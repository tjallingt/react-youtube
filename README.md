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
----
```js
<YouTube 
  url={string}            // required
  id={string}             // defaults -> 'react-yt-player'
  autoplay={bool}         // defaults -> false
  onPlayerReady={func}    // defaults -> noop
  onVideoReady={func}     // defaults -> noop
  onPlay={func}           // defaults -> noop
  onPause={func}          // defaults -> noop
  onEnd={func}            // defaults -> noop
  playerParameters={obj}  // defaults -> {}
/> 
```

Example
-----

```js
var React = require('react');
var YouTube = require('react-youtube');

var Example = React.createClass({
  _onPlay: function() {
    console.log('PLAYING');
  },

  render: function() {
    var playerParams = { height: '390', width: '640' }
    return (
      <YouTube
        url={'http://www.youtube.com/watch?v=2g811Eo7K8U'}
        onPlay={this._onPlay}
        playerParameters={playerParams}
      />
    );
  }
});

```

## Caveat

 Programmatic control of the player as outlined in the [API docs](https://developers.google.com/youtube/js_api_reference) isn't included.

If decide to take control of it, be aware that the react-youtube uses `loadVideoById`, `cueVideoById`, `addEventListener` and `removeEventListener` internally. 

Using these methods outside the component may cause problems. 

# License

  MIT
