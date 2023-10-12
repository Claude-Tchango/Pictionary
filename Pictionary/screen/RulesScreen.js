import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as Animatable from 'react-native-animatable';

const Rule = ({ icon, children }) => (
    <Animatable.View animation="fadeInUp" duration={800} style={styles.ruleContainer}>
        <Icon name={icon} size={24} color="#333" style={styles.icon} />
        <Text style={styles.rule}>{children}</Text>
    </Animatable.View>
);

const RulesScreen = () => {
    return (
        <LinearGradient colors={['#BDB76B', '#008080']} style={styles.container}>
            <ScrollView contentContainerStyle={styles.contentContainer}>
                <Text style={styles.title}>Règles du Pictionary</Text>
                <Rule icon="people">1. Divisez-vous en deux équipes. Chaque équipe prend son tour pour dessiner un mot tandis que l'autre équipe essaie de le deviner.</Rule>
                <Rule icon="gesture">2. Aucune lettre ou symbole ne peut être utilisé pendant le dessin. Seuls les dessins sont autorisés.</Rule>
                <Rule icon="check-circle">3. Si l'équipe devine correctement, elle marque un point.</Rule>
                <Rule icon="timer">4. Chaque mot doit être dessiné en un temps limité.</Rule>
                <Rule icon="mic-off">5. Aucune parole n'est autorisée de la part du dessinateur.</Rule>

            </ScrollView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        padding: 20,
        alignItems: 'center'
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: 'white'
    },
    ruleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
        paddingHorizontal: 8,
        paddingVertical: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 8,
    },
    icon: {
        marginRight: 12,
    },
    rule: {
        fontSize: 18,
        color: '#333',
        flex: 1,
    }
});

export default RulesScreen;
