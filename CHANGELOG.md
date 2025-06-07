# use-page-view

## 2.0.0

### Major Changes

- da6e834: Initial and stable release for production use

### Minor Changes

- 5079e91: Added localStorage persistence for timeSpent tracking
- Added localStorage persistence for timeSpent tracking

  This release adds a new `persistTimeSpent` option to the `usePageView` hook, allowing the time spent on a page to be persisted across page reloads using localStorage.

  ### New Features

  - Added `persistTimeSpent` option (default: false) to persist timeSpent in localStorage
  - Time spent is now maintained across page refreshes when persistence is enabled
  - Each page uses a unique localStorage key based on its pageId
  - Graceful handling of invalid localStorage values

  ### Example Usage

  ```tsx
  const { timeSpent, isActive } = usePageView({
    pageId: 'blog-post-123',
    persistTimeSpent: true, // Enable localStorage persistence
    onPageView: (data) => {
      console.log('Page view:', data);
    },
  });
  ```

  ### Breaking Changes

  None. This is a non-breaking feature addition.

  ### Migration

  No migration required. The feature is opt-in and defaults to false.

## 1.0.0

### Major Changes

- d5a69fb: Initial and stable release for production use
