/**
 * Root Layout — App entry point with providers, fonts, and navigation
 */

import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';
import { colors } from '@/constants/colors';

// Prevent auto-hide of splash screen
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    // Hide splash screen after a short delay
    const timer = setTimeout(() => {
      SplashScreen.hideAsync();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar style="light" backgroundColor={colors.background} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="(auth)" options={{ animation: 'fade' }} />
        <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
        <Stack.Screen name="puja/[id]" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="pujari/[id]" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="puja/all" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="pujari/all" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="booking/cart" options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="booking/address" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="booking/payment" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="profile" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="search" options={{ animation: 'fade' }} />
      </Stack>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
