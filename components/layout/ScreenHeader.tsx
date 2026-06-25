/**
 * ScreenHeader — back button + title row for secondary screens.
 */
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import { colors } from '@/constants/colors';
import { typography, spacing } from '@/constants/typography';
import { Icon } from '@/components/ui/Icon';

export function ScreenHeader({ title }: { title: string }) {
  return (
    <View style={styles.header}>
      <Pressable onPress={() => router.back()} style={styles.iconBtn} hitSlop={8}>
        <Icon name="arrow-back" size={22} color={colors.textPrimary} />
      </Pressable>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingHorizontal: spacing.lg, paddingBottom: spacing.md, paddingTop: spacing.sm },
  iconBtn: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
  title: { ...typography.headlineMedium, color: colors.textPrimary },
});
