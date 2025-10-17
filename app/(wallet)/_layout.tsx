import {Tabs} from 'expo-router';
import React from 'react';

import {HapticTab} from '@/components/haptic-tab';
import {IconSymbol} from '@/components/ui/icon-symbol';
import {Colors} from '@/constants/theme';
import {useColorScheme} from '@/hooks/use-color-scheme';

export default function WalletLayout() {
    const colorScheme = useColorScheme();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
                headerShown: false,
                tabBarButton: HapticTab,
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Accounts',

                    tabBarIcon: ({color}) => <IconSymbol size={28} name="wallet.bifold.fill" color={color}/>,
                }}
            />
            <Tabs.Screen
                name="keys"
                options={{
                    title: 'Keys',
                    tabBarIcon: ({color}) => <IconSymbol size={28} name="key" color={color}/>,
                }}
            />
        </Tabs>
    );
}
