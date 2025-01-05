import React from 'react';
import { createStackNavigator } from '@react-navigation/stack'; 
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import BookListScreen from '../screens/BookListScreen';
import TabNavigator from './TabNavigator';

const PageNavigator = createStackNavigator(); 

const PageNavigatorScreen = () => {
  return (
    <PageNavigator.Navigator initialRouteName="Splash">
      <PageNavigator.Screen
        name="Splash"
        component={SplashScreen}
        options={{ headerShown: false }}
      />
      <PageNavigator.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <PageNavigator.Screen
        name="Register"
        component={RegisterScreen}
        options={{ headerShown: false }}
      />
      <PageNavigator.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: true }}
      />
      <PageNavigator.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <PageNavigator.Screen
        name="Books"
        component={BookListScreen}
        options={{ headerShown: false }}
      />
      <PageNavigator.Screen
        name="MainTabs"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
    </PageNavigator.Navigator>
  );
};

export default PageNavigatorScreen;
