import expect from 'expect';
import React from 'react';
import shallowRender from './helpers/shallowRender';
import fullRender from './helpers/fullRender';

describe('YouTube', () => {
  it('should render a div with a custom id', () => {
    const { output } = shallowRender({
      id: 'custom-id',
      url: 'https://www.youtube.com/watch?v=XxVg_s8xAms',
    });

    expect(output).toEqual(<div id="custom-id" className="" />);
  });

  it('should render a div with a custom className', () => {
    const { output } = shallowRender({
      id: 'custom-id',
      className: 'custom-class',
      url: 'https://www.youtube.com/watch?v=XxVg_s8xAms',
    });

    expect(output).toEqual(<div id="custom-id" className="custom-class" />);
  });

  it('should create and bind a new youtube player when mounted', () => {
    const { playerMock } = fullRender({
      url: 'https://www.youtube.com/watch?v=XxVg_s8xAms',
    });

    expect(playerMock.on.calls.length).toBe(3);
  });

  it('should load a url', () => {
    const { playerMock } = fullRender({
      url: 'https://www.youtube.com/watch?v=XxVg_s8xAms',
    });

    expect(playerMock.cueVideoById).toHaveBeenCalledWith('XxVg_s8xAms');
  });

  it('should load a new url', () => {
    const { playerMock, rerender } = fullRender({
      url: 'https://www.youtube.com/watch?v=XxVg_s8xAms',
    });

    rerender({
      url: 'https://www.youtube.com/watch?v=-DX3vJiqxm4',
    });

    expect(playerMock.cueVideoById).toHaveBeenCalledWith('XxVg_s8xAms');
    expect(playerMock.cueVideoById).toHaveBeenCalledWith('-DX3vJiqxm4');
  });

  it('should load a url with autoplay enabled', () => {
    const { playerMock } = fullRender({
      url: 'https://www.youtube.com/watch?v=XxVg_s8xAms',
      opts: {
        playerVars: {
          autoplay: 1,
        },
      },
    });

    expect(playerMock.cueVideoById).toNotHaveBeenCalled();
    expect(playerMock.loadVideoById).toHaveBeenCalledWith('XxVg_s8xAms');
  });

  it('should destroy the youtube player', () => {
    const { playerMock, unmount } = fullRender({
      url: 'https://www.youtube.com/watch?v=XxVg_s8xAms',
    });

    unmount();
    expect(playerMock.destroy).toHaveBeenCalled();
  });
});
