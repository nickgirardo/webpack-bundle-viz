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
