import React, { Fragment, useState } from 'react';
import ReactDOM from 'react-dom';
import YouTube, { useYouTube } from 'react-youtube';

import './styles.css';

const VIDEOS = ['XxVg_s8xAms', '-DX3vJiqxm4'];

function YouTubeHookExample() {
  const [videoIndex, setVideoIndex] = useState(0);
  const [width, setWidth] = useState(600);
  const [hidden, setHidden] = useState(false);
  const [autoplay, setAutoplay] = useState(false);

  const { targetRef, player } = useYouTube({
    videoId: VIDEOS[videoIndex],
    autoplay,
    width,
    height: width * (9 / 16),
  });

  return (
    <div className="App">
      <div style={{ display: 'flex', marginBottom: '1em' }}>
        <button type="button" onClick={() => player.seekTo(120)}>
          Seek to 2 minutes
        </button>
        <button type="button" onClick={() => setVideoIndex((videoIndex + 1) % VIDEOS.length)}>
          Change video
        </button>
        <label>
          <input
            type="range"
            min="300"
            max="1080"
            value={width}
            onChange={(event) => setWidth(event.currentTarget.value)}
          />
          Width ({width}px)
        </label>
        <button type="button" onClick={() => setHidden(!hidden)}>
          {hidden ? 'Show' : 'Hide'}
        </button>
        <label>
          <input
            type="checkbox"
            value={autoplay}
            onChange={(event) => setAutoplay(event.currentTarget.checked === false)}
          />
          Autoplaying
        </label>
      </div>

      {hidden ? 'mysterious' : <div className="container" ref={targetRef} />}
    </div>
  );
}

function YouTubeComponentExample() {
  const [player, setPlayer] = useState(0);
  const [videoIndex, setVideoIndex] = useState(0);
  const [width, setWidth] = useState(600);
  const [hidden, setHidden] = useState(false);
  const [autoplay, setAutoplay] = useState(false);

  return (
    <div className="App">
      <div style={{ display: 'flex', marginBottom: '1em' }}>
        <button type="button" onClick={() => player.seekTo(120)}>
          Seek to 2 minutes
        </button>
        <button type="button" onClick={() => setVideoIndex((videoIndex + 1) % VIDEOS.length)}>
          Change video
        </button>
        <label>
          <input
            type="range"
            min="300"
            max="1080"
            value={width}
            onChange={(event) => setWidth(event.currentTarget.value)}
          />
          Width ({width}px)
        </label>
        <button type="button" onClick={() => setHidden(!hidden)}>
          {hidden ? 'Show' : 'Hide'}
        </button>
        <label>
          <input type="checkbox" value={autoplay} onChange={(event) => setAutoplay(event.currentTarget.checked)} />
          Autoplaying
        </label>
      </div>

      {hidden ? (
        'mysterious'
      ) : (
        <YouTube
          videoId={VIDEOS[videoIndex]}
          autoplay={autoplay}
          width={width}
          height={width * (9 / 16)}
          className="container"
          onReady={(event) => setPlayer(event.target)}
        />
      )}
    </div>
  );
}

ReactDOM.render(
  <Fragment>
    <YouTubeComponentExample />
    <YouTubeHookExample />
  </Fragment>,
  document.getElementById('app'),
);
