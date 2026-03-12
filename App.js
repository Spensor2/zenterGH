import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'react-native';

import AppNavigator from './src/navigation/AppNavigator';
import { NetworkProvider } from './src/context/NetworkContext';
import { PendingRidesProvider } from './src/context/PendingRidesContext';
import { RideProvider } from './src/context/RideContext';
import { AuthProvider } from './src/context/AuthContext';
import colors from './src/constants/colors';

export default function App() {
  return (
    <AuthProvider>
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
    </AuthProvider>
  );
}