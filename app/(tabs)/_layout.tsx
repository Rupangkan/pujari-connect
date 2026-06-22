/**
 * Tab Layout — Custom bottom tab navigator with 4 tabs
 * Ported from MyPandit's HomeActivity tab structure
 */
import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';

interface TabIconProps {
  emoji: string;
  label: string;
  focused: boolean;
}

function TabIcon({ emoji, label, focused }: TabIconProps) {
  return (
    <View style={[styles.tabItem, focused && styles.tabItemFocused]}>
      <Text style={styles.tabEmoji}>{emoji}</Text>
      <Text style={[styles.tabLabel, focused && styles.tabLabelFocused]}>{label}</Text>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.accentYellow,
        tabBarInactiveTintColor: colors.textMuted,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="✨" label="For You" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="pujari"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="🙏" label="Pujari" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="puja"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="🪔" label="Puja" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="samagri"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="📿" label="Samagri" focused={focused} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.surfaceContainerHigh,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
    height: 72,
    paddingBottom: 8,
    paddingTop: 4,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 64,
  },
  tabItemFocused: {
    backgroundColor: 'rgba(255, 237, 41, 0.1)',
  },
  tabEmoji: {
    fontSize: 22,
    marginBottom: 2,
  },
  tabLabel: {
    ...typography.labelSmall,
    color: colors.textMuted,
  },
  tabLabelFocused: {
    color: colors.accentYellow,
    fontWeight: '700',
  },
});
