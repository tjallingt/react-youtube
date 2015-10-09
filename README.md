react-youtube
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
  url={string}            // required
  id={string}             // defaults -> random string
  className={string}      // defaults -> ""
  opts={obj}              // defaults -> {}
  onReady={func}          // defaults -> noop
  onPlay={func}           // defaults -> noop
  onPause={func}          // defaults -> noop
  onEnd={func}            // defaults -> noop
  onError={func}          // defaults -> noop
  onStateChange={func}    // defaults -> noop
/>
```

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
        url={'http://www.youtube.com/watch?v=2g811Eo7K8U'}
        opts={opts}
        onPlay={this._onPlay}
      />
    );
  }

  _onPlay(event) {
    // access to player in all event handlers via event.target
    event.target.pauseVideo();
  }
}

```

## Controlling the player

You can access & control the player in a way similar to the [official api](https://developers.google.com/youtube/iframe_api_reference#Events):

> The ~~API~~ *component* will pass an event object as the sole argument to each of ~~those functions~~ *the event handler props*. The event object has the following properties:

> * The event's target identifies the video player that corresponds to the event.
> * The event's data specifies a value relevant to the event. Note that the `onReady` event does not specify a data property.

**Note:** Whenever a new `url` is passed into the component, the previous player is destroyed and a new one created. Meaning, if you're storing the player inside of `state`,
you'll want to replace it whenever the `onReady` event handler is called.


**Note:**
`player.addEventListener`, `player.removeEventListener`, and `player.destroy` are used internally, using these outside the component may cause problems.


# License

  MIT
