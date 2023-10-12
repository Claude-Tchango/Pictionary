import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert, StyleSheet, Image } from 'react-native';
import { auth } from '../config/firebaseConfig';
import { createUserWithEmailAndPassword } from "firebase/auth";
import logo from '../assets/logo-pictionary.png';
import { Ionicons } from '@expo/vector-icons';

const RegisterScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleRegister = async () => {
        if (password !== confirmPassword) {
            Alert.alert("Erreur", "Les mots de passe ne correspondent pas!");
            return;
        }

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            Alert.alert("Succès", "Inscription réussie! Veuillez vous connecter.");
            navigation.navigate('Connexion');
        } catch (error) {
            Alert.alert("Erreur", error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Image source={logo} style={styles.logo} />
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <View style={styles.passwordContainer}>
                <TextInput
                    style={styles.inputPassword}
                    placeholder="Mot de passe"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                />
                <TouchableOpacity style={styles.iconContainer} onPress={() => setShowPassword(prevState => !prevState)}>
                    <Ionicons name={showPassword ? "eye-off" : "eye"} size={28} color="#1FAB89" />
                </TouchableOpacity>
            </View>
            <View style={styles.passwordContainer}>
                <TextInput
                    style={styles.inputPassword}
                    placeholder="Confirmer le mot de passe"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                />
                <TouchableOpacity style={styles.iconContainer} onPress={() => setShowConfirmPassword(prevState => !prevState)}>
                    <Ionicons name={showConfirmPassword ? "eye-off" : "eye"} size={28} color="#1FAB89" />
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>S'inscrire</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Connexion')}>
                <Text style={styles.linkText}>J'ai déjà un compte</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#FFFACD'
    },
    input: {
        padding: 15,
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 15,
        borderColor: '#d1d1d1',
        backgroundColor: '#ffffff',
        width: '100%'
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 15,
        borderColor: '#d1d1d1',
        backgroundColor: '#ffffff'
    },
    inputPassword: {
        flex: 1,
        padding: 15,
    },
    logo: {
        width: 180,
        height: 180,
        marginBottom: 40,
        alignSelf: 'center'
    },
    button: {
        backgroundColor: '#1FAB89',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    linkText: {
        color: '#1FAB89',
        textAlign: 'center',
        marginTop: 10,
        textDecorationLine: 'underline'
    }
});

export default RegisterScreen;
