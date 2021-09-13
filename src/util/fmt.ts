export function fmtPercent (ratio: number, digits: number = 2): string {
  if (ratio === 1)
    return '100%';

  const scaled = ratio * 100;
  const major = Math.floor(scaled);

  const minor = scaled - major;
  const minorTrunc = Math.round(minor * (10 ** digits));

  if (minorTrunc !== 0)
    return `${major}.${minorTrunc}%`;

  return `${major}%`;
}

