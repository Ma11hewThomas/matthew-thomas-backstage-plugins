import { getDurationFromDates } from './getDurationFromDates';

describe('getDurationFromDates', () => {
  beforeAll(() => {
    jest.useFakeTimers('modern');
    jest.setSystemTime(new Date('2022-02-22T09:00:00.0000000Z'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe('getDurationFromDates with valid startTime and valid lastUpdateTime', () => {
    it('should return duration', () => {
      const startTime = new Date('2022-02-21T09:00:00.0000000Z');
      const lastUpdateTime = new Date('2022-02-21T10:30:00.0000000Z');

      const result = getDurationFromDates(startTime, lastUpdateTime);

      expect(result).toEqual('90 min');
    });
  });

  describe('getDurationFromDates with same startTime and lastUpdateTime', () => {
    it('should return duration from current time', () => {
      const startTime = new Date('2022-02-22T08:58:00.0000000Z');
      const lastUpdateTime = new Date('2022-02-22T08:58:00.0000000Z');
      const result = getDurationFromDates(startTime, lastUpdateTime);

      expect(result).toEqual('2 min');
    });
  });
});
