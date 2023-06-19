import '@testing-library/jest-dom';
import React from 'react';
import { render, queryByAttribute, waitFor } from '@testing-library/react';
import YouTube from './YouTube';

// @ts-ignore
import Player, { playerMock } from './__mocks__/youtube-player';

describe('YouTube', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mock('youtube-player');
  });

  it('should expose player state constants', () => {
    expect(YouTube.PlayerState).toBeDefined();
    expect(Object.keys(YouTube.PlayerState)).toEqual(['UNSTARTED', 'ENDED', 'PLAYING', 'PAUSED', 'BUFFERING', 'CUED']);
  });

  it('should render a div with a custom id', () => {
    const { container } = render(<YouTube id="custom-id" videoId="XxVg_s8xAms" />);

    expect(queryByAttribute('id', container, 'custom-id')).toBeDefined();
  });

  it('should render a div with a custom className', () => {
    const { container } = render(<YouTube className="custom-class" videoId="XxVg_s8xAms" />);

    expect(queryByAttribute('class', container, 'custom-class')).toBeDefined();
  });

  it('should render an iframe with a custom class name', () => {
    const { container } = render(<YouTube iframeClassName="custom-frame-class" videoId="XxVg_s8xAms" />);

    expect(queryByAttribute('class', container, 'custom-frame-class')).toBeDefined();
  });

  it("should update iframe class name once it's changed", () => {
    const { container, rerender } = render(<YouTube iframeClassName="custom-frame-class" videoId="XxVg_s8xAms" />);

    rerender(<YouTube iframeClassName="custom-frame-class-2" videoId="XxVg_s8xAms" />);
    expect(queryByAttribute('class', container, 'custom-frame-class-2')).toBeDefined();
  });

  it('should update an id', () => {
    const { rerender } = render(<YouTube id="custom-id" videoId="XxVg_s8xAms" />);

    rerender(<YouTube id="custom-id2" videoId="XxVg_s8xAms" />);

    expect(playerMock.getIframe).toHaveBeenCalled();
  });

  it('should update a className', () => {
    const { rerender } = render(<YouTube className="custom-class1" videoId="XxVg_s8xAms" />);

    rerender(<YouTube className="custom-class2" videoId="XxVg_s8xAms" />);

    expect(playerMock.getIframe).toHaveBeenCalled();
  });

  it('should update the title when modified', () => {
    const { rerender } = render(<YouTube title="Video about a cat" videoId="XxVg_s8xAms" />);

    rerender(<YouTube title="Video about a dancing cat" videoId="XxVg_s8xAms" />);

    expect(playerMock.getIframe).toHaveBeenCalled();
  });

  it('should update the title when removed', () => {
    const { rerender } = render(<YouTube title="Video about a cat" videoId="XxVg_s8xAms" />);

    rerender(<YouTube videoId="XxVg_s8xAms" />);

    expect(playerMock.getIframe).toHaveBeenCalled();
  });

  it('should update the loading when modified', () => {
    const { rerender } = render(<YouTube loading="lazy" videoId="XxVg_s8xAms" />);

    rerender(<YouTube loading="eager" videoId="XxVg_s8xAms" />);

    expect(playerMock.getIframe).toHaveBeenCalled();
  });

  it('should update the loading when removed', () => {
    const { rerender } = render(<YouTube loading="lazy" videoId="XxVg_s8xAms" />);

    rerender(<YouTube videoId="XxVg_s8xAms" />);

    expect(playerMock.getIframe).toHaveBeenCalled();
  });

  it('should not update id and className when no change in them', () => {
    const className = 'custom-class';
    const videoId = 'XxVg_s8xAms';

    const { rerender } = render(<YouTube className={className} videoId={videoId} />);

    rerender(<YouTube className={className} videoId={videoId} />);

    expect(playerMock.getIframe).toHaveBeenCalledTimes(0);
  });

  it('should create and bind a new YouTube player when mounted', () => {
    render(<YouTube videoId="XxVg_s8xAms" />);

    expect(playerMock.on).toHaveBeenCalledTimes(5);
    expect(playerMock.getIframe).toHaveBeenCalledTimes(0);
  });

  it('should create and bind a new YouTube player when mounted with title and loading', () => {
    render(<YouTube videoId="XxVg_s8xAms" title="Custom title" loading="lazy" />);

    expect(playerMock.on).toHaveBeenCalledTimes(5);
    expect(playerMock.getIframe).toHaveBeenCalled();
  });

  it('should create and bind a new YouTube player when props.opts changes', () => {
    const { rerender } = render(
      <YouTube
        videoId="XxVg_s8xAms"
        opts={{
          width: '480px',
          height: '360px',
          playerVars: {
            controls: 1,
            start: 0,
          },
        }}
      />,
    );

    rerender(
      <YouTube
        videoId="XxVg_s8xAms"
        opts={{
          width: '480px',
          height: '360px',
          playerVars: {
            controls: 0,
            start: 10,
          },
        }}
      />,
    );

    // player is destroyed & rebound
    expect(playerMock.destroy).toHaveBeenCalled();
  });

  it('should not create and bind a new YouTube player when only props.videoId changes', async () => {
    const { rerender } = render(
      <YouTube
        videoId="XxVg_s8xAms"
        opts={{
          width: '480px',
          height: '360px',
        }}
      />,
    );

    rerender(
      <YouTube
        videoId="-DX3vJiqxm4" // changed
        opts={{
          width: '480px',
          height: '360px',
        }}
      />,
    );

    // player is not destroyed & rebound, despite the change
    expect(playerMock.destroy).not.toHaveBeenCalled();
  });

  it('should not create and bind a new YouTube player when only playerVars.autoplay, playerVars.start, or playerVars.end change', () => {
    const { rerender } = render(
      <YouTube
        videoId="XxVg_s8xAms"
        opts={{
          width: '480px',
          height: '360px',
          playerVars: {
            autoplay: 0,
            start: 0,
            end: 50,
          },
        }}
      />,
    );

    rerender(
      <YouTube
        videoId="XxVg_s8xAms"
        opts={{
          width: '480px',
          height: '360px',
          playerVars: {
            autoplay: 1, // changed, does not force destroy & rebind
            start: 10, // changed, does not force destroy & rebind
            end: 20, // changed, does not force destroy & rebind
          },
        }}
      />,
    );

    // player is destroyed & rebound, despite the changes
    expect(playerMock.destroy).not.toHaveBeenCalled();
    // instead only the video is updated
    expect(playerMock.loadVideoById).toHaveBeenCalled();
  });

  it('should create and bind a new YouTube player when props.opts AND props.videoId change', () => {
    const { rerender } = render(
      <YouTube
        videoId="XxVg_s8xAms"
        opts={{
          width: '480px',
          height: '360px',
          playerVars: {
            controls: 1,
          },
        }}
      />,
    );

    rerender(
      <YouTube
        videoId="-DX3vJiqxm4" // changed
        opts={{
          width: '480px',
          height: '360px',
          playerVars: {
            controls: 0, // changed
          },
        }}
      />,
    );

    // player is destroyed & rebound
    expect(playerMock.destroy).toHaveBeenCalled();
  });

  it('should load a video', () => {
    render(<YouTube id="should-load-a-video" videoId="XxVg_s8xAms" />);

    expect(Player).toHaveBeenCalled();
    expect(Player.mock.calls[0][1]).toEqual({ videoId: 'XxVg_s8xAms' });
  });

  it('should load a new video', async () => {
    const { rerender } = render(<YouTube id="new-video" videoId="XxVg_s8xAms" />);

    rerender(<YouTube id="new-video" videoId="-DX3vJiqxm4" />);

    expect(Player).toHaveBeenCalled();
    expect(Player.mock.calls[0][0] instanceof HTMLDivElement).toBe(true);
    expect(Player.mock.calls[0][1]).toEqual({ videoId: 'XxVg_s8xAms' });
    await waitFor(() => expect(playerMock.cueVideoById).toHaveBeenCalledWith({ videoId: '-DX3vJiqxm4' }));
  });

  it('should not load a video when props.videoId is null', async () => {
    // @ts-ignore
    render(<YouTube videoId={null} />);

    await waitFor(() => expect(playerMock.cueVideoById).not.toHaveBeenCalled());
  });

  it('should stop a video when props.videoId changes to null', async () => {
    const { rerender } = render(<YouTube videoId="XxVg_s8xAms" />);

    expect(Player).toHaveBeenCalled();

    // @ts-ignore
    rerender(<YouTube videoId={null} />);

    await waitFor(() => expect(playerMock.stopVideo).toHaveBeenCalled());
  });

  it('should load a video with autoplay enabled', () => {
    render(
      <YouTube
        id="should-load-autoplay"
        videoId="XxVg_s8xAms"
        opts={{
          playerVars: {
            autoplay: 1,
          },
        }}
      />,
    );

    expect(playerMock.cueVideoById).not.toHaveBeenCalled();
    expect(playerMock.loadVideoById).not.toHaveBeenCalled();
    expect(Player).toHaveBeenCalled();
    expect(Player.mock.calls[0][1]).toEqual({
      videoId: 'XxVg_s8xAms',
      playerVars: {
        autoplay: 1,
      },
    });
  });

  it('should load a new video with autoplay enabled', async () => {
    const { rerender } = render(
      <YouTube
        id="should-load-new-autoplay"
        videoId="XxVg_s8xAms"
        opts={{
          playerVars: {
            autoplay: 1,
          },
        }}
      />,
    );

    expect(Player).toHaveBeenCalled();
    expect(Player.mock.calls[0][1]).toEqual({
      videoId: 'XxVg_s8xAms',
      playerVars: {
        autoplay: 1,
      },
    });

    rerender(
      <YouTube
        id="should-load-new-autoplay"
        videoId="something"
        opts={{
          playerVars: {
            autoplay: 1,
          },
        }}
      />,
    );

    expect(playerMock.cueVideoById).not.toHaveBeenCalled();
    await waitFor(() => expect(playerMock.loadVideoById).toHaveBeenCalledWith({ videoId: 'something' }));
  });

  it('should load a video with a set starting and ending time', async () => {
    const { rerender } = render(
      <YouTube
        videoId="XxVg_s8xAms"
        opts={{
          playerVars: {
            start: 1,
            end: 2,
          },
        }}
      />,
    );

    expect(Player).toHaveBeenCalled();
    expect(Player.mock.calls[0][1]).toEqual({
      videoId: 'XxVg_s8xAms',
      playerVars: {
        start: 1,
        end: 2,
      },
    });

    rerender(
      <YouTube
        videoId="KYzlpRvWZ6c"
        opts={{
          playerVars: {
            start: 1,
            end: 2,
          },
        }}
      />,
    );

    await waitFor(() => {
      expect(playerMock.cueVideoById).toHaveBeenCalledWith({
        videoId: 'KYzlpRvWZ6c',
        startSeconds: 1,
        endSeconds: 2,
      });
    });
  });

  it('should destroy the YouTube player', () => {
    const { unmount } = render(<YouTube videoId="XxVg_s8xAms" />);

    unmount();

    expect(playerMock.destroy).toHaveBeenCalled();
  });
});
