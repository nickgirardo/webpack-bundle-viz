// digits is the number of digits after the decimal point
export function fmtPercent (ratio: number, digits: number = 2): string {
  const sign = ratio < 0 ? '-' : '';

  const scaled = Math.abs(ratio) * 100;
  const major = Math.floor(scaled);

  const minor = scaled - major;
  const minorTrunc = Math.round(minor * (10 ** digits));

  if (minorTrunc !== 0)
    return `${sign}${major}.${minorTrunc}%`;

  return `${sign}${major}%`;
}

// digits is the number of digits after the decimal point
export function fmtSize (size: number, digits: number = 2): string {
  const suffixes = ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];

  const magnitude = Math.floor(Math.log(size)/Math.log(1024));

  if (magnitude >= suffixes.length)
    return 'Very large';

  const scaledSize = size / (1024 ** magnitude);

  const roundedSize = Math.floor(scaledSize * (10 ** digits)) / (10 ** digits);

  return `${roundedSize} ${suffixes[magnitude]}`;
}
