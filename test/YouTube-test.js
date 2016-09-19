/* eslint max-len: 0 */
import expect from 'expect';
import shallowRender from './helpers/shallowRender';
import fullRender from './helpers/fullRender';
import YouTube from '../src/YouTube';

describe('YouTube', () => {
  // See helpers/setupEnvironment.
  const HTMLDivElement = window.HTMLDivElement;

  it('should expose player state constants', () => {
    expect(YouTube.PlayerState)
      .toExist()
      .toContainKeys(['UNSTARTED', 'ENDED', 'PLAYING', 'PAUSED', 'BUFFERING', 'CUED']);
  });

  it('should render a div with a custom id', () => {
    const { output } = shallowRender({
      id: 'custom-id',
      videoId: 'XxVg_s8xAms',
    });

    const div = output.props.children;
    expect(div.props.id).toBe('custom-id');
  });

  it('should render a div with a custom className', () => {
    const { output } = shallowRender({
      className: 'custom-class',
      videoId: 'XxVg_s8xAms',
    });

    const div = output.props.children;
    expect(div.props.className).toBe('custom-class');
  });

  it('should update an id', () => {
    const { playerMock, rerender } = fullRender({
      id: 'custom-id',
      videoId: 'XxVg_s8xAms',
    });

    rerender({
      id: 'custom-id2',
      videoId: 'XxVg_s8xAms',
    });

    expect(playerMock.getIframe).toHaveBeenCalled();
  });

  it('should update a className', () => {
    const { playerMock, rerender } = fullRender({
      className: 'custom-class1',
      videoId: 'XxVg_s8xAms',
    });

    rerender({
      className: 'custom-class2',
      videoId: 'XxVg_s8xAms',
    });

    expect(playerMock.getIframe).toHaveBeenCalled();
  });

  it('should create and bind a new youtube player when mounted', () => {
    const { playerMock } = fullRender({
      videoId: 'XxVg_s8xAms',
    });

    expect(playerMock.on.calls.length).toBe(5);
  });

  it('should create and bind a new youtube player when props.opts changes', () => {
    const { playerMock, rerender } = fullRender({
      videoId: 'XxVg_s8xAms',
      opts: {
        width: '480px',
        height: '360px',
        playerVars: {
          controls: 1,
          start: 0,
        },
      },
    });

    rerender({
      videoId: 'XxVg_s8xAms',
      opts: {
        width: '480px',
        height: '360px',
        playerVars: {
          controls: 0, // changed, forces destroy & rebind
          start: 10, // changed, but does not destroy & rebind
        },
      },
    });

    // player is destroyed & rebound
    expect(playerMock.destroy).toHaveBeenCalled();
  });

  it('should NOT create and bind a new youtube player when props.videoId, playerVars.autoplay, playerVars.start, or playerVars.end change', () => {
    const { playerMock, rerender } = fullRender({
      videoId: 'XxVg_s8xAms',
      opts: {
        width: '480px',
        height: '360px',
        playerVars: {
          autoplay: 0,
          start: 0,
          end: 50,
        },
      },
    });

    rerender({
      videoId: '-DX3vJiqxm4', // changed
      opts: {
        width: '480px',
        height: '360px',
        playerVars: {
          autoplay: 1, // changed, does not force destroy & rebind
          start: 10, // changed, does not force destroy & rebind
          end: 20, // changed, does not force destroy & rebind
        },
      },
    });

    // player is NOT destroyed & rebound, despite the changes
    expect(playerMock.destroy).toNotHaveBeenCalled();
    // instead only the video is updated
    expect(playerMock.loadVideoById).toHaveBeenCalled();
  });

  it('should create and bind a new youtube player when props.opts AND props.videoId change', () => {
    const { playerMock, rerender } = fullRender({
      videoId: 'XxVg_s8xAms',
      opts: {
        width: '480px',
        height: '360px',
        playerVars: {
          controls: 1,
        },
      },
    });

    rerender({
      videoId: '-DX3vJiqxm4', // changed
      opts: {
        width: '480px',
        height: '360px',
        playerVars: {
          controls: 0, // changed
        },
      },
    });

    // player is destroyed & rebound
    expect(playerMock.destroy).toHaveBeenCalled();
  });

  it('should load a video', () => {
    const { playerMock } = fullRender({
      id: 'should-load-a-video',
      videoId: 'XxVg_s8xAms',
    });

    expect(playerMock).toHaveBeenCalled();
    expect(playerMock.calls[0].arguments[1]).toEqual({ videoId: 'XxVg_s8xAms' });
  });

  it('should load a new video', () => {
    const { playerMock, rerender } = fullRender({
      id: 'new-video',
      videoId: 'XxVg_s8xAms',
    });

    rerender({
      videoId: '-DX3vJiqxm4',
    });

    expect(playerMock).toHaveBeenCalled();
    expect(playerMock.calls[0].arguments[0]).toBeAn(HTMLDivElement);
    expect(playerMock.calls[0].arguments[1]).toEqual({ videoId: 'XxVg_s8xAms' });
    expect(playerMock.cueVideoById).toHaveBeenCalledWith({ videoId: '-DX3vJiqxm4' });
  });

  it('should not load a video when props.videoId is null', () => {
    const { playerMock } = fullRender({
      videoId: null,
    });

    expect(playerMock.cueVideoById).toNotHaveBeenCalled();
  });

  it('should stop a video when props.videoId changes to null', () => {
    const { playerMock, rerender } = fullRender({
      videoId: 'XxVg_s8xAms',
    });

    expect(playerMock).toHaveBeenCalled();

    rerender({
      videoId: null,
    });

    expect(playerMock.stopVideo).toHaveBeenCalled();
  });

  it('should load a video with autoplay enabled', () => {
    const { playerMock } = fullRender({
      id: 'should-load-autoplay',
      videoId: 'XxVg_s8xAms',
      opts: {
        playerVars: {
          autoplay: 1,
        },
      },
    });

    expect(playerMock.cueVideoById).toNotHaveBeenCalled();
    expect(playerMock.loadVideoById).toNotHaveBeenCalled();
    expect(playerMock).toHaveBeenCalled();
    expect(playerMock.calls[0].arguments[1]).toEqual({
      videoId: 'XxVg_s8xAms',
      playerVars: {
        autoplay: 1,
      },
    });
  });

  it('should load a new video with autoplay enabled', () => {
    const { playerMock, rerender } = fullRender({
      id: 'should-load-new-autoplay',
      videoId: 'XxVg_s8xAms',
      opts: {
        playerVars: {
          autoplay: 1,
        },
      },
    });

    expect(playerMock).toHaveBeenCalled();
    expect(playerMock.calls[0].arguments[1]).toEqual({
      videoId: 'XxVg_s8xAms',
      playerVars: {
        autoplay: 1,
      },
    });

    rerender({
      videoId: 'something',
    });

    expect(playerMock.cueVideoById).toNotHaveBeenCalled();
    expect(playerMock.loadVideoById).toHaveBeenCalledWith({ videoId: 'something' });
  });

  it('should load a video with a set starting and ending time', () => {
    const { playerMock, rerender } = fullRender({
      videoId: 'XxVg_s8xAms',
      opts: {
        playerVars: {
          start: 1,
          end: 2,
        },
      },
    });

    expect(playerMock).toHaveBeenCalled();
    expect(playerMock.calls[0].arguments[1]).toEqual({
      videoId: 'XxVg_s8xAms',
      playerVars: {
        start: 1,
        end: 2,
      },
    });

    rerender({
      videoId: 'KYzlpRvWZ6c',
    });

    expect(playerMock.cueVideoById).toHaveBeenCalledWith({
      videoId: 'KYzlpRvWZ6c',
      startSeconds: 1,
      endSeconds: 2,
    });
  });

  it('should destroy the youtube player', () => {
    const { playerMock, unmount } = fullRender({
      videoId: 'XxVg_s8xAms',
    });

    unmount();
    expect(playerMock.destroy).toHaveBeenCalled();
  });
});
