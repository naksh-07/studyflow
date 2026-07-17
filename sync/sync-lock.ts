let isLockHeldInCurrentTab = false;

export async function runExclusive<T>(lockName: string, fn: () => Promise<T>): Promise<T> {
  if (isLockHeldInCurrentTab) {
    return await fn();
  }

  if (typeof navigator !== 'undefined' && navigator.locks) {
    return navigator.locks.request(lockName, async () => {
      isLockHeldInCurrentTab = true;
      try {
        return await fn();
      } finally {
        isLockHeldInCurrentTab = false;
      }
    }) as Promise<T>;
  } else {
    // Fallback for SSR or non-supported browsers
    isLockHeldInCurrentTab = true;
    try {
      return await fn();
    } finally {
      isLockHeldInCurrentTab = false;
    }
  }
}
