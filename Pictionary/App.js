import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { auth } from './config/firebaseConfig';

import RegisterScreen from './screen/RegisterScreen';
import LoginScreen from './screen/LoginScreen';
import HomeScreen from './screen/HomeScreen';
import RulesScreen from './screen/RulesScreen';
import ScoresScreen from './screen/ScoresScreen';
import LobyScreen from './screen/LobyScreen';
import GameScreen from './screen/GameScreen';
import TeamsScreen from './screen/TeamsScreen';
import GameArea from './screen/GameArea';
import WordSelectionScreen from "./screen/WordSelectionScreen";

const Stack = createStackNavigator();

const AuthStack = createStackNavigator();

const AuthNavigator = () => (
    <AuthStack.Navigator initialRouteName="Connexion">
        <AuthStack.Screen name="Inscription" component={RegisterScreen} />
        <AuthStack.Screen name="Connexion" component={LoginScreen} />
    </AuthStack.Navigator>
);

const AppStack = createStackNavigator();

const AppNavigator = () => (
    <AppStack.Navigator initialRouteName="Menu">
        <AppStack.Screen name="Menu" component={HomeScreen} />
        <AppStack.Screen name="Règles" component={RulesScreen} />
        <Stack.Screen name="Scores" component={ScoresScreen} />
        <Stack.Screen name="Lobby" component={LobyScreen} />
        <Stack.Screen name="Teams" component={TeamsScreen} />
        <Stack.Screen name="Game" component={GameScreen} />
        <Stack.Screen name="GameArea" component={GameArea} />
        <Stack.Screen name="WordSelection" component={WordSelectionScreen} />
    </AppStack.Navigator>
);

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [initializing, setInitializing] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
            }
            if (initializing) setInitializing(false);
        });

        return () => unsubscribe();
    }, [initializing]);

    if (initializing) return null;

    return (
        <NavigationContainer>
            {isAuthenticated ? <AppNavigator /> : <AuthNavigator />}
        </NavigationContainer>
    );
};

export default App;