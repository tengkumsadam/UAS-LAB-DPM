import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import HomeScreen from '../screens/HomeScreen';
import BookListScreen from '../screens/BookListScreen';
import ProfileStackNavigator from '../screens/ProfileStackNavigator';
import { StyleSheet, View } from 'react-native';

const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          let iconSize = size;

         
          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'Books':
              iconName = 'book';
              break;
            case 'Profile':
              iconName = 'person';
              break;
            default:
              iconName = 'help-circle';
          }

          return (
            <View style={styles.iconWrapper}>
              <Icon name={iconName} size={iconSize} color={color} />
            </View>
          );
        },
        tabBarLabelStyle: styles.tabLabel,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#4CAF50', 
        tabBarInactiveTintColor: '#A7A7A7', 
        headerStyle: styles.header,
        headerTitleStyle: styles.headerTitle,
        tabBarShowLabel: false, 
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Books" component={BookListScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Profile" component={ProfileStackNavigator} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#333333', 
    borderTopWidth: 0,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -3 },
    height: 70,
    borderRadius: 20, 
    marginHorizontal: 15,
    marginBottom: 10,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 5,
  },
  header: {
    backgroundColor: 'transparent', 
    borderBottomWidth: 0,
    elevation: 0,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 20,
    letterSpacing: 0.7,
  },
  iconWrapper: {
    padding: 5,
    backgroundColor: '#555555', 
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 4 },
  },
});

export default TabNavigator;
