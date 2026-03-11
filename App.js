import React, { useState, useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar, View, StyleSheet } from 'react-native';

import AppNavigator from './src/navigation/AppNavigator';
import { NetworkProvider } from './src/context/NetworkContext';
import { PendingRidesProvider } from './src/context/PendingRidesContext';
import { RideProvider } from './src/context/RideContext';
import colors from './src/constants/colors';

export default function App() {
  return (
    <NetworkProvider>
      <PendingRidesProvider>
        <RideProvider>
          <NavigationContainer>
            <StatusBar barStyle="light-content" backgroundColor={colors.secondary} />
            <AppNavigator />
          </NavigationContainer>
        </RideProvider>
      </PendingRidesProvider>
    </NetworkProvider>
  );
}

import { AuthProvider } from "./context/AuthContext";
import { RideProvider } from "./context/RideContext";

export default function App() {
  return (
    <AuthProvider>
      <RideProvider>
        {/* Your navigator goes here */}
        <Navigation />
      </RideProvider>
    </AuthProvider>
  );
}