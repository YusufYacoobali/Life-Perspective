import { Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../src/theme';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

function TabIcon({ name, focused, color }: { name: IoniconsName; focused: boolean; color: string; size: number }) {
  return (
    <Ionicons
      name={focused ? name : (`${name}-outline` as IoniconsName)}
      size={22}
      color={color}
    />
  );
}

export default function TabsLayout() {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.tabBarActive,
        tabBarInactiveTintColor: colors.tabBarInactive,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
          letterSpacing: 0.5,
        },
        tabBarStyle: {
          backgroundColor: Platform.OS === 'ios' ? 'transparent' : colors.tabBar,
          borderTopColor: colors.tabBarBorder,
          borderTopWidth: 0.5,
          elevation: 0,
          height: 49 + insets.bottom,
          paddingBottom: insets.bottom,
        },
        tabBarBackground: Platform.OS === 'ios'
          ? () => (
              <BlurView
                intensity={isDark ? 50 : 70}
                tint={isDark ? 'dark' : 'light'}
                style={{
                  flex: 1,
                  backgroundColor: isDark ? 'rgba(7,7,9,0.85)' : 'rgba(245,242,238,0.85)',
                }}
              />
            )
          : undefined,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Today',
          tabBarIcon: (props) => <TabIcon name="hourglass" {...props} />,
        }}
      />
      <Tabs.Screen
        name="breakdown"
        options={{
          title: 'Life',
          tabBarIcon: (props) => <TabIcon name="bar-chart" {...props} />,
        }}
      />
      <Tabs.Screen
        name="quotes"
        options={{
          title: 'Quotes',
          tabBarIcon: (props) => <TabIcon name="chatbubble-ellipses" {...props} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: (props) => <TabIcon name="settings" {...props} />,
        }}
      />
    </Tabs>
  );
}
