/**
 * Tab Layout — bottom tab navigator (4 top-level tabs).
 * Uses Ionicons + labels for a clean, native-feeling, non-truncated bar.
 */
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

function tabIcon(active: IoniconName, inactive: IoniconName) {
  return ({ focused, color, size }: { focused: boolean; color: string; size: number }) => (
    <Ionicons name={focused ? active : inactive} size={size ?? 24} color={color} />
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopWidth: 1,
          borderTopColor: colors.hairlineGold,
          height: Platform.OS === 'ios' ? 88 : 68,
          paddingTop: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
          elevation: 8,
        },
        tabBarLabelStyle: {
          ...typography.labelSmall,
          fontWeight: '600',
          marginTop: 2,
        },
        tabBarItemStyle: { paddingVertical: 4 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'For You', tabBarIcon: tabIcon('sparkles', 'sparkles-outline') }}
      />
      <Tabs.Screen
        name="pujari"
        options={{ title: 'Pujari', tabBarIcon: tabIcon('person', 'person-outline') }}
      />
      <Tabs.Screen
        name="puja"
        options={{ title: 'Puja', tabBarIcon: tabIcon('flame', 'flame-outline') }}
      />
      <Tabs.Screen
        name="samagri"
        options={{ title: 'Samagri', tabBarIcon: tabIcon('basket', 'basket-outline') }}
      />
    </Tabs>
  );
}
