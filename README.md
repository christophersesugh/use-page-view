# use-page-view

A React hook for tracking page views and user engagement time. This hook provides real-time tracking of how long users spend on a page, their activity status, and flexible callbacks for implementing custom persistence and analytics.

[![npm version](https://img.shields.io/npm/v/use-page-view.svg)](https://www.npmjs.com/package/use-page-view)
[![npm downloads](https://img.shields.io/npm/dm/use-page-view.svg)](https://www.npmjs.com/package/use-page-view)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/use-page-view)](https://bundlephobia.com/package/use-page-view)
[![License](https://img.shields.io/npm/l/use-page-view.svg)](https://github.com/christophersesugh/use-page-view/blob/main/LICENSE)
[![CI Status](https://img.shields.io/github/actions/workflow/status/christophersesugh/use-page-view/ci.yml)](https://github.com/christophersesugh/use-page-view/actions)
[![Coverage](https://img.shields.io/codecov/c/github/christophersesugh/use-page-view)](https://codecov.io/gh/christophersesugh/use-page-view)

## Features

- 📊 Track time spent on pages
- 👀 Monitor user activity and page visibility
- 🔄 Periodic updates through callback
- ⏱️ Configurable thresholds and intervals
- 🎯 Support for one-time tracking
- 🔑 User identification support
- 🚀 Lightweight with minimal overhead
- 🌐 SSR/React Router/Next.js compatible
- 🛠️ Flexible - implement your own persistence strategy

## Installation

```bash
npm install use-page-view
# or
yarn add use-page-view
# or
pnpm add use-page-view
```

## Quick Start

```tsx
import { usePageView } from 'use-page-view';

function MyPage() {
  const { timeSpent, isActive } = usePageView({
    pageId: 'my-page',
    onPageView: (data) => console.log('Page view:', data),
  });

  return (
    <div>
      <h1>My Page</h1>
      <p>
        Time spent: {timeSpent}s {isActive ? '🟢 Active' : '🔴 Inactive'}
      </p>
    </div>
  );
}
```

## Compatibility

- **React**: 16.8+ (hooks support required)
- **TypeScript**: Full TypeScript support included
- **Browsers**: Modern browsers
- **SSR**: Compatible with React Router, Next.js and other SSR frameworks
- **React Native**: Not supported (web-only)

## Usage

```tsx
import { usePageView } from 'use-page-view';

function BlogPost() {
  const { timeSpent, isActive } = usePageView({
    pageId: 'blog-post-123',
    userId: 'user-456', // Optional
    minTimeThreshold: 10, // Minimum time before recording (seconds)
    heartbeatInterval: 30, // How often to send updates (seconds)
    inactivityThreshold: 60, // Time before user is considered inactive (seconds)
    onPageView: async (data) => {
      try {
        await fetch('/api/track-page-view', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
      } catch (error) {
        console.error('Failed to track page view:', error);
      }
    },
  });

  return (
    <div>
      <div>
        Time: {formatTime(timeSpent)} {isActive ? '🟢' : '🔴'}
      </div>
      <article>Your content here...</article>
    </div>
  );
}

// Helper function to format time
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
```

## API

### usePageView(options)

#### Options

| Option                | Type                           | Default  | Description                                                            |
| --------------------- | ------------------------------ | -------- | ---------------------------------------------------------------------- |
| `pageId`              | `string`                       | Required | Unique identifier for the page being tracked                           |
| `userId`              | `string`                       | Optional | User identifier if user is logged in                                   |
| `minTimeThreshold`    | `number`                       | `5`      | Minimum time in seconds before recording a view                        |
| `heartbeatInterval`   | `number`                       | `30`     | How often to send updates in seconds                                   |
| `inactivityThreshold` | `number`                       | `30`     | Time in seconds before user is considered inactive                     |
| `onPageView`          | `(data: PageViewData) => void` | Optional | Callback function to handle page view data                             |
| `trackOnce`           | `boolean`                      | `false`  | Track only the initial view                                            |
| `trackOnceDelay`      | `number`                       | `0`      | Minimum time in seconds before recording a view when trackOnce is true |

#### Returns

| Property    | Type      | Description                                      |
| ----------- | --------- | ------------------------------------------------ |
| `timeSpent` | `number`  | Total time spent on the page in seconds          |
| `isActive`  | `boolean` | Whether the user is currently active on the page |

### PageViewData

```typescript
interface PageViewData {
  pageId: string;
  userId?: string;
  timeSpent: number;
  isActive: boolean;
}
```

## Examples

### Basic Usage

```tsx
function Article() {
  const { timeSpent, isActive } = usePageView({
    pageId: 'article-789',
    onPageView: (data) => {
      console.log('Article view:', data);
    },
  });

  return (
    <div>
      <h1>Article Title</h1>
      <div>Time spent: {formatTime(timeSpent)}</div>
      <p>Article content...</p>
    </div>
  );
}
```

### One-time Tracking

```tsx
function LandingPage() {
  const { timeSpent, isActive } = usePageView({
    pageId: 'landing-page',
    trackOnce: true,
    trackOnceDelay: 30, // Track after 30 seconds
    onPageView: (data) => {
      analytics.track('landing_page_view', data);
    },
  });

  return (
    <div>
      <h1>Welcome</h1>
      <div>Time on page: {formatTime(timeSpent)}</div>
    </div>
  );
}
```

### Error Handling

```tsx
function PageWithErrorHandling() {
  const { timeSpent, isActive } = usePageView({
    pageId: 'important-page',
    onPageView: async (data) => {
      try {
        const response = await fetch('/api/analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (error) {
        console.error('Analytics tracking failed:', error);
        // Optionally queue for retry or use alternative tracking
      }
    },
  });

  return <div>Your page content</div>;
}
```

## Features in Detail

### Time Tracking

- Tracks total time spent on the page
- Updates every second
- Handles browser tab switching and page visibility changes
- Supports custom initial time values for persistence scenarios

### Activity Monitoring

- Detects user activity through mouse, keyboard, and touch events
- Monitors page visibility changes
- Updates active status based on user engagement
- Configurable inactivity threshold

### Flexible Persistence

- No built-in persistence to keep the library lightweight
- Easy to implement custom persistence strategies

### Callback System

- Periodic updates through `onPageView` callback
- Configurable update interval with `heartbeatInterval`
- Minimum time threshold with `minTimeThreshold`
- One-time tracking option with `trackOnce`

## Performance

- **Minimal overhead**: Efficient event handling with automatic cleanup
- **Memory efficient**: Uses `requestIdleCallback` when available
- **Bundle size**: < 5KB minified + gzipped
- **No dependencies**: Zero external dependencies for maximum compatibility
- **Automatic cleanup**: All event listeners and timers are cleaned up on unmount

## FAQ

**Q: Does this work with SSR/React Router/Next.js?**
A: Yes, the hook safely handles server-side rendering by checking for browser environment before initializing.

**Q: How do I persist time tracking across page reloads?**
A: Implement your own persistence strategy using the examples above. You can use localStorage, sessionStorage, databases, or any other storage method that fits your needs.

**Q: How accurate is the time tracking?**
A: Time tracking is updated every second and accounts for page visibility changes and user inactivity.

**Q: Can I track multiple pages in the same app?**
A: Yes, use different `pageId` values for each page or component you want to track separately.

**Q: Does this affect my app's performance?**
A: No, the hook uses efficient event handling and cleanup. The bundle size is minimal (< 3KB).

**Q: What events are considered "activity"?**
A: Mouse movement, clicks, keyboard input, touch events, and scroll events are all considered user activity.

**Q: Why doesn't the hook include built-in localStorage support?**
A: To keep the library lightweight and flexible. Different applications have different persistence needs, and this approach allows you to implement exactly what you need without bloating the core library.

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
