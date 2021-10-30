import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import {Image} from 'react-native';

import Feed from './pages/Feed';

import logo from './assets/instagram.png';

const Stack = createNativeStackNavigator();

const Routes = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#f5f5f5',
          },
        }}>
        <Stack.Screen
          name="Feed"
          component={Feed}
          options={{headerTitle: () => <Image source={logo} />}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Routes;
