import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image } from 'react-native';
import logo from '../assets/logo-pictionary.png';
import { getDatabase, ref, onValue, get, set, push } from "firebase/database"; // Ajouté 'push'
import { database } from '../config/firebaseConfig';
import { getAuth, onAuthStateChanged } from "firebase/auth";

const LobyScreen = ({ navigation }) => {  // Typo corrigé : LobyScreen -> LobbyScreen
    const [gameCode, setGameCode] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    const [chosenTeam, setChosenTeam] = useState(null);
    const [score, setScore] = useState({ team1: 0, team2: 0 });
    const [gameData, setGameData] = useState(null);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user || null);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (gameCode) {
            const scoresRef = ref(getDatabase(), `games/${gameCode}/teams`);
            const unsubscribe = onValue(scoresRef, (snapshot) => {  // Corrigé l'erreur ici
                if (snapshot.exists()) {
                    const teamsData = snapshot.val();
                    setScore({
                        team1: teamsData[0].score,
                        team2: teamsData[1].score
                    });
                }
            });

            return () => unsubscribe();
        }
    }, [gameCode]);

    useEffect(() => {
        if (gameData && gameData.currentRound > gameData.totalRounds) {
            alert("Le jeu est terminé !");
            navigation.navigate('EndGameScreen', { score: score });
        }
    }, [gameData, navigation, score]);

    useEffect(() => {
        const gameRef = ref(database, 'games/' + gameCode);
        const unsubscribe = onValue(gameRef, (snapshot) => {
            if (snapshot.exists()) {
                setGameData(snapshot.val());
            }
        });

        return () => unsubscribe();
    }, [gameCode]);

    const updateTeamScore = async (gameCode, teamId, pointsToAdd) => {
        try {
            const teamRef = ref(database, `games/${gameCode}/teams/${teamId}/score`);
            const snapshot = await get(teamRef);

            if (snapshot.exists()) {
                const currentScore = snapshot.val();
                const newScore = currentScore + pointsToAdd;

                await set(teamRef, newScore);
            } else {
                console.error("Team does not exist.");
            }
        } catch (error) {
            console.error("Error updating team score: ", error);
        }
    };

    const createGame = async () => {
        try {
            const gamesRef = ref(database, 'games');
            const newGameRef = push(gamesRef);

            const gameCode = newGameRef.key;

            const initialState = {
                gameCode: gameCode,
                state: "pending",
                host: currentUser.email,
                currentRound: 1,
                totalRounds: 5,
                teams: [
                    { id: "team1", players: [currentUser.email], score: 0 },
                    { id: "team2", players: [], score: 0 }
                ]
            };

            await set(newGameRef, initialState);
            navigation.navigate('Teams', { gameCode: gameCode, userId: currentUser.uid, userEmail: currentUser.email });
        } catch (error) {
            alert("Une erreur est survenue lors de la création de la partie. Veuillez réessayer.");
            console.error("Error creating game:", error);
        }
    };

    const joinGame = async () => {
        if (!gameCode) {
            alert("Veuillez fournir un code de partie.");
            return;
        }

        try {
            const gameRef = ref(database, 'games/' + gameCode);
            const snapshot = await get(gameRef);

            if (!snapshot.exists()) {
                alert("La partie avec le code donné n'existe pas. Veuillez vérifier et réessayer.");
                return;
            }

            const gameData = snapshot.val();

            if (!gameData.teams) {
                alert("Erreur lors de la récupération des données de la partie.");
                return;
            }

            navigation.navigate('Teams', { gameCode, userId: currentUser.uid, userEmail: currentUser.email });

        } catch (error) {
            alert("Une erreur est survenue lors de la tentative de rejoindre la partie. Veuillez réessayer.");
            console.error("Error joining game:", error);
        }
    };


    return (
        <View style={styles.container}>
            <Image source={logo} style={styles.logo} />
            <Text style={styles.title}>Lobby</Text>

            <TouchableOpacity style={styles.button} onPress={createGame} activeOpacity={0.8}>
                <Text style={styles.buttonText}>Créer une nouvelle partie</Text>
            </TouchableOpacity>

            <Text style={styles.orText}>OU</Text>

            <TextInput
                style={styles.input}
                placeholder="Entrez le code de la partie"
                value={gameCode}
                onChangeText={setGameCode}
            />
            <TouchableOpacity
                style={styles.button}
                onPress={joinGame}
                activeOpacity={0.8}
            >
                <Text style={styles.buttonText}>Rejoindre une partie</Text>
            </TouchableOpacity>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFACD',
        padding: 20,
    },
    title: {
        fontSize: 40,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#2E294E',
        fontFamily: 'Georgia',
    },
    logo: {
        width: 130,
        height: 130,
        marginBottom: 30,
        alignSelf: 'center'
    },
    button: {
        backgroundColor: '#1FAB89',
        paddingVertical: 14,
        paddingHorizontal: 28,
        borderRadius: 30,
        width: 260,
        alignItems: 'center',
        marginVertical: 12,
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
    orText: {
        fontSize: 18,
        color: '#555555',
        marginVertical: 20,
    },
    input: {
        borderWidth: 2,
        borderColor: '#1FAB89',
        padding: 12,
        width: '85%',
        borderRadius: 12,
        marginBottom: 15,
        fontSize: 16,
        backgroundColor: '#FFF',
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 2.5,
    },
    teamChoiceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    teamButton: {
        backgroundColor: '#D3D3D3',
        paddingVertical: 14,
        paddingHorizontal: 28,
        borderRadius: 30,
        width: 120,
        alignItems: 'center',
        marginVertical: 12,
    },
});

export default LobyScreen;