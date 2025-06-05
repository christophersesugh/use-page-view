# use-page-view

A React hook for tracking page views and user engagement time. This hook provides real-time monitoring of user activity, page visibility, and time spent on pages.

[![npm version](https://img.shields.io/npm/v/use-page-view.svg)](https://www.npmjs.com/package/use-page-view)
[![npm downloads](https://img.shields.io/npm/dm/use-page-view.svg)](https://www.npmjs.com/package/use-page-view)
[![License](https://img.shields.io/npm/l/use-page-view.svg)](https://github.com/christophersesugh/use-page-view/blob/main/LICENSE)
[![CI Status](https://img.shields.io/github/actions/workflow/status/christophersesugh/use-page-view/ci.yml)](https://github.com/christophersesugh/use-page-view/actions)
[![Coverage](https://img.shields.io/codecov/c/github/christophersesugh/use-page-view)](https://codecov.io/gh/christophersesugh/use-page-view)

## Features

- 📊 Track time spent on pages
- 👀 Monitor user activity and page visibility
- ⏱️ Configurable tracking intervals
- 🔄 Real-time updates
- 🎯 Support for both continuous and one-time tracking
- 🛡️ TypeScript support

## Installation

```bash
npm install use-page-view
# or
yarn add use-page-view
# or
pnpm add use-page-view
```

## Basic Usage

```tsx
import { usePageView } from 'use-page-view';

function BlogPost() {
  const { timeSpent, isActive } = usePageView({
    pageId: 'blog-post-123',
    onPageView: (data) => {
      // Handle page view data
      console.log(data);
    },
  });

  return (
    <div>
      <div>
        Time spent: {timeSpent}s {isActive ? '🟢' : '🔴'}
      </div>
      <article>Your content here...</article>
    </div>
  );
}
```

## API Reference

### Parameters

The `usePageView` hook accepts an options object with the following properties:

| Parameter             | Type                           | Required | Default | Description                                                            |
| --------------------- | ------------------------------ | -------- | ------- | ---------------------------------------------------------------------- |
| `pageId`              | `string`                       | Yes      | -       | Unique identifier for the page being tracked                           |
| `userId`              | `string`                       | No       | -       | Optional user identifier if user is logged in                          |
| `minTimeThreshold`    | `number`                       | No       | `5`     | Minimum time in seconds before recording a view                        |
| `heartbeatInterval`   | `number`                       | No       | `30`    | How often to send updates in seconds                                   |
| `inactivityThreshold` | `number`                       | No       | `30`    | Time in seconds before user is considered inactive                     |
| `onPageView`          | `(data: PageViewData) => void` | No       | -       | Callback function to handle page view data                             |
| `trackOnce`           | `boolean`                      | No       | `false` | Track only the initial view                                            |
| `trackOnceDelay`      | `number`                       | No       | `0`     | Minimum time in seconds before recording a view when trackOnce is true |

### Return Value

The hook returns an object with the following properties:

| Property    | Type      | Description                                      |
| ----------- | --------- | ------------------------------------------------ |
| `timeSpent` | `number`  | Total time spent on the page in seconds          |
| `isActive`  | `boolean` | Whether the user is currently active on the page |

### PageViewData Interface

The `onPageView` callback receives a `PageViewData` object with the following structure:

```typescript
interface PageViewData {
  pageId: string; // The page identifier
  userId?: string; // Optional user identifier
  timeSpent: number; // Time spent in seconds
  isActive: boolean; // Whether the user is active
}
```

## Advanced Usage

### Tracking User-Specific Views

```tsx
function UserProfile() {
  const { timeSpent, isActive } = usePageView({
    pageId: 'user-profile',
    userId: 'user-123', // Track for specific user
    onPageView: (data) => {
      // Send to your analytics service
      analytics.trackPageView(data);
    },
  });
}
```

### Custom Tracking Intervals

```tsx
function Article() {
  const { timeSpent, isActive } = usePageView({
    pageId: 'article-456',
    minTimeThreshold: 10, // Only track after 10 seconds
    heartbeatInterval: 60, // Send updates every minute
    inactivityThreshold: 120, // Consider user inactive after 2 minutes
    onPageView: (data) => {
      // Handle page view data
    },
  });
}
```

### One-Time Tracking

```tsx
function LandingPage() {
  const { timeSpent, isActive } = usePageView({
    pageId: 'landing-page',
    trackOnce: true, // Only track the initial view
    trackOnceDelay: 5, // Wait 5 seconds before tracking
    onPageView: (data) => {
      // Handle initial page view
    },
  });
}
```

### Custom Time Formatting

```tsx
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function BlogPost() {
  const { timeSpent, isActive } = usePageView({
    pageId: 'blog-post-123',
    onPageView: (data) => {
      // Handle page view data
    },
  });

  return (
    <div>
      <div>
        Time: {formatTime(timeSpent)} {isActive ? '🟢' : '🔴'}
      </div>
    </div>
  );
}
```

## Best Practices

1. **Unique Page IDs**: Always use unique identifiers for each page to ensure accurate tracking.

2. **User Identification**: Include `userId` when tracking authenticated users for better analytics.

3. **Performance**:

   - Use appropriate `heartbeatInterval` values to balance real-time updates with performance
   - Consider using `trackOnce` for pages where continuous tracking isn't needed

4. **Error Handling**: Always implement error handling in your `onPageView` callback:

```tsx
const handlePageView = async (data: PageViewData) => {
  try {
    await analytics.trackPageView(data);
  } catch (error) {
    console.error('Failed to track page view:', error);
    // Implement fallback or retry logic
  }
};
```

## Browser Support

The hook uses the following browser APIs:

- `document.visibilitychange`
- `window.addEventListener` for user activity events

It's compatible with all modern browsers that support these features.

## License

MIT © [Coding Simba](https://codingsimba.com)
