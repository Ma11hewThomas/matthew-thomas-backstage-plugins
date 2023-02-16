/*
 * Copyright 2022 Matthew Thomas
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { getDurationFromDates } from './getDurationFromDates';

describe('getDurationFromDates', () => {
  beforeAll(() => {
    jest.useFakeTimers();
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

      expect(result).toEqual('90 mins');
    });
  });

  describe('getDurationFromDates with same startTime and lastUpdateTime', () => {
    it('should return duration from current time', () => {
      const startTime = new Date('2022-02-22T08:58:00.0000000Z');
      const lastUpdateTime = new Date('2022-02-22T08:58:00.0000000Z');
      const result = getDurationFromDates(startTime, lastUpdateTime);

      expect(result).toEqual('2 mins');
    });
  });
});
