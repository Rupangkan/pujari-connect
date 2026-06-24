/**
 * Screen — standard page wrapper.
 * - Paints the soft golden-ivory background gradient.
 * - Respects the top safe area (notch / Dynamic Island / status bar) so headers
 *   are never hidden behind system chrome.
 *
 * Usage: wrap a screen's content; the first child is typically the header.
 * The bottom safe area is handled by the tab navigator.
 */

import React from 'react';
import { View, StyleSheet, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';

interface ScreenProps {
  children: React.ReactNode;
  /** Apply horizontal padding to the content container. Default false. */
  padded?: boolean;
  /** Extra style for the inner content container. */
  style?: ViewStyle;
}

export function Screen({ children, padded = false, style }: ScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient colors={colors.gradientScreen} style={styles.fill}>
      <View style={[styles.content, { paddingTop: insets.top }, padded && styles.padded, style]}>
        {children}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  content: { flex: 1 },
  padded: { paddingHorizontal: 16 },
});
