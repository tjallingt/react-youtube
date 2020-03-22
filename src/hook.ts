import * as React from 'react';
import YouTube from 'youtube-player';
import { YouTubePlayer, Options } from 'youtube-player/dist/types';
import isEqual from 'fast-deep-equal';

/**
 * Neutralise API options that only require a video update, leaving only options
 * that require a player reset. The results can then be compared to see if a
 * player reset is necessary.
 */
function filterResetOptions(options: Options) {
  return {
    ...options,
    playerVars: {
      ...options.playerVars,
      autoplay: 0,
      start: 0,
      end: 0,
    },
  };
}

/**
 * Check whether a change should result in the player being reset.
 * The player is reset when the `options` change, except if the only change
 * is in the `start` and `end` playerVars, because a video update can deal with
 * those.
 */
function shouldRecreateYoutube(prevOpts: Options, opts: Options) {
  return !isEqual(filterResetOptions(prevOpts), filterResetOptions(opts));
}

export function useYouTube(
  ref: React.RefObject<HTMLElement>,
  options: Options = {}
): YouTubePlayer | null {
  const [player, setPlayer] = React.useState<YouTubePlayer | null>(null);
  const previousOptionsRef = React.useRef<Options>({});

  if (shouldRecreateYoutube(previousOptionsRef.current, options)) {
    previousOptionsRef.current = options;
  }

  React.useEffect(() => {
    console.log('useeffect');
    if (ref.current === null) return;

    console.log('creating instance');
    const instance = YouTube(ref.current, options);
    setPlayer(instance);

    return () => {
      console.log('destroying instance');
      instance.destroy();
    };
  }, [previousOptionsRef.current]);

  return player;
}
