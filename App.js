import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from './src/home';
import Home2 from './src/home2';
import Config from './src/config';
import Config2 from './src/config2';
import Viagem from './src/viagem';
import Viagem2 from './src/viagem2';
import Relatorio from './src/relatorio';
import Relatorio2 from './src/relatorio2';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="Home"
          component={Home}
        />

        <Stack.Screen
          name="Home2"
          component={Home2}
        />

        <Stack.Screen
          name="Config"
          component={Config}
        />

        <Stack.Screen
          name="Config2"
          component={Config2}
        />

        <Stack.Screen
          name="Viagem"
          component={Viagem}
        />

        <Stack.Screen
          name="Viagem2"
          component={Viagem2}
        />

        <Stack.Screen
          name="Relatorio"
          component={Relatorio}
        />

        <Stack.Screen
          name="Relatorio2"
          component={Relatorio2}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}