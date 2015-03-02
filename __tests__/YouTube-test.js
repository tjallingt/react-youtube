jest.dontMock('../');

describe('YouTube Component', function() {
  React = require('react/addons');
  getYouTubeId = require('get-youtube-id');
  globalize = require('random-global');
  createPlayer = require('../lib/createPlayer');
  YouTube = require('../');
  TestUtils = React.addons.TestUtils;

  beforeEach(function() {

    /**
     * Mock out YouTube player API
     */

     window.YT = {
      PlayerState: {
        ENDED: 0,
        PLAYING: 1,
        PAUSED: 2,
        BUFFERING: 3
      }
     };

    playerMock = {
      cueVideoById: jest.genMockFunction(),
      addEventListener: jest.genMockFunction(),
      removeEventListener: jest.genMockFunction()
    };

    createPlayer.mockImplementation(function(url, playerParameters, cb) {
      return cb(playerMock);
    });
  });

  describe('instantiation', function() {
    it('should render a YouTube API ready div', function() {
      var youtube = TestUtils.renderIntoDocument(React.createElement(YouTube, null));
      var div = TestUtils.findRenderedDOMComponentWithTag(youtube, 'div').getDOMNode();

      expect(div.getAttribute('id')).toBe('react-yt-player');
    });

    it('should create a new YouTube widget', function() {
      TestUtils.renderIntoDocument(React.createElement(YouTube, null));
      expect(createPlayer.mock.calls[0][0]).toBe('react-yt-player');
    });
  });

  describe('appearance', function() {
    it('should accept a custom id', function() {
      var youtube = TestUtils.renderIntoDocument(React.createElement(YouTube, {id: 'custom-id'}));
      var div = TestUtils.findRenderedDOMComponentWithTag(youtube, 'div').getDOMNode();

      expect(div.getAttribute('id')).toBe('custom-id');
    });
  });

  describe('functionality', function() {
    var Container;
    var container;

    beforeEach(function() {

      /**
       * Using `forceUpdate` doesn't work with `componentWillUpdate` when
       * changing `props.url`. This is a hack to get around that.
       */

      Container = React.createClass({
        getInitialState: function() {
          return {
            url: 'https://www.youtube.com/watch?v=tITYj52gXxU'
          };
        },

        _setUrl1: function() {
          this.setState({url: 'https://www.youtube.com/watch?v=tITYj52gXxU'});
        },

        _setUrl2: function() {
          this.setState({url: 'https://www.youtube.com/watch?v=vW7qFzT7cbA'});
        },

        render: function() {
          return (
            React.createElement('div', null,
              React.createElement('button', {className: 'set-url-1', onClick: this._setUrl1}, 'URL 1'),
              React.createElement('button', {className: 'set-url-2', onClick: this._setUrl2}, 'URL 2'),
              React.createElement(YouTube, {url: this.state.url})
            )
          );
        }
      });

      container = TestUtils.renderIntoDocument(React.createElement(Container, null));
    });

    it('should load a `url`', function() {
      var youtube = TestUtils.findRenderedComponentWithType(container, YouTube);

      // trigger player ready event.
      youtube._handlePlayerReady();

      expect(getYouTubeId.mock.calls[0][0]).toBe('https://www.youtube.com/watch?v=tITYj52gXxU');
      expect(playerMock.cueVideoById.mock.calls.length).toBe(1);
    });

    it('should load new `url`s', function() {
      var youtube = TestUtils.findRenderedComponentWithType(container, YouTube);
      var setNewTrack = TestUtils.findRenderedDOMComponentWithClass(container, 'set-url-2');

      // trigger player ready event.
      youtube._handlePlayerReady();

      TestUtils.Simulate.click(setNewTrack);

      expect(getYouTubeId.mock.calls[1][0]).toBe('https://www.youtube.com/watch?v=vW7qFzT7cbA');
      expect(playerMock.cueVideoById.mock.calls.length).toBe(2);
    });

    it('should not load the same `url` twice', function() {
      var youtube = TestUtils.findRenderedComponentWithType(container, YouTube);
      var setSameTrack = TestUtils.findRenderedDOMComponentWithClass(container, 'set-url-1');

      // trigger player ready event.
      youtube._handlePlayerReady();

      TestUtils.Simulate.click(setSameTrack);

      expect(playerMock.cueVideoById.mock.calls.length).toBe(1);
    });
  });

  describe('events', function() {
    it('should register event handlers onto the global namespace', function() {
      TestUtils.renderIntoDocument(React.createElement(YouTube, null));
      expect(globalize.mock.calls.length).toBe(2);
    });

    it('should bind event handlers to the player', function() {
      TestUtils.renderIntoDocument(React.createElement(YouTube, null));
      expect(playerMock.addEventListener.mock.calls.length).toBe(2);
    });

    it('should bind an event handler to player events', function() {
      var onReady = jest.genMockFunction();
      var youtube = TestUtils.renderIntoDocument(React.createElement(YouTube, {onReady: onReady}));

      youtube._handlePlayerReady();
      expect(onReady.mock.calls.length).toBe(1);
    });

    it('should bind event handler props to playback events', function() {
      var onPlay = jest.genMockFunction();
      var onPause = jest.genMockFunction();
      var onEnd = jest.genMockFunction();
      var youtube = TestUtils.renderIntoDocument(
        React.createElement(YouTube, {
          onPlay: onPlay,
          onPause: onPause,
          onEnd: onEnd
        })
      );

      // video playing
      youtube._handlePlayerStateChange({data: window.YT.PlayerState.PLAYING});
      expect(onPlay.mock.calls.length).toBe(1);

      // video paused
      youtube._handlePlayerStateChange({data: window.YT.PlayerState.PAUSED});
      expect(onPlay.mock.calls.length).toBe(1);

      // video ended
      youtube._handlePlayerStateChange({data: window.YT.PlayerState.ENDED});
      expect(onEnd.mock.calls.length).toBe(1);
    });

    /**
     * These tests use the regular methods of rendering components instead
     * of `TestUtils.renderIntoDocument`. TestUtils forces the component
     * into a detached DOM node, making it difficult to unmount.
     */

    it('should remove player event listeners when unmounted', function() {
      React.render(React.createElement(YouTube, null), document.body);
      React.unmountComponentAtNode(document.body);

      expect(playerMock.removeEventListener.mock.calls.length).toBe(2);
    });

    it('should destroy event handlers on the global namespace when unmounted', function() {
      window.fakeGlobalEventHandler = 'this is a fake event handler.';
      globalize.mockReturnValue('fakeGlobalEventHandler');

      React.render(React.createElement(YouTube, null), document.body);

      // trigger unmounting
      React.unmountComponentAtNode(document.body);
      expect(window.fakeGlobalEventHandler).not.toBeDefined();
    });
  });
});
