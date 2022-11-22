/** @jsxRuntime classic */
import PropTypes from 'prop-types';
import React from 'react';
import isEqual from 'fast-deep-equal';
import youTubePlayer from 'youtube-player';
import type { YouTubePlayer, Options } from 'youtube-player/dist/types';

/**
 * Check whether a `props` change should result in the video being updated.
 */
function shouldUpdateVideo(prevProps: YouTubeProps, props: YouTubeProps) {
  // A changing video should always trigger an update
  if (prevProps.videoId !== props.videoId) {
    return true;
  }

  // Otherwise, a change in the start/end time playerVars also requires a player
  // update.
  const prevVars = prevProps.opts?.playerVars || {};
  const vars = props.opts?.playerVars || {};

  return prevVars.start !== vars.start || prevVars.end !== vars.end;
}

/**
 * Neutralize API options that only require a video update, leaving only options
 * that require a player reset. The results can then be compared to see if a
 * player reset is necessary.
 */
function filterResetOptions(opts: Options = {}) {
  return {
    ...opts,
    height: 0,
    width: 0,
    playerVars: {
      ...opts.playerVars,
      autoplay: 0,
      start: 0,
      end: 0,
    },
  };
}

/**
 * Check whether a `props` change should result in the player being reset.
 * The player is reset when the `props.opts` change, except if the only change
 * is in the `start` and `end` playerVars, because a video update can deal with
 * those.
 */
function shouldResetPlayer(prevProps: YouTubeProps, props: YouTubeProps) {
  return (
    prevProps.videoId !== props.videoId || !isEqual(filterResetOptions(prevProps.opts), filterResetOptions(props.opts))
  );
}

/**
 * Check whether a props change should result in an update of player.
 */
function shouldUpdatePlayer(prevProps: YouTubeProps, props: YouTubeProps) {
  return (
    prevProps.id !== props.id ||
    prevProps.className !== props.className ||
    prevProps.opts?.width !== props.opts?.width ||
    prevProps.opts?.height !== props.opts?.height ||
    prevProps.iframeClassName !== props.iframeClassName ||
    prevProps.title !== props.title
  );
}

type YoutubePlayerCueVideoOptions = {
  videoId: string;
  startSeconds?: number;
  endSeconds?: number;
  suggestedQuality?: string;
};

export { YouTubePlayer };

export type YouTubeEvent<T = any> = {
  data: T;
  target: YouTubePlayer;
};

export type YouTubeProps = {
  /**
   * The YouTube video ID.
   *
   * Examples
   * - https://www.youtube.com/watch?v=XxVg_s8xAms (`XxVg_s8xAms` is the ID)
   * - https://www.youtube.com/embed/-DX3vJiqxm4 (`-DX3vJiqxm4` is the ID)
   */
  videoId?: string;
  /**
   * Custom ID for the player element
   */
  id?: string;
  /**
   * Custom class name for the player element
   */
  className?: string;
  /**
   * Custom class name for the iframe element
   */
  iframeClassName?: string;
  /**
   * Custom style for the player container element
   */
  style?: React.CSSProperties;
  /**
   * Title of the video for the iframe's title tag.
   */
  title?: React.IframeHTMLAttributes<HTMLIFrameElement>['title'];
  /**
   * Indicates how the browser should load the iframe
   * {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe#attr-loading}
   */
  loading?: React.IframeHTMLAttributes<HTMLIFrameElement>['loading'];
  /**
   * An object that specifies player options
   * {@link https://developers.google.com/youtube/iframe_api_reference#Loading_a_Video_Player}
   */
  opts?: Options;
  /**
   * This event fires whenever a player has finished loading and is ready to begin receiving API calls.
   * {@link https://developers.google.com/youtube/iframe_api_reference#onReady}
   */
  onReady?: (event: YouTubeEvent) => void;
  /**
   * This event fires if an error occurs in the player.
   * {@link https://developers.google.com/youtube/iframe_api_reference#onError}
   */
  onError?: (event: YouTubeEvent<number>) => void;
  /**
   * This event fires when the layer's state changes to PlayerState.PLAYING.
   */
  onPlay?: (event: YouTubeEvent<number>) => void;
  /**
   * This event fires when the layer's state changes to PlayerState.PAUSED.
   */
  onPause?: (event: YouTubeEvent<number>) => void;
  /**
   * This event fires when the layer's state changes to PlayerState.ENDED.
   */
  onEnd?: (event: YouTubeEvent<number>) => void;
  /**
   * This event fires whenever the player's state changes.
   * {@link https://developers.google.com/youtube/iframe_api_reference#onStateChange}
   */
  onStateChange?: (event: YouTubeEvent<number>) => void;
  /**
   * This event fires whenever the video playback quality changes.
   * {@link https://developers.google.com/youtube/iframe_api_reference#onPlaybackRateChange}
   */
  onPlaybackRateChange?: (event: YouTubeEvent<number>) => void;
  /**
   * This event fires whenever the video playback rate changes.
   * {@link https://developers.google.com/youtube/iframe_api_reference#onPlaybackQualityChange}
   */
  onPlaybackQualityChange?: (event: YouTubeEvent<string>) => void;
};

const defaultProps: YouTubeProps = {
  videoId: '',
  id: '',
  className: '',
  iframeClassName: '',
  style: {},
  title: '',
  loading: undefined,
  opts: {},
  onReady: () => {},
  onError: () => {},
  onPlay: () => {},
  onPause: () => {},
  onEnd: () => {},
  onStateChange: () => {},
  onPlaybackRateChange: () => {},
  onPlaybackQualityChange: () => {},
};

const propTypes = {
  videoId: PropTypes.string,
  id: PropTypes.string,
  className: PropTypes.string,
  iframeClassName: PropTypes.string,
  style: PropTypes.object,
  title: PropTypes.string,
  loading: PropTypes.oneOf(['lazy', 'eager']),
  opts: PropTypes.objectOf(PropTypes.any),
  onReady: PropTypes.func,
  onError: PropTypes.func,
  onPlay: PropTypes.func,
  onPause: PropTypes.func,
  onEnd: PropTypes.func,
  onStateChange: PropTypes.func,
  onPlaybackRateChange: PropTypes.func,
  onPlaybackQualityChange: PropTypes.func,
};

class YouTube extends React.Component<YouTubeProps> {
  static propTypes = propTypes;
  static defaultProps = defaultProps;

  /**
   * Expose PlayerState constants for convenience. These constants can also be
   * accessed through the global YT object after the YouTube IFrame API is instantiated.
   * https://developers.google.com/youtube/iframe_api_reference#onStateChange
   */
  static PlayerState = {
    UNSTARTED: -1,
    ENDED: 0,
    PLAYING: 1,
    PAUSED: 2,
    BUFFERING: 3,
    CUED: 5,
  };

  container: HTMLDivElement | null;
  internalPlayer: YouTubePlayer | null;

  constructor(props: any) {
    super(props);

    this.container = null;
    this.internalPlayer = null;
  }

  /**
   * Note: The `youtube-player` package that is used promisifies all YouTube
   * Player API calls, which introduces a delay of a tick before it actually
   * gets destroyed.
   *
   * The promise to destroy the player is stored here so we can make sure to
   * only re-create the Player after it's been destroyed.
   *
   * See: https://github.com/tjallingt/react-youtube/issues/355
   */
  destroyPlayerPromise: Promise<void> | undefined = undefined;

  componentDidMount() {
    this.createPlayer();
  }

  async componentDidUpdate(prevProps: YouTubeProps) {
    if (shouldUpdatePlayer(prevProps, this.props)) {
      this.updatePlayer();
    }

    if (shouldResetPlayer(prevProps, this.props)) {
      await this.resetPlayer();
    }

    if (shouldUpdateVideo(prevProps, this.props)) {
      this.updateVideo();
    }
  }

  componentWillUnmount() {
    this.destroyPlayer();
  }

  /**
   * This event fires whenever a player has finished loading and is ready to begin receiving API calls.
   * https://developers.google.com/youtube/iframe_api_reference#onReady
   */
  onPlayerReady = (event: YouTubeEvent) => this.props.onReady?.(event);

  /**
   * This event fires if an error occurs in the player.
   * https://developers.google.com/youtube/iframe_api_reference#onError
   */
  onPlayerError = (event: YouTubeEvent<number>) => this.props.onError?.(event);

  /**
   * This event fires whenever the video playback quality changes.
   * https://developers.google.com/youtube/iframe_api_reference#onStateChange
   */
  onPlayerStateChange = (event: YouTubeEvent<number>) => {
    this.props.onStateChange?.(event);
    // @ts-ignore
    switch (event.data) {
      case YouTube.PlayerState.ENDED:
        this.props.onEnd?.(event);
        break;

      case YouTube.PlayerState.PLAYING:
        this.props.onPlay?.(event);
        break;

      case YouTube.PlayerState.PAUSED:
        this.props.onPause?.(event);
        break;

      default:
    }
  };

  /**
   * This event fires whenever the video playback quality changes.
   * https://developers.google.com/youtube/iframe_api_reference#onPlaybackRateChange
   */
  onPlayerPlaybackRateChange = (event: YouTubeEvent<number>) => this.props.onPlaybackRateChange?.(event);

  /**
   * This event fires whenever the video playback rate changes.
   * https://developers.google.com/youtube/iframe_api_reference#onPlaybackQualityChange
   */
  onPlayerPlaybackQualityChange = (event: YouTubeEvent<string>) => this.props.onPlaybackQualityChange?.(event);

  /**
   * Destroy the YouTube Player using its async API and store the promise so we
   * can await before re-creating it.
   */
  destroyPlayer = () => {
    if (this.internalPlayer) {
      this.destroyPlayerPromise = this.internalPlayer.destroy().then(() => (this.destroyPlayerPromise = undefined));
      return this.destroyPlayerPromise;
    }
    return Promise.resolve();
  };

  /**
   * Initialize the YouTube Player API on the container and attach event handlers
   */
  createPlayer = () => {
    // do not attempt to create a player server-side, it won't work
    if (typeof document === 'undefined') return;
    if (this.destroyPlayerPromise) {
      // We need to first await the existing player to be destroyed before
      // we can re-create it.
      this.destroyPlayerPromise.then(this.createPlayer);
      return;
    }
    // create player
    const playerOpts: Options = {
      ...this.props.opts,
      // preload the `videoId` video if one is already given
      videoId: this.props.videoId,
    };
    this.internalPlayer = youTubePlayer(this.container!, playerOpts);
    // attach event handlers
    this.internalPlayer.on('ready', this.onPlayerReady as any);
    this.internalPlayer.on('error', this.onPlayerError as any);
    this.internalPlayer.on('stateChange', this.onPlayerStateChange as any);
    this.internalPlayer.on('playbackRateChange', this.onPlayerPlaybackRateChange as any);
    this.internalPlayer.on('playbackQualityChange', this.onPlayerPlaybackQualityChange as any);
    if (this.props.title || this.props.loading) {
      this.internalPlayer.getIframe().then((iframe) => {
        if (this.props.title) iframe.setAttribute('title', this.props.title);
        if (this.props.loading) iframe.setAttribute('loading', this.props.loading);
      });
    }
  };

  /**
   * Shorthand for destroying and then re-creating the YouTube Player
   */
  resetPlayer = () => this.destroyPlayer().then(this.createPlayer);

  /**
   * Method to update the id and class of the YouTube Player iframe.
   * React should update this automatically but since the YouTube Player API
   * replaced the DIV that is mounted by React we need to do this manually.
   */
  updatePlayer = () => {
    this.internalPlayer?.getIframe().then((iframe) => {
      if (this.props.id) iframe.setAttribute('id', this.props.id);
      else iframe.removeAttribute('id');
      if (this.props.iframeClassName) iframe.setAttribute('class', this.props.iframeClassName);
      else iframe.removeAttribute('class');
      if (this.props.opts && this.props.opts.width) iframe.setAttribute('width', this.props.opts.width.toString());
      else iframe.removeAttribute('width');
      if (this.props.opts && this.props.opts.height) iframe.setAttribute('height', this.props.opts.height.toString());
      else iframe.removeAttribute('height');
      if (this.props.title) iframe.setAttribute('title', this.props.title);
      else iframe.setAttribute('title', 'YouTube video player');
      if (this.props.loading) iframe.setAttribute('loading', this.props.loading);
      else iframe.removeAttribute('loading');
    });
  };

  /**
   *  Method to return the internalPlayer object.
   */
  getInternalPlayer = () => {
    return this.internalPlayer;
  };

  /**
   * Call YouTube Player API methods to update the currently playing video.
   * Depending on the `opts.playerVars.autoplay` this function uses one of two
   * YouTube Player API methods to update the video.
   */
  updateVideo = () => {
    if (typeof this.props.videoId === 'undefined' || this.props.videoId === null) {
      this.internalPlayer?.stopVideo();
      return;
    }

    // set queueing options
    let autoplay = false;
    const opts: YoutubePlayerCueVideoOptions = {
      videoId: this.props.videoId,
    };

    if (this.props.opts?.playerVars) {
      autoplay = this.props.opts.playerVars.autoplay === 1;
      if ('start' in this.props.opts.playerVars) {
        opts.startSeconds = this.props.opts.playerVars.start;
      }
      if ('end' in this.props.opts.playerVars) {
        opts.endSeconds = this.props.opts.playerVars.end;
      }
    }

    // if autoplay is enabled loadVideoById
    if (autoplay) {
      this.internalPlayer?.loadVideoById(opts);
      return;
    }
    // default behaviour just cues the video
    this.internalPlayer?.cueVideoById(opts);
  };

  refContainer = (container: HTMLDivElement) => {
    this.container = container;
  };

  render() {
    return (
      <div className={this.props.className} style={this.props.style}>
        <div id={this.props.id} className={this.props.iframeClassName} ref={this.refContainer} />
      </div>
    );
  }
}

export default YouTube;
