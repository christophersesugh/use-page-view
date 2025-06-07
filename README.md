# use-page-view

A React hook for tracking page views and user engagement time. This hook provides real-time tracking of how long users spend on a page, their activity status, and the ability to persist time tracking across page reloads.

[![npm version](https://img.shields.io/npm/v/use-page-view.svg)](https://www.npmjs.com/package/use-page-view)
[![npm downloads](https://img.shields.io/npm/dm/use-page-view.svg)](https://www.npmjs.com/package/use-page-view)
[![License](https://img.shields.io/npm/l/use-page-view.svg)](https://github.com/christophersesugh/use-page-view/blob/main/LICENSE)
[![CI Status](https://img.shields.io/github/actions/workflow/status/christophersesugh/use-page-view/ci.yml)](https://github.com/christophersesugh/use-page-view/actions)
[![Coverage](https://img.shields.io/codecov/c/github/christophersesugh/use-page-view)](https://codecov.io/gh/christophersesugh/use-page-view)

## Features

- 📊 Track time spent on pages
- 👀 Monitor user activity and page visibility
- 🔄 Periodic updates through callback
- 💾 Optional localStorage persistence
- ⏱️ Configurable thresholds and intervals
- 🎯 Support for one-time tracking
- 🔑 User identification support

## Installation

```bash
npm install use-page-view
# or
yarn add use-page-view
# or
pnpm add use-page-view
```

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
    persistTimeSpent: true, // Enable localStorage persistence
    onPageView: async (data) => {
      await fetch('/api/track-page-view', {
        method: 'POST',
        body: JSON.stringify(data),
      });
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
| `persistTimeSpent`    | `boolean`                      | `false`  | Whether to persist the timeSpent value in localStorage                 |

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

### Basic Usage with Persistence

```tsx
function Article() {
  const { timeSpent, isActive } = usePageView({
    pageId: 'article-789',
    persistTimeSpent: true, // Enable localStorage persistence
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

### One-time Tracking with Persistence

```tsx
function LandingPage() {
  const { timeSpent, isActive } = usePageView({
    pageId: 'landing-page',
    trackOnce: true,
    trackOnceDelay: 30, // Track after 30 seconds
    persistTimeSpent: true, // Persist time across page reloads
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

## Features in Detail

### Time Tracking

- Tracks total time spent on the page
- Updates every second
- Can persist time across page reloads with `persistTimeSpent`

### Activity Monitoring

- Detects user activity through mouse, keyboard, and touch events
- Monitors page visibility changes
- Updates active status based on user engagement

### Persistence

- Optional localStorage persistence with `persistTimeSpent`
- Maintains time tracking across page reloads
- Uses unique keys per page to prevent conflicts
- Handles invalid stored values gracefully

### Callback System

- Periodic updates through `onPageView` callback
- Configurable update interval with `heartbeatInterval`
- Minimum time threshold with `minTimeThreshold`
- One-time tracking option with `trackOnce`

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
