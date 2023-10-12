import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Modal, TouchableOpacity, Button } from 'react-native';
import { ref, get, set } from "firebase/database";
import { getDatabase } from 'firebase/database';
import * as Sharing from 'expo-sharing';
import * as Clipboard from "expo-clipboard";

const database = getDatabase();
const TeamsScreen = ({ route, navigation }) => {
    const { gameCode, userEmail } = route.params;
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [isGameButtonDisabled, setGameButtonDisabled] = useState(true);

    const [teams, setTeams] = useState([
        { id: "team1", players: [] },
        { id: "team2", players: [] }
    ]);
    const [isModalVisible, setModalVisible] = useState(true);

    useEffect(() => {
        const teamsRef = ref(database, `games/${gameCode}/teams`);
        get(teamsRef).then(snapshot => {
            const snapValue = snapshot.val();
            if (snapValue) {
                const teamsData = Object.values(snapValue).map(team => {
                    return { ...team, players: team.players || [] };
                });
                setTeams(teamsData);
            } else {
                console.error('Erreur: snapshot.val() est undefined');
            }
        }).catch(error => {
            console.error('Erreur de récupération des équipes:', error);
        });
    }, [gameCode]);

    const shareGameCode = () => {
        const textToCopy = ` ${gameCode}`;
        Clipboard.setString(textToCopy);
        alert("Code copié dans le presse-papiers !");
    };

    const handleJoinTeam = async (teamId) => {
        console.log("Tentative de rejoindre l'équipe:", teamId);

        // Vérifier si l'utilisateur est déjà dans une équipe
        const alreadyInTeam = teams.some(team => team.players.includes(userEmail));

        if (alreadyInTeam) {
            alert("Vous avez déjà rejoint une équipe pour cette partie.");
            return;
        }

        const teamRef = ref(database, `games/${gameCode}/teams/${teamId}/players`);
        const teamData = (teams.find(t => t.id === teamId) || {}).players || [];

        console.log("Données de l'équipe avant mise à jour:", teamData);

        if (teamData.includes(userEmail)) {
            alert("Vous êtes déjà dans cette équipe !");
            return;
        }

        teamData.push(userEmail);

        console.log("Données de l'équipe après mise à jour:", teamData);

        try {
            await set(teamRef, teamData);
            setTeams(prevTeams => {
                const updatedTeams = [...prevTeams];
                const teamIndex = updatedTeams.findIndex(t => t.id === teamId);
                updatedTeams[teamIndex].players = teamData;
                return updatedTeams;
            });

            // Mise à jour de l'équipe associée à l'utilisateur
            const userRef = ref(database, `users/${userEmail}`);
            await set(userRef, { team: teamId });

        } catch (error) {
            console.error("Erreur lors de la mise à jour de l'équipe:", error);
        }
    };



    return (
        <View style={styles.container}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>Code de la partie : {gameCode}</Text>
                        <TouchableOpacity style={styles.modalButton} onPress={shareGameCode}>
                            <Text style={styles.modalButtonText}>Partager le code</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
                            <Text style={styles.modalButtonText}>Fermer</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {teams.map((team, index) => (
                <View key={team.id} style={styles.teamContainer}>
                    <Text style={styles.teamTitle}>Équipe {index + 1} ({team.players.length} joueurs)</Text>
                    <FlatList
                        data={team.players}
                        renderItem={({ item }) => <Text style={styles.player}>{item}</Text>}
                        keyExtractor={item => team.id + '_' + item}
                    />
                    {index < 2 && (
                        <TouchableOpacity style={styles.joinButton} onPress={() => {
                            handleJoinTeam(team.id);
                        }}>
                            <Text style={styles.joinButtonText}>Rejoindre l'équipe {index + 1}</Text>
                        </TouchableOpacity>
                    )}
                </View>
            ))}

            <TouchableOpacity style={styles.gameButton} onPress={() => navigation.replace('WordSelection')}>
                <Text style={styles.gameButtonText}>Commencer la partie</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },

    modalContent: {
        width: '80%',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84
    },
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#F4F4F4',
    },
    teamContainer: {
        marginBottom: 25,
        padding: 15,
        backgroundColor: 'white',
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    teamTitle: {
        fontSize: 24,
        fontWeight: '500',
        color: '#444',
        marginBottom: 15,
        textAlign: 'center',
    },
    player: {
        fontSize: 18,
        color: '#1FAB89',
        marginVertical: 5,
        paddingLeft: 10,
        borderBottomWidth: 0.5,
        borderBottomColor: '#D3D3D3'
    },
    joinButton: {
        marginTop: 10,
        paddingVertical: 10,
        paddingHorizontal: 25,
        backgroundColor: '#1FAB89',
        borderRadius: 5,
        alignSelf: 'center'
    },
    joinButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    modalView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalText: {
        marginBottom: 20,
        textAlign: 'center',
        fontSize: 26,
        fontWeight: '500',
        color: '#444'
    },
    modalButton: {
        marginVertical: 12,
        paddingVertical: 12,
        paddingHorizontal: 24,
        backgroundColor: '#1FAB89',
        borderRadius: 8,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3.84
    },
    modalButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    gameButton: {
        marginTop: 15,
        paddingVertical: 12,
        paddingHorizontal: 30,
        backgroundColor: '#FFA500',
        borderRadius: 8,
        alignSelf: 'center',
        marginBottom: 20,
    },
    gameButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default TeamsScreen;