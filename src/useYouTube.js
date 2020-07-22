import { useState, useEffect, useRef } from 'react';

function loadScript(url) {
  return new Promise((resolve, reject) => {
    const script = Object.assign(document.createElement('script'), {
      type: 'text/javascript',
      charset: 'utf8',
      src: url,
      async: true,
      onerror() {
        reject(new Error(`Failed to load: ${url}`));
      },
      onload() {
        resolve();
      },
    });

    document.head.appendChild(script);
  });
}

function loadYouTubeIframeApi() {
  return new Promise((resolve, reject) => {
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (previous) previous();
      resolve();
    };

    const protocol = window.location.protocol === 'http:' ? 'http:' : 'https:';
    loadScript(`${protocol}//www.youtube.com/iframe_api`).catch(reject);
  });
}

function getYouTubeApi() {
  if (window.YT && window.YT.Player && window.YT.Player instanceof Function) {
    return window.YT;
  }
  return null;
}

/*

Available options that you can pass to the YouTube Iframe API are

- videoId             updated by Player#cueVideoById

- width               updated by Player#setSize
- height              updated by Player#setSize

- playerVars
  - autoplay          Player#loadVideoById/Playlist
  - cc_lang_pref      [static]
  - cc_load_policy    [static]
  - color             [static]
  - controls          [static]
  - disablekb         [static]
  - enablejsapi       [static]
  - end               Player#cue/load* should set endSeconds
  - fs                [static]
  - hl                [static]
  - iv_load_policy    [static]
  - list              [static]
  - listType          [static]
  - loop              updated by Player#setLoop
  - modestbranding    [static]
  - origin            [static]
  - playlist          updated by Player#cue/loadPlaylist 
  - playsinline       [static]
  - rel               [static]
  - start             Player#cue/load* should set startSeconds
  - widget_referrer   [static]

- events [note]
  - onReady
  - onStateChange
  - onPlaybackQualityChange
  - onPlaybackRateChange
  - onError
  - onApiChange

[note] youtube-player fixes the very strange Player#addEventListener behaviour
but does this by overwriting the events property so we can't set these immediately.

*/

/*

type Config = {
  videoId: string,

  autoplay: boolean,
  startSeconds: number,
  endSeconds: number,

  width: number,
  height: number,

  onReady: (event: any) => void,
  onStateChange: (event: any) => void,
  onPlaybackQualityChange: (event: any) => void,
  onPlaybackRateChange: (event: any) => void,
  onError: (event: any) => void,
  onApiChange: (event: any) => void,
};

*/

export default function useYouTube(config, playerVars) {
  const [YouTubeApi, setYouTubeApi] = useState(getYouTubeApi);

  const [target, setTarget] = useState(null);
  const [player, setPlayer] = useState(null);
  const configRef = useRef(config);

  useEffect(() => {
    configRef.current = config;
  }, [config]);

  useEffect(() => {
    if (target === null) return undefined;

    const element = target.appendChild(document.createElement('div'));

    // TODO: use suspense
    if (YouTubeApi === null) {
      loadYouTubeIframeApi()
        .then(() => setYouTubeApi(getYouTubeApi))
        .catch((error) => {
          console.error(error);
          // TODO: throw so it can be handled by an error boundary
        });
      return undefined;
    }

    // NOTE: The YouTube player replaces `element`.
    // trying to access it after this point results in unexpected behaviour
    const instance = new YouTubeApi.Player(element, {
      videoId: configRef.current.videoId,
      width: configRef.current.width,
      height: configRef.current.height,
      playerVars,
      events: {
        onReady(event) {
          setPlayer(instance);

          if (typeof configRef.current.onReady === 'function') {
            configRef.current.onReady(event);
          }
        },
        onStateChange(event) {
          if (typeof configRef.current.onStateChange === 'function') {
            configRef.current.onStateChange(event);
          }
        },
        onPlaybackQualityChange(event) {
          if (typeof configRef.current.onPlaybackQualityChange === 'function') {
            configRef.current.onPlaybackQualityChange(event);
          }
        },
        onPlaybackRateChange(event) {
          if (typeof configRef.current.onPlaybackRateChange === 'function') {
            configRef.current.onPlaybackRateChange(event);
          }
        },
        onError(event) {
          if (typeof configRef.current.onError === 'function') {
            configRef.current.onError(event);
          }
        },
        onApiChange(event) {
          if (typeof configRef.current.onApiChange === 'function') {
            configRef.current.onApiChange(event);
          }
        },
      },
    });

    return () => {
      instance.getIframe().remove();
      // TODO: figure out why calling instance.destroy() causes cross origin errors
      setPlayer(null);
    };
  }, [YouTubeApi, target, playerVars]);

  // videoId, autoplay, startSeconds, endSeconds
  useEffect(() => {
    if (player === null) return;

    if (!config.videoId) {
      player.stopVideo();
      return;
    }

    if (configRef.current.autoplay) {
      player.loadVideoById({
        videoId: config.videoId,
        startSeconds: configRef.current.startSeconds,
        endSeconds: configRef.current.endSeconds,
      });
      return;
    }

    player.cueVideoById({
      videoId: config.videoId,
      startSeconds: configRef.current.startSeconds,
      endSeconds: configRef.current.endSeconds,
    });
  }, [player, config.videoId]);

  // width, height
  useEffect(() => {
    if (player === null) return;

    if (config.width !== undefined && config.height !== undefined) {
      // calling setSize with width and height set to undefined
      // makes the player smaller than the default
      player.setSize(config.width, config.height);
    }
  }, [player, config.width, config.height]);

  return {
    player,
    targetRef: setTarget,
  };
}
