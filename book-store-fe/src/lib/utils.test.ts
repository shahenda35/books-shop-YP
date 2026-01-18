import { describe, it, expect, vi } from 'vitest';
import { debounce, formatPrice, truncate } from './utils';

const useRealTimers = () => {
    vi.useRealTimers();
};

describe('utils', () => {
  it('formats price in USD currency', () => {
    expect(formatPrice(19.99)).toBe('$19.99');
    expect(formatPrice('1000')).toBe('$1,000.00');
  });

  it('truncates long strings and preserves short ones', () => {
    expect(truncate('short', 10)).toBe('short');
    expect(truncate('this is too long', 7)).toBe('this is...');
  });

  it('debounces calls and only invokes the last call after the wait', () => {
    vi.useFakeTimers();

    const spy = vi.fn();
    const debounced = debounce(spy, 300);

    debounced('first');
    debounced('second');

    expect(spy).not.toHaveBeenCalled();

    vi.advanceTimersByTime(299);
    expect(spy).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('second');

    useRealTimers();
  });
});
