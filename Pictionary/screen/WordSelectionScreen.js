import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';

const WORDS = ["chat", "chien", "maison", "arbre", "voiture", "ordinateur", "téléphone", "montagne", "océan", "soleil", "banane", "orange", "étoile", "escargot"];

const WordSelectionScreen = ({ navigation }) => {
    const handleWordSelect = (word) => {
        navigation.replace('Game', { selectedWord: word });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.selectedWordText}> Sélectionnez un mot à dessiner</Text>
            <FlatList
                style={styles.list}
                data={WORDS}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.wordButton} onPress={() => handleWordSelect(item)}>
                        <Text style={styles.wordText}>{item}</Text>
                    </TouchableOpacity>
                )}
                showsVerticalScrollIndicator={true}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F0F0',
    },
    list: {
        flex: 1,
        backgroundColor: 'white',
        padding: 20,
    },
    wordButton: {
        backgroundColor: '#20B2AA',
        padding: 20,
        marginVertical: 10,
        marginHorizontal: 20,
        borderRadius: 10,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        alignItems: 'center',
    },
    wordText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    selectedWordText: {
        fontSize: 22,
        fontWeight: '600',
        color: '#20B2AA',
        marginVertical: 25,
        textAlign: 'center',
        letterSpacing: 1.2,
        paddingHorizontal: 10,
        borderBottomWidth: 2,
        borderBottomColor: '#20B2AA',
    },

});

export default WordSelectionScreen;
