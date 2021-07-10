import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './pages/Home';


const stack = createStackNavigator();

export default function Routes() {

    const screenOptionsStyle = {
        headerStyle: {
            backgroundColor: '#f0f0f0'
        },
        headerTinColor: '#0077ff',
        headerBackTitle: 'Voltar'
    }

    return (
        <NavigationContainer>
            <stack.Navigator
                screenOptions={
                    {
                        headerStyle: { backgroundColor: 'papayawhip' },
                        headerTintColor: '#0077ff',
                        headerBackTitle: 'Voltar'
                    }}>
                <stack.Screen name='Home' component={Home} />
            </stack.Navigator>
        </NavigationContainer>
    );
}