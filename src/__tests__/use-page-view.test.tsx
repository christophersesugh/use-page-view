import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { act } from 'react';
import { renderHook } from '@testing-library/react';
import { usePageView } from '../hooks/use-page-view';

(window as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('usePageView', () => {
  const mockOnPageView = vi.fn();
  const defaultProps = {
    pageId: 'test-page',
    onPageView: mockOnPageView,
  };

  beforeEach(() => {
    vi.useFakeTimers();
    mockOnPageView.mockClear();
    window.localStorage.clear();
    Object.defineProperty(document, 'hidden', {
      configurable: true,
      value: false,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should initialize with correct default values', async () => {
    const { result } = renderHook(() => usePageView(defaultProps));

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.timeSpent).toBe(0);
    expect(result.current.isActive).toBe(true);
  });

  it('should track time spent correctly', async () => {
    const { result } = renderHook(() => usePageView(defaultProps));

    await act(async () => {
      await Promise.resolve();
    });

    await act(async () => {
      vi.advanceTimersByTime(5000);
      await Promise.resolve();
    });

    expect(result.current.timeSpent).toBe(5);
  });

  it('should not call onPageView before minTimeThreshold', async () => {
    renderHook(() =>
      usePageView({
        ...defaultProps,
        minTimeThreshold: 10,
      }),
    );

    await act(async () => {
      await Promise.resolve();
    });

    await act(async () => {
      vi.advanceTimersByTime(5000);
      await Promise.resolve();
    });

    expect(mockOnPageView).not.toHaveBeenCalled();
  });

  it('should call onPageView after minTimeThreshold', async () => {
    renderHook(() =>
      usePageView({
        ...defaultProps,
        minTimeThreshold: 10,
        heartbeatInterval: 10,
      }),
    );

    expect(mockOnPageView).not.toHaveBeenCalled();

    await act(async () => {
      vi.advanceTimersByTime(10000);
      await Promise.resolve();
    });

    await act(async () => {
      vi.advanceTimersByTime(10000);
      await Promise.resolve();
    });

    expect(mockOnPageView).toHaveBeenCalledWith({
      pageId: 'test-page',
      timeSpent: 10,
      isActive: true,
    });
  });

  it('should track user activity correctly', async () => {
    const { result } = renderHook(() =>
      usePageView({
        ...defaultProps,
        inactivityThreshold: 5,
      }),
    );

    await act(async () => {
      await Promise.resolve();
    });

    await act(async () => {
      document.dispatchEvent(new MouseEvent('mousemove'));
      vi.advanceTimersByTime(2000);
      await Promise.resolve();
    });

    expect(result.current.isActive).toBe(true);

    await act(async () => {
      vi.advanceTimersByTime(6000);
      await Promise.resolve();
    });

    expect(result.current.isActive).toBe(false);
  });

  it('should handle page visibility changes', async () => {
    const { result } = renderHook(() => usePageView(defaultProps));

    await act(async () => {
      await Promise.resolve();
    });

    await act(async () => {
      Object.defineProperty(document, 'hidden', {
        configurable: true,
        value: true,
      });
      document.dispatchEvent(new Event('visibilitychange'));
      await Promise.resolve();
    });

    expect(result.current.isActive).toBe(false);

    await act(async () => {
      Object.defineProperty(document, 'hidden', {
        configurable: true,
        value: false,
      });
      document.dispatchEvent(new Event('visibilitychange'));
      await Promise.resolve();
    });

    expect(result.current.isActive).toBe(true);
  });

  it('should handle trackOnce option correctly', async () => {
    renderHook(() =>
      usePageView({
        ...defaultProps,
        trackOnce: true,
        trackOnceDelay: 5,
      }),
    );

    await act(async () => {
      await Promise.resolve();
    });

    expect(mockOnPageView).not.toHaveBeenCalled();

    await act(async () => {
      vi.advanceTimersByTime(5000);
      await Promise.resolve();
    });

    expect(mockOnPageView).toHaveBeenCalledTimes(1);
    expect(mockOnPageView).toHaveBeenCalledWith({
      pageId: 'test-page',
      timeSpent: 5,
      isActive: true,
    });

    await act(async () => {
      vi.advanceTimersByTime(5000);
      await Promise.resolve();
    });

    expect(mockOnPageView).toHaveBeenCalledTimes(1);
  });

  it('should include userId in page view data when provided', async () => {
    renderHook(() =>
      usePageView({
        ...defaultProps,
        userId: 'test-user',
        minTimeThreshold: 5,
        heartbeatInterval: 10,
      }),
    );

    await act(async () => {
      await Promise.resolve();
    });

    await act(async () => {
      vi.advanceTimersByTime(10000);
      await Promise.resolve();
    });
    await act(async () => {
      vi.advanceTimersByTime(10000);
      await Promise.resolve();
    });

    expect(mockOnPageView).toHaveBeenCalledWith({
      pageId: 'test-page',
      userId: 'test-user',
      timeSpent: 10,
      isActive: true,
    });
  });

  it('should handle custom heartbeat interval', async () => {
    renderHook(() =>
      usePageView({
        ...defaultProps,
        minTimeThreshold: 5,
        heartbeatInterval: 15,
      }),
    );

    await act(async () => {
      await Promise.resolve();
    });

    await act(async () => {
      vi.advanceTimersByTime(5000);
      await Promise.resolve();
    });

    await act(async () => {
      vi.advanceTimersByTime(15000);
      await Promise.resolve();
    });

    expect(mockOnPageView).toHaveBeenCalledTimes(1);

    await act(async () => {
      vi.advanceTimersByTime(15000);
      await Promise.resolve();
    });

    expect(mockOnPageView).toHaveBeenCalledTimes(2);
  });

  it('should send final data on unmount', async () => {
    const { unmount } = renderHook(() =>
      usePageView({
        ...defaultProps,
        minTimeThreshold: 5,
      }),
    );

    await act(async () => {
      await Promise.resolve();
    });

    await act(async () => {
      vi.advanceTimersByTime(10000);
      await Promise.resolve();
    });

    unmount();

    expect(mockOnPageView).toHaveBeenCalledWith({
      pageId: 'test-page',
      timeSpent: 10,
      isActive: false,
    });
  });
});
