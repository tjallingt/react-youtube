react-youtube [![Build Status](https://travis-ci.org/troybetz/react-youtube.svg?branch=master)](https://travis-ci.org/troybetz/react-youtube)
=============================

Simple [React](http://facebook.github.io/react/ ) component acting as a thin layer over the [YouTube IFrame Player API](https://developers.google.com/youtube/iframe_api_reference)

## Features
- url playback
- [playback event bindings](https://developers.google.com/youtube/iframe_api_reference#Events)
- [customizable player options](https://developers.google.com/youtube/player_parameters)

## Installation

```
$ npm install react-youtube
```

Usage
----
```js
<YouTube
  videoId={string}                  // defaults -> null
  id={string}                       // defaults -> null
  className={string}                // defaults -> null
  opts={obj}                        // defaults -> {}
  onReady={func}                    // defaults -> noop
  onPlay={func}                     // defaults -> noop
  onPause={func}                    // defaults -> noop
  onEnd={func}                      // defaults -> noop
  onError={func}                    // defaults -> noop
  onStateChange={func}              // defaults -> noop
  onPlaybackRateChange={func}       // defaults -> noop
  onPlaybackQualityChange={func}    // defaults -> noop
/>
```

For convenience it is also possible to access the PlayerState constants through react-youtube:
`YouTube.PlayerState` contains the values that are used by the [YouTube IFrame Player API](https://developers.google.com/youtube/iframe_api_reference#onStateChange).

Example
-----

```js
class Example extends React.Component {
  render() {
    const opts = {
      height: '390',
      width: '640',
      playerVars: { // https://developers.google.com/youtube/player_parameters
        autoplay: 1
      }
    };

    return (
      <YouTube
        videoId="2g811Eo7K8U"
        opts={opts}
        onReady={this._onReady}
      />
    );
  }

  _onReady(event) {
    // access to player in all event handlers via event.target
    event.target.pauseVideo();
  }
}

```

## Controlling the player

You can access & control the player in a way similar to the [official api](https://developers.google.com/youtube/iframe_api_reference#Events):

> The ~~API~~ *component* will pass an event object as the sole argument to each of ~~those functions~~ *the event handler props*. The event object has the following properties:

> * The event's `target` identifies the video player that corresponds to the event.
> * The event's `data` specifies a value relevant to the event. Note that the `onReady` event does not specify a `data` property.

# License

  MIT
