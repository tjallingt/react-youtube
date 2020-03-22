import * as React from 'react';
import YouTube from 'youtube-player';
import { YouTubePlayer, Options } from 'youtube-player/dist/types';

export function useYouTube(
  ref: React.RefObject<HTMLElement>,
  options: Options = {}
): YouTubePlayer | null {
  const [player, setPlayer] = React.useState<YouTubePlayer | null>(null);

  // TODO
  //
  // As is this hook is very sensitive to infinite update loops.
  // For example:
  //
  // useYouTube(ref, { width: 500, height: 500 });
  //
  // Will cause us to infinitely re-create the YouTube player as the options object will
  // trigger the effect on every render.
  //
  // We will need to list all individual options in the dependency array that
  // require us to recreate the player.
  // Then in order to "sync" the options that don't require us to recreate the
  // YouTube player we will need to add other seperate effects.

  React.useEffect(() => {
    if (ref.current === null) return;

    const instance = YouTube(ref.current, options);
    setPlayer(instance);

    return () => instance.destroy();
  }, [ref, options]);

  return player;
}
