const iframe = document.createElement('iframe');

export const playerMock = {
  on: jest.fn(() => Promise.resolve()),
  cueVideoById: jest.fn(() => Promise.resolve()),
  loadVideoById: jest.fn(() => Promise.resolve()),
  getIframe: jest.fn(() => Promise.resolve(iframe)),
  stopVideo: jest.fn(() => Promise.resolve()),
  destroy: jest.fn(() => Promise.resolve()),
};

export default jest.fn(() => playerMock);
