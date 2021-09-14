import { fmtPercent, fmtSize } from './fmt';

describe('fmtPercent', () => {
  test('Returns 100% if ratio is 1', () => {
    expect(fmtPercent(1)).toBe('100%');
  });

  describe('Values between 0 and 1', () => {
    test('Returns expected values for basic ratios', () => {
      expect(fmtPercent(1/2)).toBe('50%');
      expect(fmtPercent(1/4)).toBe('25%');
    });

    test('Returns correct number of decimal places for infinite decimals', () => {
      expect(fmtPercent(1/3, 0)).toBe('33%');
      expect(fmtPercent(1/3, 1)).toBe('33.3%');
      expect(fmtPercent(1/3, 2)).toBe('33.33%');
      expect(fmtPercent(1/3, 3)).toBe('33.333%');
      expect(fmtPercent(1/3, 4)).toBe('33.3333%');
    });

    test('Defaults to two decimal places', () => {
      expect(fmtPercent(1/3)).toBe(fmtPercent(1/3, 2));
    });
  });

  describe('Values greater than 1', () => {
    test('Returns expected values for whole numbers', () => {
      expect(fmtPercent(2)).toBe('200%');
    });

    test('Returns expected values for basic ratios', () => {
      expect(fmtPercent(3/2)).toBe('150%');
      expect(fmtPercent(11/4)).toBe('275%');
    });

    test('Returns correct number of decimal places for infinite decimals', () => {
      expect(fmtPercent(4/3, 0)).toBe('133%');
      expect(fmtPercent(4/3, 1)).toBe('133.3%');
      expect(fmtPercent(4/3, 2)).toBe('133.33%');
      expect(fmtPercent(4/3, 3)).toBe('133.333%');
      expect(fmtPercent(4/3, 4)).toBe('133.3333%');
    });

    test('Defaults to two decimal places', () => {
      expect(fmtPercent(4/3)).toBe(fmtPercent(4/3, 2));
    });
  });

  describe('Values less than 0', () => {
    test('Returns expected values for whole numbers', () => {
      expect(fmtPercent(-1)).toBe('-100%');
      expect(fmtPercent(-2)).toBe('-200%');
    });

    test('Returns expected values for basic ratios', () => {
      expect(fmtPercent(-1/2)).toBe('-50%');
      expect(fmtPercent(-3/4)).toBe('-75%');
    });

    test('Returns correct number of decimal places for infinite decimals', () => {
      expect(fmtPercent(-1/3, 0)).toBe('-33%');
      expect(fmtPercent(-1/3, 1)).toBe('-33.3%');
      expect(fmtPercent(-1/3, 2)).toBe('-33.33%');
      expect(fmtPercent(-1/3, 3)).toBe('-33.333%');
      expect(fmtPercent(-1/3, 4)).toBe('-33.3333%');
    });

    test('Defaults to two decimal places', () => {
      expect(fmtPercent(4/3)).toBe(fmtPercent(4/3, 2));
    });
  });
});

describe('fmtSize', () => {
  test('Uses correct units for different scales', () => {
    const suffixes = ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];

    expect(fmtSize(1024**0)).toBe('1B');
    expect(fmtSize(1024**1)).toBe('1KiB');
    expect(fmtSize(1024**2)).toBe('1MiB');
    expect(fmtSize(1024**3)).toBe('1GiB');
    expect(fmtSize(1024**4)).toBe('1TiB');
    expect(fmtSize(1024**5)).toBe('1PiB');
    expect(fmtSize(1024**6)).toBe('1EiB');
    expect(fmtSize(1024**7)).toBe('1ZiB');
    expect(fmtSize(1024**8)).toBe('1YiB');
  });

  test('Gives up if the size is too large', () => {
    expect(fmtSize(1024**9)).toBe('Very large');
    expect(fmtSize(Infinity)).toBe('Very large');
  });

  test('Scales starting value correctly', () => {
    expect(fmtSize(344)).toBe('344B');
    expect(fmtSize(27* (1024**3))).toBe('27GiB');
  });

  describe('Handling of decimal results', () => {
    test('Respects decimal parameter', () => {
      expect(fmtSize(4/3 * (1024**3), 0)).toBe('1GiB');
      expect(fmtSize(4/3 * (1024**3), 1)).toBe('1.3GiB');
      expect(fmtSize(4/3 * (1024**3), 2)).toBe('1.33GiB');
      expect(fmtSize(4/3 * (1024**3), 3)).toBe('1.333GiB');
      expect(fmtSize(4/3 * (1024**3), 4)).toBe('1.3333GiB');
      expect(fmtSize(4/3 * (1024**3), 5)).toBe('1.33333GiB');
    });

    test('Decimal parameter defaults to 2', () => {
      const value = 4/3 * (1024**3);
      expect(fmtSize(value)).toBe(fmtSize(value, 2));
    });
  });
});
