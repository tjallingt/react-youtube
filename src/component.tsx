import * as React from 'react';
import { Options, YouTubePlayer } from 'youtube-player/dist/types';
import { useYouTube } from './hook';
// import isEqual from 'fast-deep-equal';

type YouTubeProps = {
  videoId?: string;

  /** custom ID for player element */
  id?: string;
  /** custom class name for player element */
  className?: string;
  /** custom class name for player container element */
  containerClassName?: string;
  /**
   * Player options to customize the behaviour.
   * See playerVars documentation:
   * https://developers.google.com/youtube/iframe_api_reference#Loading_a_Video_Player
   */
  opts?: Options;
};

/**
 * Check whether a props change should result in an id or className update.
 *
 * @param {Object} prevProps
 * @param {Object} props
 */
function shouldUpdatePlayerIfame(prevProps: YouTubeProps, props: YouTubeProps) {
  return prevProps.id !== props.id || prevProps.className !== props.className;
}

/**
 * Method to update the id and class of the Youtube Player iframe.
 * React should update this automatically but since the Youtube Player API
 * replaced the DIV that is mounted by React we need to do this manually.
 */
function updatePlayerIfame(
  player: YouTubePlayer,
  attributes: { id?: string; className?: string }
) {
  Promise.resolve(player.getIframe()).then(iframe => {
    if (attributes.id) iframe.setAttribute('id', attributes.id);
    else iframe.removeAttribute('id');
    if (attributes.className)
      iframe.setAttribute('class', attributes.className);
    else iframe.removeAttribute('class');
  });
}

/**
 * Check whether a `props` change should result in the video being updated.
 */
function shouldUpdateVideo(prevOpts: Options, opts: Options) {
  // A change in the start/end time playerVars also requires a player update.
  const prevVars = prevOpts.playerVars || {};
  const vars = opts.playerVars || {};

  return prevVars.start !== vars.start || prevVars.end !== vars.end;
}

type LoadCueVideoOptions = {
  videoId: string;
  startSeconds?: number;
  endSeconds?: number;
  suggestedQuality?: string;
};

/**
 * Call Youtube Player API methods to update the currently playing video.
 * Depeding on the `opts.playerVars.autoplay` this function uses one of two
 * Youtube Player API methods to update the video.
 */
function updateVideo(
  player: YouTubePlayer,
  videoId: string | undefined,
  options: Options
) {
  if (videoId === undefined || videoId === null) {
    player.stopVideo();
    return;
  }

  // set queueing options
  let autoplay = false;
  const loadCueOptions: LoadCueVideoOptions = { videoId };
  if (options.playerVars !== undefined) {
    autoplay = options.playerVars.autoplay === 1;
    if (options.playerVars.start !== undefined) {
      loadCueOptions.startSeconds = options.playerVars.start;
    }
    if (options.playerVars.end !== undefined) {
      loadCueOptions.endSeconds = options.playerVars.end;
    }
  }

  // if autoplay is enabled loadVideoById
  if (autoplay) {
    player.loadVideoById(loadCueOptions);
    return;
  }
  // default behaviour just cues the video
  player.cueVideoById(loadCueOptions);
}

// /**
//  * Neutralise API options that only require a video update, leaving only options
//  * that require a player reset. The results can then be compared to see if a
//  * player reset is necessary.
//  */
// function filterResetOptions(options: Options) {
//   return {
//     ...options,
//     playerVars: {
//       ...options.playerVars,
//       autoplay: 0,
//       start: 0,
//       end: 0,
//     },
//   };
// }

// /**
//  * Check whether a change should result in the player being reset.
//  * The player is reset when the `options` change, except if the only change
//  * is in the `start` and `end` playerVars, because a video update can deal with
//  * those.
//  */
// function shouldRecreateYoutube(prevOpts: Options, opts: Options) {
//   return !isEqual(filterResetOptions(prevOpts), filterResetOptions(opts));
// }

/**
 * Expose PlayerState constants for convenience. These constants can also be
 * accessed through the global YT object after the YouTube IFrame API is instantiated.
 * https://developers.google.com/youtube/iframe_api_reference#onStateChange
 */
export const PlayerState = {
  UNSTARTED: -1,
  ENDED: 0,
  PLAYING: 1,
  PAUSED: 2,
  BUFFERING: 3,
  CUED: 5,
};

const emptyObject = {};

export function YouTube(props: YouTubeProps) {
  const {
    videoId,
    id,
    className,
    containerClassName,

    opts = emptyObject,
  } = props;

  const previousVideoIdRef = React.useRef<string | undefined>(undefined);
  const previousOptsRef = React.useRef<Options>({});
  const containerRef = React.useRef(null);

  // TODO add events
  const player = useYouTube(containerRef, previousOptsRef.current);

  React.useEffect(() => {
    if (!player) return;

    if (shouldUpdatePlayerIfame(previousOptsRef.current, opts)) {
      updatePlayerIfame(player, opts);
    }

    if (
      previousVideoIdRef.current !== videoId ||
      shouldUpdateVideo(previousOptsRef.current, opts)
    ) {
      updateVideo(player, videoId, opts);
    }

    previousOptsRef.current = opts;
  });

  return (
    <div className={containerClassName}>
      <div id={id} className={className} ref={containerRef} />
    </div>
  );
}

YouTube.PlayerState = PlayerState;
