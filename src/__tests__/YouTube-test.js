jest.dontMock('../YouTube');

import React from 'react/addons';
import globalize from 'random-global';
import randomize from 'random-string';
import createPlayer from '../lib/createPlayer';
import YouTube from '../YouTube';

const { TestUtils } = React.addons;
const url = 'https://www.youtube.com/watch?v=tITYj52gXxU';
const url2 = 'https://www.youtube.com/watch?v=vW7qFzT7cbA';

window.YT = {
  PlayerState: {
    ENDED: 0,
    PLAYING: 1,
    PAUSED: 2,
    BUFFERING: 3,
  },
};

const playerMock = {
  destroy: jest.genMockFunction(),
  addEventListener: jest.genMockFunction(),
  removeEventListener: jest.genMockFunction(),
};

createPlayer.mockImplementation((id, props, cb) => cb(playerMock));
randomize.mockImplementation(() => 'random-id');

describe('YouTube Component', () => {
  afterEach(() => {
    globalize.mockClear();
    createPlayer.mockClear();
    playerMock.destroy.mockClear();
    playerMock.addEventListener.mockClear();
    playerMock.removeEventListener.mockClear();
  });

  describe('rendering', () => {
    it('should render a YouTube API ready div', () => {
      const youtube = TestUtils.renderIntoDocument(<YouTube url={url} />);
      const div = TestUtils.findRenderedDOMComponentWithTag(youtube, 'div').getDOMNode();
      expect(div.getAttribute('id')).toBe('random-id');
    });

    it('should render a YouTube API ready div with a custom id', () => {
      const youtube = TestUtils.renderIntoDocument(<YouTube url={url} id={'custom-id'} />);
      const div = TestUtils.findRenderedDOMComponentWithTag(youtube, 'div').getDOMNode();
      expect(div.getAttribute('id')).toBe('custom-id');
    });
  });

  describe('functionality', () => {
    let container;
    let youtube;
    let playSecondUrlBtn;

    class Container extends React.Component {
      constructor(props) {
        super(props);
        this.state = {url: url};
        this.onPlaySecondUrl = this.onPlaySecondUrl.bind(this);
      }

      onPlaySecondUrl() {
        this.setState({url: url2});
      }

      render() {
        return (
          <div>
            <YouTube url={this.state.url} />
            <button onClick={this.onPlaySecondUrl} />
          </div>
        );
      }
    }

    beforeEach(() => {
      container = TestUtils.renderIntoDocument(<Container />);
      youtube = TestUtils.findRenderedComponentWithType(container, YouTube);
      playSecondUrlBtn = TestUtils.findRenderedDOMComponentWithTag(container, 'button');

      youtube.onPlayerReady();
    });

    it('should load a url', () => {
      expect(createPlayer.mock.calls[0][1].url).toBe(url);
    });

    it('should load a new url', () => {
      TestUtils.Simulate.click(playSecondUrlBtn);
      expect(createPlayer.mock.calls[1][1].url).toBe(url2);
    });

    it('should *only* load a new url', () => {
      // switch to url2
      TestUtils.Simulate.click(playSecondUrlBtn);
      expect(createPlayer.mock.calls.length).toBe(2);

      // calling it again wont do anything, already on url2
      TestUtils.Simulate.click(playSecondUrlBtn);
      expect(createPlayer.mock.calls.length).toBe(2);
    });
  });

  describe('events', () => {
    it('should attach player event handlers', () => {
      TestUtils.renderIntoDocument(<YouTube url={url} />);

      expect(globalize.mock.calls.length).toBe(3);
      expect(playerMock.addEventListener.mock.calls.length).toBe(3);
    });

    it('should respond to player events', () => {
      const onReady = jest.genMockFunction();
      const onError = jest.genMockFunction();
      const onPlay = jest.genMockFunction();
      const onPause = jest.genMockFunction();
      const onEnd = jest.genMockFunction();

      const readyEvent = {data: null, target: playerMock};
      const errorEvent = {data: 101, target: playerMock};
      const playedEvent = {data: window.YT.PlayerState.PLAYING, target: playerMock};
      const pausedEvent = {data: window.YT.PlayerState.PAUSED, target: playerMock};
      const endedEvent = {data: window.YT.PlayerState.ENDED, target: playerMock};

      const youtube = TestUtils.renderIntoDocument(
        <YouTube
          url={url}
          onReady={onReady}
          onError={onError}
          onPlay={onPlay}
          onPause={onPause}
          onEnd={onEnd}
        />
      );

      // video ready
      youtube.onPlayerReady(readyEvent);
      expect(onReady).toBeCalledWith(readyEvent);

      // video error
      youtube.onPlayerError(errorEvent);
      expect(onError).toBeCalledWith(errorEvent);

      // video playing
      youtube.onPlayerStateChange(playedEvent);
      expect(onPlay).toBeCalledWith(playedEvent);

      // video paused
      youtube.onPlayerStateChange(pausedEvent);
      expect(onPause).toBeCalledWith(pausedEvent);

      // video ended
      youtube.onPlayerStateChange(endedEvent);
      expect(onEnd).toBeCalledWith(endedEvent);
    });
  });

  describe('unmounting', () => {
    beforeEach(() => {
      // create a fake global event handler to be used within the component
      window.fakeHandler = 'this is a fake event handler.';
      globalize.mockReturnValue('fakeHandler');

      const youtube = TestUtils.renderIntoDocument(<YouTube url={url} />);
      React.unmountComponentAtNode(React.findDOMNode(youtube).parentNode);
    });

    it('should destroy event handlers', () => {
      expect(playerMock.removeEventListener.mock.calls.length).toBe(3);
      expect(window.fakeHandler).not.toBeDefined();
    });

    it('should destroy the player', () => {
      expect(playerMock.destroy.mock.calls.length).toBe(1);
    });
  });
});
