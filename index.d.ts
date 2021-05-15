import * as React from 'react';

export interface PlayerVars {
  autoplay?: 0 | 1;
  cc_load_policy?: 1;
  color?: 'red' | 'white';
  controls?: 0 | 1 | 2;
  disablekb?: 0 | 1;
  enablejsapi?: 0 | 1;
  end?: number;
  fs?: 0 | 1;
  hl?: string;
  iv_load_policy?: 1 | 3;
  list?: string;
  listType?: 'playlist' | 'search' | 'user_uploads';
  loop?: 0 | 1;
  modestbranding?: 1;
  origin?: string;
  playlist?: string;
  playsinline?: 0 | 1;
  rel?: 0 | 1;
  showinfo?: 0 | 1;
  start?: number;
  mute?: 0 | 1;
}

export interface Options {
  height?: string;
  width?: string;
  host?: string;
  playerVars?: PlayerVars;
}

export interface YouTubeProps {
  videoId?: string;
  id?: string;
  className?: string;
  containerClassName?: string;
  opts?: Options;
  /**
   * https://developers.google.com/youtube/iframe_api_reference#onReady
   *
   * @param {Object} event
   *   @param {Object} target - player object
   */
  onReady?(event: { target: import('youtube-player/dist/types').YouTubePlayer }): void;
  /**
   * https://developers.google.com/youtube/iframe_api_reference#onError
   *
   * @param {Object} event
   *   @param {Object} target - player object
   *   @param {Integer} data  - error type
   */
  onError?(event: { target: import('youtube-player/dist/types').YouTubePlayer; data: number }): void;
  /**
   * Called when onPlayerStateChange trigger YouTube.PlayerState.PLAYING
   * @param event 
   */
  onPlay?(event: { target: import('youtube-player/dist/types').YouTubePlayer; data: number }): void;
  /**
   * Called when onPlayerStateChange trigger YouTube.PlayerState.PAUSED
   * @param event 
   */
  onPause?(event: { target: import('youtube-player/dist/types').YouTubePlayer; data: number }): void;
  /**
   * Called when onPlayerStateChange trigger YouTube.PlayerState.ENDED
   * @param event 
   */
  onEnd?(event: { target: import('youtube-player/dist/types').YouTubePlayer; data: number }): void;
  /**
   * https://developers.google.com/youtube/iframe_api_reference#onStateChange
   *
   * @param {Object} event
   *   @param {Object} target - actual YT player
   *   @param {Integer} data  - status change type
   */
  onStateChange?(event: { target: import('youtube-player/dist/types').YouTubePlayer; data: number }): void;
  /**
   * https://developers.google.com/youtube/iframe_api_reference#onPlaybackRateChange
   *
   * @param {Object} event
   *   @param {Object} target - actual YT player
   *   @param {Float} data    - playback rate
   */
  onPlaybackRateChange?(event: { target: import('youtube-player/dist/types').YouTubePlayer; data: number }): void;
  /**
   * https://developers.google.com/youtube/iframe_api_reference#onPlaybackQualityChange
   *
   * @param {Object} event
   *   @param {Object} target - actual YT player
   *   @param {String} data   - playback quality
   */
   onPlaybackQualityChange?(event: {
    target: import('youtube-player/dist/types').YouTubePlayer;
    data: 'small' | 'medium' | 'large' | 'hd720' | 'hd1080' | 'highres';
  }): void;
}

export default class YouTube extends React.Component<YouTubeProps> {
  static PlayerState: {
    UNSTARTED: number;
    ENDED: number;
    PLAYING: number;
    PAUSED: number;
    BUFFERING: number;
    CUED: number;
  };
  getInternalPlayer(): import('youtube-player/dist/types').YouTubePlayer;
}
