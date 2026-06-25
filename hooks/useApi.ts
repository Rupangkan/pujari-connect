/**
 * useApi — minimal data-fetching hook with loading / error / reload.
 * `fetcher` should resolve to the final unwrapped value.
 */
import { useState, useEffect, useCallback, useRef } from 'react';

interface UseApiResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  reload: () => void;
}

function messageFromError(e: any): string {
  return (
    e?.response?.data?.message ||
    e?.response?.data?.error ||
    (e?.message === 'Network Error' ? 'Cannot reach the server. Is the backend running?' : e?.message) ||
    'Something went wrong.'
  );
}

export function useApi<T>(fetcher: () => Promise<T>, deps: unknown[] = []): UseApiResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mounted = useRef(true);

  // Keep the latest fetcher without forcing it into the dep array.
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const run = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetcherRef.current();
      if (mounted.current) setData(result);
    } catch (e) {
      if (mounted.current) setError(messageFromError(e));
    } finally {
      if (mounted.current) setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    mounted.current = true;
    run();
    return () => { mounted.current = false; };
  }, [run]);

  return { data, loading, error, reload: run };
}
