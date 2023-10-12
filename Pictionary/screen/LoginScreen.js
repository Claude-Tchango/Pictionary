import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert, StyleSheet, Image } from 'react-native';
import { auth } from '../config/firebaseConfig';
import { signInWithEmailAndPassword } from "firebase/auth";
import logo from '../assets/logo-pictionary.png';
import { Ionicons } from '@expo/vector-icons';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async () => {
        console.log("Tentative de connexion...");

        try {
            await signInWithEmailAndPassword(auth, email, password);
            console.log("Connecté avec succès!");
        } catch (error) {
            console.log("Erreur de connexion:", error);
            Alert.alert("Erreur", error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Image source={logo} style={styles.logo} />
            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#666"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <View style={styles.passwordContainer}>
                <TextInput
                    style={styles.inputPassword}
                    placeholder="Mot de passe"
                    placeholderTextColor="#666"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                />
                <TouchableOpacity style={styles.iconContainer} onPress={() => setShowPassword(prevState => !prevState)}>
                    <Ionicons name={showPassword ? "eye-off" : "eye"} size={28} color="#1FAB89" />
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Se connecter</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Inscription')}>
                <Text style={styles.registerText}>Pas de compte? S'inscrire</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: '#FFFACD',
    },
    input: {
        padding: 15,
        marginBottom: 20,
        borderWidth: 1,
        borderRadius: 8,
        fontSize: 16,
        borderColor: '#E5E5E5',
        backgroundColor: '#F7F7F7',
    },
    logo: {
        width: 180,
        height: 180,
        marginBottom: 40,
        alignSelf: 'center'
    },
    button: {
        paddingVertical: 15,
        borderRadius: 8,
        backgroundColor: '#1FAB89',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    registerText: {
        textAlign: 'center',
        marginTop: 15,
        color: '#555',
        fontSize: 16,
    },
    passwordContainer: {
        flexDirection: 'row',
        borderWidth: 1,
        borderRadius: 8,
        borderColor: '#E5E5E5',
        backgroundColor: '#F7F7F7',
        marginBottom: 20,
    },
    inputPassword: {
        flex: 1,
        padding: 15,
        fontSize: 16,
        color: '#333',
        backgroundColor: 'transparent',
        borderColor: 'transparent',
    },
    iconContainer: {
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderLeftWidth: 0.5,
        borderColor: '#E5E5E5',
    },
});

export default LoginScreen;
