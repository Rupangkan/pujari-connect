/**
 * Async UI states — Loading spinner, Error with retry, and Empty placeholder.
 * Light Ivory & Gold theme.
 */
import React from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { colors } from '@/constants/colors';
import { typography, spacing, borderRadius } from '@/constants/typography';
import { Icon, type IconName } from '@/components/ui/Icon';

export function LoadingView({ style }: { style?: object }) {
  return (
    <View style={[styles.center, style]}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}

export function ErrorView({ message, onRetry, style }: { message?: string; onRetry?: () => void; style?: object }) {
  return (
    <View style={[styles.center, style]}>
      <View style={styles.iconWrap}><Icon name="cloud-offline-outline" size={40} color={colors.textMuted} /></View>
      <Text style={styles.title}>Couldn't load</Text>
      <Text style={styles.subtitle}>{message || 'Something went wrong.'}</Text>
      {onRetry && (
        <Pressable onPress={onRetry} style={({ pressed }) => [styles.retryBtn, pressed && { opacity: 0.85 }]}>
          <Icon name="refresh" size={16} color={colors.textOnPrimary} />
          <Text style={styles.retryText}>Retry</Text>
        </Pressable>
      )}
    </View>
  );
}

export function EmptyView({ icon = 'file-tray-outline', title, subtitle, actionLabel, onAction, style }: { icon?: IconName; title: string; subtitle?: string; actionLabel?: string; onAction?: () => void; style?: object }) {
  return (
    <View style={[styles.center, style]}>
      <View style={styles.iconWrap}><Icon name={icon} size={40} color={colors.primary} /></View>
      <Text style={styles.title}>{title}</Text>
      {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      {!!actionLabel && onAction && (
        <Pressable onPress={onAction} style={({ pressed }) => [styles.retryBtn, pressed && { opacity: 0.85 }]}>
          <Text style={styles.retryText}>{actionLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xxl, minHeight: 240 },
  iconWrap: { width: 84, height: 84, borderRadius: 42, backgroundColor: 'rgba(242,112,10,0.08)', alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg },
  title: { ...typography.headlineSmall, color: colors.textPrimary, marginBottom: spacing.sm, textAlign: 'center' },
  subtitle: { ...typography.bodyMedium, color: colors.textMuted, textAlign: 'center', marginBottom: spacing.lg },
  retryBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.primary, paddingHorizontal: spacing.xl, paddingVertical: spacing.md, borderRadius: borderRadius.full },
  retryText: { ...typography.button, color: colors.textOnPrimary },
});
