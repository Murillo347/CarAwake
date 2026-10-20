import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from './src/home';
import Config from './src/config';
import Viagem from './src/viagem';
import Relatorio from './src/relatorio';

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="Config" component={Config} />
                <Stack.Screen name="Viagem" component={Viagem} />
                <Stack.Screen name="Relatorio" component={Relatorio} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}