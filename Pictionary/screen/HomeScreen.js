import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { auth } from '../config/firebaseConfig';
import { signOut } from "firebase/auth";
import logo from '../assets/logo-pictionary.png';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';

const HomeScreen = ({ navigation }) => {

    const handleSignOut = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Erreur lors de la déconnexion:", error);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Ionicons name="log-out-outline" size={32} color="#008B8B" onPress={handleSignOut} />
            </View>
            <Image source={logo} style={styles.logo} />
            <Text style={styles.title}>Pictionary</Text>
            <Text style={styles.description}>
                Le jeu classique du dessin et de la devinette!
            </Text>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Lobby')}>
                <Text style={styles.buttonText}>Jouer</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Règles')}>
                <Text style={styles.buttonText}>Règles</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Scores')}>
                <Text style={styles.buttonText}>Scores</Text>
            </TouchableOpacity>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFACD',
        padding: 20
    },
    header: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        position: 'absolute',
        top: 50,
        right: 20,
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: 40,
        alignSelf: 'center'
    },
    title: {
        fontSize: 45,
        fontWeight: 'bold',
        marginBottom: 30,
        color: '#333333',
        fontFamily: 'Georgia'
    },
    description: {
        fontSize: 20,
        marginBottom: 30,
        textAlign: 'center',
        paddingHorizontal: 20,
        color: '#555555',
        fontFamily: 'Georgia'
    },
    button: {
        backgroundColor: '#008B8B',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 25,
        width: 200,
        alignItems: 'center',
        marginVertical: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',

    },
});

export default HomeScreen;