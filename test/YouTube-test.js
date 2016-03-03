import expect from 'expect';
import shallowRender from './helpers/shallowRender';
import fullRender from './helpers/fullRender';

describe('YouTube', () => {
  it('should render a div with a custom id', () => {
    const { output } = shallowRender({
      id: 'custom-id',
      videoId: 'XxVg_s8xAms',
    });

    expect(output.props.id).toBe('custom-id');
  });

  it('should render a div with a custom className', () => {
    const { output } = shallowRender({
      id: 'custom-id',
      className: 'custom-class',
      videoId: 'XxVg_s8xAms',
    });

    expect(output.props.className).toBe('custom-class');
  });

  it('should create and bind a new youtube player when mounted', () => {
    const { playerMock } = fullRender({
      videoId: 'XxVg_s8xAms',
    });

    expect(playerMock.on.calls.length).toBe(3);
  });

  it('should create and bind a new youtube player when props.opts changes', () => {
    const { playerMock, rerender } = fullRender({
      videoId: 'XxVg_s8xAms',
      opts: {
        width: '480px',
        height: '360px',
        playerVars: {
          autoplay: 1,
        },
      },
    });

    rerender({
      videoId: 'XxVg_s8xAms',
      opts: {
        width: '480px',
        height: '360px',
        playerVars: {
          autoplay: 0, // changed
        },
      },
    });

    // player is destroyed & rebound
    expect(playerMock.destroy).toHaveBeenCalled();
  });

  it('should NOT create and bind a new youtube player when props.videoId changes', () => {
    const { playerMock, rerender } = fullRender({
      videoId: 'XxVg_s8xAms',
      opts: {
        width: '480px',
        height: '360px',
        playerVars: {
          autoplay: 1,
        },
      },
    });

    rerender({
      videoId: '-DX3vJiqxm4', // changed
      opts: {
        width: '480px',
        height: '360px',
        playerVars: {
          autoplay: 1,
        },
      },
    });

    expect(playerMock.destroy).toNotHaveBeenCalled();
  });

  it('should create and bind a new youtube player when props.opts AND props.videoId change', () => {
    const { playerMock, rerender } = fullRender({
      videoId: 'XxVg_s8xAms',
      opts: {
        width: '480px',
        height: '360px',
        playerVars: {
          autoplay: 1,
        },
      },
    });

    rerender({
      videoId: '-DX3vJiqxm4', // changed
      opts: {
        width: '480px',
        height: '360px',
        playerVars: {
          autoplay: 0, // changed
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

    expect(playerMock).toHaveBeenCalledWith('should-load-a-video', { videoId: 'XxVg_s8xAms' });
  });

  it('should load a new video', () => {
    const { playerMock, rerender } = fullRender({
      id: 'new-video',
      videoId: 'XxVg_s8xAms',
    });

    rerender({
      videoId: '-DX3vJiqxm4',
    });

    expect(playerMock).toHaveBeenCalledWith('new-video', { videoId: 'XxVg_s8xAms' });
    expect(playerMock.cueVideoById).toHaveBeenCalledWith({ videoId: '-DX3vJiqxm4' });
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
    expect(playerMock).toHaveBeenCalledWith('should-load-autoplay', {
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

    expect(playerMock).toHaveBeenCalledWith('should-load-new-autoplay', {
      videoId: 'XxVg_s8xAms',
      playerVars: {
        autoplay: 1,
      },
    });

    rerender({
      videoId: 'something'
    });

    expect(playerMock.cueVideoById).toNotHaveBeenCalled();
    expect(playerMock.loadVideoById).toHaveBeenCalledWith({ videoId: 'something' });
  });

  it('should load a video with a set starting and ending time', () => {
    const { playerMock, rerender } = fullRender({
      id: 'start-and-end',
      videoId: 'XxVg_s8xAms',
      opts: {
        playerVars: {
          start: 1,
          end: 2,
        },
      },
    });

    expect(playerMock).toHaveBeenCalledWith('start-and-end', {
      videoId: 'XxVg_s8xAms',
      playerVars: {
        start: 1,
        end: 2,
      },
    });

    rerender({
      videoId: 'KYzlpRvWZ6c'
    });

    expect(playerMock.cueVideoById).toHaveBeenCalledWith({
      videoId: 'KYzlpRvWZ6c',
      startSeconds: 1,
      endSeconds: 2
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
