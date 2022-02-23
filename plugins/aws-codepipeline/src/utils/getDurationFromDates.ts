import { DateTime } from 'luxon';

export const getDurationFromDates = (
  startTime: Date,
  lastUpdateTime: Date,
): string => {
  const lastUpdate =
    lastUpdateTime?.toISOString() !== startTime.toISOString()
      ? DateTime.fromISO(lastUpdateTime.toISOString())
      : DateTime.fromISO(new Date(Date.now()).toISOString());
  const start = DateTime.fromISO(startTime.toISOString());

  return lastUpdate
    .diff(start, ['minutes'])
    .toHuman({ unitDisplay: 'short', maximumFractionDigits: 0 });
};
