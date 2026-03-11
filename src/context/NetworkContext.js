import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { AppState } from 'react-native';

const NetworkContext = createContext(null);

export const NetworkProvider = ({ children }) => {
  const [isOffline, setIsOffline] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const checkNetworkStatus = useCallback(async () => {
    try {
      const state = await NetInfo.fetch();
      const offline = !state.isConnected || !state.isInternetReachable;
      setIsOffline(offline);
      setIsReady(true);
      return !offline;
    } catch (error) {
      console.log('Network check error:', error);
      setIsReady(true);
      return true;
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      checkNetworkStatus();
    }, 500);

    const unsubscribe = NetInfo.addEventListener(state => {
      const offline = !state.isConnected || !state.isInternetReachable;
      setIsOffline(offline);
    });

    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === 'active') {
        checkNetworkStatus();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      clearTimeout(timer);
      unsubscribe();
      subscription?.remove();
    };
  }, [checkNetworkStatus]);

  const value = {
    isOffline,
    isInternetReachable: !isOffline,
    checkNetworkStatus,
    isReady,
  };

  return (
    <NetworkContext.Provider value={value}>
      {children}
    </NetworkContext.Provider>
  );
};

export const useNetwork = () => {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error('useNetwork must be used within a NetworkProvider');
  }
  return context;
};

export default NetworkContext;
