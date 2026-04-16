const logger = require('../../src/middleware/logger');

describe('logger middleware', () => {
  it('logs the request method and url with a timestamp', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    const req = { method: 'GET', url: '/test' };
    const next = jest.fn();

    logger(req, {}, next);

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringMatching(/^\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] GET \/test$/)
    );
    expect(next).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});
