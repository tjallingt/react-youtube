import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import YouTube, { useYouTube } from '../.';

const VIDEOS = ['XxVg_s8xAms', '-DX3vJiqxm4'];

const options = {
  videoId: VIDEOS[0],
  playerVars: {
    controls: 0,
    fs: 0,
    modestbranding: 1,
  },
} as any;

const HooksExample = () => {
  const ref = React.useRef(null);
  const player = useYouTube(ref, options);

  const [index, setIndex] = React.useState(0);
  // React.useEffect(() => {
  //   if (player) player.cueVideoById(VIDEOS[index]);
  // }, [player, index]);

  return (
    <div>
      <h1>React Youtube Hooks Example</h1>
      <div>
        <div ref={ref} />
      </div>
      <button onClick={() => player?.playVideo()}>Play</button>
      <button onClick={() => player?.pauseVideo()}>Pause</button>
      <button onClick={() => setIndex((index + 1) % VIDEOS.length)}>
        Change Video
      </button>
    </div>
  );
};

class ComponentExample extends React.Component<any, any> {
  constructor(props) {
    super(props);

    this.state = {
      videoId: VIDEOS[0],
      player: null,
    };

    this.onReady = this.onReady.bind(this);
    this.onChangeVideo = this.onChangeVideo.bind(this);
    this.onPlayVideo = this.onPlayVideo.bind(this);
    this.onPauseVideo = this.onPauseVideo.bind(this);
  }

  onReady(event) {
    console.log(
      `YouTube Player object for videoId: "${this.state.videoId}" has been saved to state.`
    ); // eslint-disable-line
    this.setState({
      player: event.target,
    });
  }

  onPlayVideo() {
    this.state.player.playVideo();
  }

  onPauseVideo() {
    this.state.player.pauseVideo();
  }

  onChangeVideo() {
    this.setState({
      videoId: this.state.videoId === VIDEOS[0] ? VIDEOS[1] : VIDEOS[0],
    });
  }

  render() {
    return (
      <div>
        <h1>React Youtube Component Example</h1>
        <YouTube
          videoId={this.state.videoId}
          onReady={this.onReady}
          options={{
            playerVars: {
              controls: 0,
              fs: 0,
              modestbranding: 1,
            },
          }}
        />
        <button onClick={this.onPlayVideo}>Play</button>
        <button onClick={this.onPauseVideo}>Pause</button>
        <button onClick={this.onChangeVideo}>Change Video</button>
      </div>
    );
  }
}

function App() {
  return (
    <div>
      <HooksExample />
      {/* <ComponentExample /> */}
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
