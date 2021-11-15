import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

//Screens
import LoginScreen from './LoginScreen'
import ForgotPassword from './ForgotPassword'

/** Auth Stack of the app */
export default AuthStack = () => (
    <Stack.Navigator headerMode="none" initialRouteName='LoginScreen'>
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
    </Stack.Navigator>
);