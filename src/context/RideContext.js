import React, { createContext, useContext, useState, useCallback } from 'react';

const RideContext = createContext(null);

export const RideProvider = ({ children }) => {
  const [rideState, setRideState] = useState({
    status: 'idle', // idle, searching, driver_found, tracking, completed, cancelled
    pickup: null,
    dropoff: null,
    rideType: null,
    driver: null,
    estimatedPrice: 0,
    estimatedTime: 0,
    distance: 0,
    driverLocation: null,
    tripStartTime: null,
    tripEndTime: null,
  });

  const startRideSearch = useCallback((pickup, dropoff, rideType) => {
    const prices = {
      '1': { base: 15, perKm: 2.5 },
      '2': { base: 25, perKm: 3.5 },
      '3': { base: 45, perKm: 5 },
      '4': { base: 35, perKm: 3 },
    };
    
    const priceData = prices[rideType.id] || prices['1'];
    const distance = Math.random() * 10 + 2; // 2-12 km
    const estimatedPrice = Math.round(priceData.base + (distance * priceData.perKm));
    const estimatedTime = Math.round(distance * 2 + 3); // 2 min per km + 3 min

    setRideState({
      status: 'searching',
      pickup,
      dropoff,
      rideType,
      driver: null,
      estimatedPrice,
      estimatedTime,
      distance: Math.round(distance * 10) / 10,
      driverLocation: null,
      tripStartTime: null,
      tripEndTime: null,
    });
  }, []);

  const setDriverFound = useCallback((driver) => {
    setRideState(prev => ({
      ...prev,
      status: 'driver_found',
      driver,
    }));
  }, []);

  const startTracking = useCallback(() => {
    setRideState(prev => ({
      ...prev,
      status: 'tracking',
      tripStartTime: new Date().toISOString(),
    }));
  }, []);

  const updateDriverLocation = useCallback((location) => {
    setRideState(prev => ({
      ...prev,
      driverLocation: location,
    }));
  }, []);

  const completeRide = useCallback(() => {
    setRideState(prev => ({
      ...prev,
      status: 'completed',
      tripEndTime: new Date().toISOString(),
    }));
  }, []);

  const cancelRide = useCallback(() => {
    setRideState({
      status: 'idle',
      pickup: null,
      dropoff: null,
      rideType: null,
      driver: null,
      estimatedPrice: 0,
      estimatedTime: 0,
      distance: 0,
      driverLocation: null,
      tripStartTime: null,
      tripEndTime: null,
    });
  }, []);

  const resetRide = useCallback(() => {
    setRideState({
      status: 'idle',
      pickup: null,
      dropoff: null,
      rideType: null,
      driver: null,
      estimatedPrice: 0,
      estimatedTime: 0,
      distance: 0,
      driverLocation: null,
      tripStartTime: null,
      tripEndTime: null,
    });
  }, []);

  const value = {
    rideState,
    startRideSearch,
    setDriverFound,
    startTracking,
    updateDriverLocation,
    completeRide,
    cancelRide,
    resetRide,
  };

  return (
    <RideContext.Provider value={value}>
      {children}
    </RideContext.Provider>
  );
};

export const useRide = () => {
  const context = useContext(RideContext);
  if (!context) {
    throw new Error('useRide must be used within a RideProvider');
  }
  return context;
};

export default RideContext;

