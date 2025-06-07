import * as React from 'react';
import { useInterval } from './use-interval';

/**
 * Data structure for page view tracking
 */
export interface PageViewData {
  pageId: string;
  userId?: string;
  timeSpent: number;
  isActive: boolean;
}

/**
 * Configuration options for the page view tracker
 */
interface UsePageViewOptions {
  /** Unique identifier for the page being tracked */
  pageId: string;
  /** Optional user identifier if user is logged in */
  userId?: string;
  /** Minimum time in seconds before recording a view (default: 5) */
  minTimeThreshold?: number;
  /** How often to send updates in seconds (default: 30) */
  heartbeatInterval?: number;
  /** Time in seconds before user is considered inactive (default: 30) */
  inactivityThreshold?: number;
  /** Callback function to handle page view data */
  onPageView?: (data: PageViewData) => void;
  /** Track only the initial view (default: false) */
  trackOnce?: boolean;
  /** Minimum time in seconds before recording a view when trackOnce is true (default: 0) */
  trackOnceDelay?: number;
  /** Whether to persist the timeSpent value in localStorage (default: false) */
  persistTimeSpent?: boolean;
}

/**
 * A React hook to track page views and user engagement time. It monitors user activity,
 * page visibility, and time spent on the page, providing real-time updates through
 * a callback function.
 *
 * @param options - Configuration options for the page view tracker
 * @param options.pageId - Unique identifier for the page being tracked
 * @param options.userId - Optional user identifier if user is logged in
 * @param options.minTimeThreshold - Minimum time in seconds before recording a view (default: 5)
 * @param options.heartbeatInterval - How often to send updates in seconds (default: 30)
 * @param options.inactivityThreshold - Time in seconds before user is considered inactive (default: 30)
 * @param options.onPageView - Callback function to handle page view data
 * @param options.trackOnce - Track only the initial view (default: false)
 * @param options.trackOnceDelay - Minimum time in seconds before recording a view when trackOnce is true (default: 0)
 * @param options.persistTimeSpent - Whether to persist the timeSpent value in localStorage (default: false)
 *
 * @returns An object containing:
 *   - timeSpent: number - Total time spent on the page in seconds
 *   - isActive: boolean - Whether the user is currently active on the page
 *
 * @example
 * ```tsx
 * // Example of a time formatting function
 * function formatTime(seconds: number): string {
 *   const mins = Math.floor(seconds / 60);
 *   const secs = seconds % 60;
 *   return `${mins}:${secs.toString().padStart(2, '0')}`;
 * }
 *
 * const handlePageView = React.useCallback(async (data: PageViewData) => {
 *   await fetch('/api/track-page-view', {
 *     method: 'POST',
 *     body: JSON.stringify(data)
 *   });
 * }, []);
 *
 * function BlogPost() {
 *   const { timeSpent, isActive } = usePageView({
 *     pageId: 'blog-post-123',
 *     userId: 'user-456',
 *     minTimeThreshold: 10,
 *     heartbeatInterval: 30,
 *     inactivityThreshold: 60, // User considered inactive after 60 seconds
 *     onPageView: handlePageView,
 *     persistTimeSpent: true, // Enable localStorage persistence
 *   });
 *
 *   return (
 *     <div>
 *       <div>
 *         Time: {formatTime(timeSpent)} {isActive ? '🟢' : '🔴'}
 *       </div>
 *       <article>Your content here...</article>
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Example with trackOnce and persistTimeSpent
 * function Article() {
 *   const { timeSpent, isActive } = usePageView({
 *     pageId: 'article-789',
 *     trackOnce: true,
 *     trackOnceDelay: 30, // Track after 30 seconds
 *     persistTimeSpent: true, // Persist time across page reloads
 *     onPageView: (data) => {
 *       console.log('Article view:', data);
 *     },
 *   });
 *
 *   return (
 *     <div>
 *       <h1>Article Title</h1>
 *       <div>Time spent: {formatTime(timeSpent)}</div>
 *       <p>Article content...</p>
 *     </div>
 *   );
 * }
 * ```
 */
export function usePageView({
  pageId,
  userId,
  minTimeThreshold = 5,
  heartbeatInterval = 30,
  inactivityThreshold = 30,
  onPageView,
  trackOnce = false,
  trackOnceDelay = 0,
  persistTimeSpent = false,
}: UsePageViewOptions) {
  const [timeSpent, setTimeSpent] = React.useState(() => {
    if (persistTimeSpent && typeof window !== 'undefined') {
      const stored = window.localStorage.getItem(`page-view-${pageId}`);
      return stored ? parseInt(stored, 10) : 0;
    }
    return 0;
  });
  const [isActive, setIsActive] = React.useState(true);
  const startTimeRef = React.useRef<number>(0);
  const lastActiveRef = React.useRef<number>(0);
  const onPageViewRef = React.useRef(onPageView);
  const hasTrackedRef = React.useRef(false);

  // Save timeSpent to localStorage when it changes
  React.useEffect(() => {
    if (persistTimeSpent && typeof window !== 'undefined') {
      window.localStorage.setItem(`page-view-${pageId}`, timeSpent.toString());
    }
  }, [timeSpent, persistTimeSpent, pageId]);

  // Initialize timestamps on client-side only to avoid hydration errors
  React.useEffect(() => {
    startTimeRef.current = Date.now();
    lastActiveRef.current = Date.now();
  }, []);

  // Update ref when callback changes
  React.useEffect(() => {
    onPageViewRef.current = onPageView;
  }, [onPageView]);

  // Track initial view if trackOnce is true
  React.useEffect(() => {
    if (
      trackOnce &&
      !hasTrackedRef.current &&
      onPageViewRef.current &&
      startTimeRef.current > 0
    ) {
      // If there's a delay, wait for it before tracking
      if (trackOnceDelay > 0) {
        const timer = setTimeout(() => {
          if (!hasTrackedRef.current) {
            hasTrackedRef.current = true;
            onPageViewRef.current?.({
              pageId,
              userId,
              timeSpent: trackOnceDelay,
              isActive: true,
            });
          }
        }, trackOnceDelay * 1000);

        return () => clearTimeout(timer);
      } else {
        // No delay, track immediately
        hasTrackedRef.current = true;
        onPageViewRef.current({
          pageId,
          userId,
          timeSpent: 0,
          isActive: true,
        });
      }
    }
  }, [trackOnce, pageId, userId, trackOnceDelay]);

  /**
   * Effect to track page visibility and user activity
   * - Monitors document visibility changes
   * - Tracks user interactions (mouse, keyboard, touch)
   * - Updates active state based on user engagement
   */
  React.useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsActive(false);
      } else {
        setIsActive(true);
        lastActiveRef.current = Date.now();
      }
    };

    const handleActivity = () => {
      lastActiveRef.current = Date.now();
      setIsActive(true);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click',
    ];
    events.forEach((event) => {
      document.addEventListener(event, handleActivity, { passive: true });
    });

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, []);

  // Main timer - tracks total time
  useInterval(() => {
    if (startTimeRef.current === 0) return;

    const now = Date.now();
    const currentTimeSpent = Math.floor((now - startTimeRef.current) / 1000);
    const timeSinceActivity = now - lastActiveRef.current;
    const isCurrentlyActive = timeSinceActivity < inactivityThreshold * 1000; // Convert seconds to milliseconds

    setTimeSpent(currentTimeSpent);
    setIsActive(isCurrentlyActive);
  }, 1000);

  // Heartbeat - periodically send data to server
  useInterval(() => {
    if (
      !trackOnce &&
      timeSpent >= minTimeThreshold &&
      onPageViewRef.current &&
      startTimeRef.current > 0
    ) {
      onPageViewRef.current({
        pageId,
        userId,
        timeSpent,
        isActive,
      });
    }
  }, heartbeatInterval * 1000);

  /**
   * Effect to send final data on unmount
   * - Sends one last update when component unmounts
   * - Only sends if minimum time threshold is met
   */
  React.useEffect(() => {
    const startTime = startTimeRef.current;
    return () => {
      if (!trackOnce && startTime > 0) {
        const finalTimeSpent = Math.floor((Date.now() - startTime) / 1000);
        if (finalTimeSpent >= minTimeThreshold && onPageViewRef.current) {
          onPageViewRef.current({
            pageId,
            userId,
            timeSpent: finalTimeSpent,
            isActive: false,
          });
        }
      }
    };
  }, [pageId, userId, minTimeThreshold, trackOnce]);

  return {
    timeSpent,
    isActive,
  };
}
