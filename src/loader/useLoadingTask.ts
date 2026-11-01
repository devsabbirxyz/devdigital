import { useEffect } from 'react';

/**
 * useLoadingTask — ties a named async task into the global loading manager.
 *
 * Usage:
 *   useLoadingTask('site-settings', settingsQuery.isFetching);
 *
 * Pass `isPending = true` while the task is in flight;
 * the hook marks it done when isPending flips to false.
 */
export function useLoadingTask(name: string, isPending: boolean) {
  useEffect(() => {
    const mgr = window.__loading;
    if (!mgr) return;
    mgr.register(name);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // register once on mount

  useEffect(() => {
    if (!isPending) {
      window.__loading?.done(name);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPending]);
}

/**
 * useMarkAppMounted — call once at the React app root to signal
 * the loader that the JS bundle has executed and app has mounted.
 */
export function useMarkAppMounted() {
  useEffect(() => {
    window.__loading?.markAppMounted();
  }, []);
}

