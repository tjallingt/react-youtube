import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import YouTube from '../src/YouTube';

const videoIdA = 'XxVg_s8xAms';
const videoIdB = '-DX3vJiqxm4';

function Example() {
  const [videoId, setVideoId] = useState(videoIdA);
  const [player, setPlayer] = useState(null);

  const onReady = (event) => {
    // eslint-disable-next-line
    console.log(`YouTube Player object for videoId: "${videoId}" has been saved to state.`);
    setPlayer(event.target);
  };

  const onPlayVideo = () => {
    player.playVideo();
  };

  const onPauseVideo = () => {
    player.pauseVideo();
  };

  const onChangeVideo = () => {
    setVideoId(videoId === videoIdA ? videoIdB : videoIdA);
  };

  return (
    <div>
      <YouTube iframeAttrs={{ tabIndex: 0 }} videoId={videoId} onReady={onReady} />
      <button type="button" onClick={onPlayVideo} disabled={!player}>
        Play
      </button>
      <button type="button" onClick={onPauseVideo} disabled={!player}>
        Pause
      </button>
      <button type="button" onClick={onChangeVideo} disabled={!player}>
        Change Video
      </button>
    </div>
  );
}

ReactDOM.render(<Example />, document.getElementById('root'));
