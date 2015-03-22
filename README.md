react-youtube player component
=============================

Simple [React](http://facebook.github.io/react/ ) component acting as a thin layer over the [YouTube JS Player API](https://developers.google.com/youtube/js_api_reference)

## Features
- url playback
- playback event bindings
- [customizable player options](https://developers.google.com/youtube/player_parameters)

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
  opts={obj}              // defaults -> {}
  onReady={func}          // defaults -> noop
  onPlay={func}           // defaults -> noop
  onPause={func}          // defaults -> noop
  onEnd={func}            // defaults -> noop
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
    var playerOptions = {
      height: '390',
      width: '640',
      playerVars: { // https://developers.google.com/youtube/player_parameters
        autoplay: 1
      }
    };

    return (
      <YouTube
        url={'http://www.youtube.com/watch?v=2g811Eo7K8U'}
        opts={playerOptions}
        onPlay={this._onPlay}
      />
    );
  }
});

```

## Caveat

 Programmatic control of the player as outlined in the [API docs](https://developers.google.com/youtube/js_api_reference) isn't included.

If decide to take control of it, be aware that the react-youtube uses `addEventListener` and `removeEventListener` internally.

Using these methods outside the component may cause problems.

# License

  MIT
