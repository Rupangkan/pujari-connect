/**
 * Icon — thin wrapper over Ionicons so icon usage stays token-driven and
 * consistent (single import, default color from theme). Replaces emoji icons.
 */

import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import type { StyleProp, TextStyle } from 'react-native';
import { colors } from '@/constants/colors';

export type IconName = React.ComponentProps<typeof Ionicons>['name'];

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
}

export function Icon({ name, size = 22, color = colors.textPrimary, style }: IconProps) {
  return <Ionicons name={name} size={size} color={color} style={style} />;
}
