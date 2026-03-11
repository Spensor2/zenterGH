import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNetwork } from './NetworkContext';

const PENDING_RIDES_KEY = '@zenter_pending_rides';

const PendingRidesContext = createContext(null);

export const PendingRidesProvider = ({ children }) => {
  const [pendingRides, setPendingRides] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { isOffline, checkNetworkStatus } = useNetwork();

  // Load pending rides from storage
  const loadPendingRides = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(PENDING_RIDES_KEY);
      if (stored) {
        const rides = JSON.parse(stored);
        setPendingRides(rides);
        return rides;
      }
    } catch (error) {
      console.log('Error loading pending rides:', error);
    }
    return [];
  }, []);

  // Save pending rides to storage
  const savePendingRides = useCallback(async (rides) => {
    try {
      await AsyncStorage.setItem(PENDING_RIDES_KEY, JSON.stringify(rides));
      setPendingRides(rides);
    } catch (error) {
      console.log('Error saving pending rides:', error);
    }
  }, []);

  // Add a new pending ride
  const addPendingRide = useCallback(async (ride) => {
    const newRide = {
      ...ride,
      id: `ride_${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'pending',
    };
    
    const updatedRides = [...pendingRides, newRide];
    await savePendingRides(updatedRides);
    
    return newRide;
  }, [pendingRides, savePendingRides]);

  // Remove a pending ride (after processing)
  const removePendingRide = useCallback(async (rideId) => {
    const updatedRides = pendingRides.filter(r => r.id !== rideId);
    await savePendingRides(updatedRides);
  }, [pendingRides, savePendingRides]);

  // Process all pending rides when back online
  const processPendingRides = useCallback(async () => {
    if (isOffline || isProcessing || pendingRides.length === 0) {
      return;
    }

    setIsProcessing(true);
    const results = [];

    for (const ride of pendingRides) {
      try {
        // Simulate API call - replace with actual API
        // In production, this would call your backend
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Process successful
        results.push({ rideId: ride.id, success: true });
        
        // Remove from pending after successful processing
        await removePendingRide(ride.id);
      } catch (error) {
        console.log('Error processing ride:', ride.id, error);
        results.push({ rideId: ride.id, success: false, error });
      }
    }

    setIsProcessing(false);
    return results;
  }, [isOffline, isProcessing, pendingRides, removePendingRide]);

  // Auto-process when back online
  useEffect(() => {
    if (!isOffline && pendingRides.length > 0 && !isProcessing) {
      // Small delay to ensure network is stable
      const timer = setTimeout(() => {
        processPendingRides();
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [isOffline, pendingRides.length, isProcessing, processPendingRides]);

  // Load on mount
  useEffect(() => {
    loadPendingRides();
  }, [loadPendingRides]);

  const value = {
    pendingRides,
    isProcessing,
    addPendingRide,
    removePendingRide,
    processPendingRides,
    loadPendingRides,
    hasPendingRides: pendingRides.length > 0,
    pendingCount: pendingRides.length,
  };

  return (
    <PendingRidesContext.Provider value={value}>
      {children}
    </PendingRidesContext.Provider>
  );
};

export const usePendingRides = () => {
  const context = useContext(PendingRidesContext);
  if (!context) {
    throw new Error('usePendingRides must be used within a PendingRidesProvider');
  }
  return context;
};

export default PendingRidesContext;

