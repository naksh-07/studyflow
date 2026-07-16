import * as React from 'react';
import { connectivityService } from '@/services/connectivity.service';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = React.useState(true);

  React.useEffect(() => {
    setIsOnline(connectivityService.isOnline());

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    const unsubscribeOnline = connectivityService.onOnline(handleOnline);
    const unsubscribeOffline = connectivityService.onOffline(handleOffline);

    return () => {
      unsubscribeOnline();
      unsubscribeOffline();
    };
  }, []);

  return isOnline;
}

