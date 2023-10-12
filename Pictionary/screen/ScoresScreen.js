import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';

const ScoresScreen = () => {
    // Exemple de scores
    const [scores, setScores] = useState([
        { date: "2023-09-21", score: 95 },
        { date: "2023-09-20", score: 80 },
        { date: "2023-09-19", score: 70 }
    ]);

    return (
        <LinearGradient colors={['#BDB76B', '#008080']} style={styles.container}>
            <Text style={styles.title}>Meilleurs scores</Text>
            <FlatList
                data={scores}
                renderItem={({ item }) => (
                    <View style={styles.scoreCard}>
                        <FontAwesome name="trophy" size={24} color="#FFD700" />
                        <Text style={styles.scoreDate}>{item.date}</Text>
                        <Text style={styles.scoreValue}>{item.score}</Text>
                    </View>
                )}
                keyExtractor={item => item.date}
            />
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20
    },
    title: {
        fontSize: 34,
        fontWeight: 'bold',
        marginBottom: 30,
        color: 'white',
        alignSelf: 'center',
        fontFamily: 'Georgia'
    },
    scoreCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        marginBottom: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
    },
    scoreDate: {
        fontSize: 18,
        color: 'white',
        marginLeft: 10
    },
    scoreValue: {
        fontSize: 20,
        fontWeight: '600',
        color: 'white'
    }
});

export default ScoresScreen;
