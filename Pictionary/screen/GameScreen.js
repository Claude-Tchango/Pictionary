import React, {useState, useEffect, useCallback} from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { firestore } from '../config/firebaseConfig';
import { collection, addDoc, query, orderBy, limit, onSnapshot, doc, getDoc, where } from "firebase/firestore";
import { getAuth } from 'firebase/auth';

const formatDate = (timestamp) => {
    const date = timestamp.toDate();
    return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')} ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};

const GameScreen = ({ route }) => {
    const selectedWord = route.params?.selectedWord || 'Mot inconnu';
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userTeam, setUserTeam] = useState('');

    const auth = getAuth();
    const [seconds, setSeconds] = useState(120);
    const [intervalId, setIntervalId] = useState(null);
    const [score, setScore] = useState(0);
    const [round, setRound] = useState(1);
    const [guessInputText, setGuessInputText] = useState('');
    const [isWordGuessedCorrectly, setIsWordGuessedCorrectly] = useState(false);



    useEffect(() => {
        if (selectedWord) {
            const id = setInterval(() => {
                setSeconds(prevSeconds => prevSeconds - 1);
            }, 1000);

            setIntervalId(id);
        }

        return () => {
            clearInterval(intervalId);
        };
    }, [selectedWord]);

    useEffect(() => {
        if (seconds === 0) {
            clearInterval(intervalId);
        }
    }, [seconds]);

    useEffect(() => {
        if (auth.currentUser) {
            setUserEmail(auth.currentUser.email);
            const userDoc = doc(firestore, 'users', auth.currentUser.email);
            getDoc(userDoc).then((docSnap) => {
                if (docSnap.exists()) {
                    setUserTeam(docSnap.data().team || '');
                }
            });
        }
    }, [auth]);

    useEffect(() => {
        if (userTeam) {
            const q = query(
                collection(firestore, 'messages'),
                where("team", "==", userTeam),
                orderBy('timestamp', 'desc'),
                limit(20)
            );

            const unsubscribe = onSnapshot(q, (snapshot) => {
                const fetchedMessages = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setMessages(fetchedMessages);
            });

            return () => unsubscribe();
        }
    }, [userTeam]);
    useEffect(() => {
        if (userTeam) {
            const scoreRef = doc(firestore, 'scores', userTeam);
            const unsubscribe = onSnapshot(scoreRef, (docSnap) => {
                if (docSnap.exists()) {
                    setScore(docSnap.data().score || 0);
                }
            });

            return () => unsubscribe();
        }
    }, [userTeam]);
    useEffect(() => {
        if (isWordGuessedCorrectly || seconds === 0) {
            nextRound();
        }
    }, [isWordGuessedCorrectly, seconds]);

    const nextRound = () => {
        setRound(prevRound => prevRound + 1);
        setSeconds(120);
        setIsWordGuessedCorrectly(false);
        selectNewWord();
    };
    const ROUND_DURATION = 120; // déplacé dans une constante pour être réutilisé

    const updateScore = async (userTeam, setScore) => {
        try {
            const teamScoreRef = doc(firestore, 'scores', userTeam);
            const teamScoreDoc = await getDoc(teamScoreRef);

            let newScore = 1;
            if (teamScoreDoc.exists()) {
                newScore = teamScoreDoc.data().score + 1;
                await updateDoc(teamScoreRef, { score: newScore });
            } else {
                await setDoc(teamScoreRef, { score: newScore });
            }

            setScore(newScore);
        } catch (error) {
            console.error("Error updating score:", error);
        }
    };



    const sendMessage = useCallback(async () => {
        if (inputText.trim().length > 0) {
            try {
                await addDoc(collection(firestore, 'messages'), {
                    text: inputText,
                    userEmail: userEmail,
                    team: userTeam,
                    timestamp: new Date(),
                });
                setInputText('');
            } catch (error) {
                console.error("Error sending message:", error);
            }
        }
    }, [inputText, userEmail, userTeam]);

    const checkAnswer = useCallback(async (answer, wordToGuess) => {
        if(answer.trim().toLowerCase() === wordToGuess.toLowerCase()) {
            await updateScore(userTeam, setScore);
            setIsWordGuessedCorrectly(true);
        } else {
            setIsWordGuessedCorrectly(false);
        }
    }, [userTeam, setScore]);

    const submitAnswer = async (answer) => {
        try {
            await checkAnswer(answer, selectedWord);
        } catch (error) {
            console.error("Error submitting answer:", error);
        }
    };



    return (
        <View style={styles.container}>
            <Text style={styles.roundText}>Round: {round}</Text>
            <Text style={styles.selectedWordText}>Mot à dessiner: {selectedWord}</Text>
            <View style={styles.scoreArea}>
                <Text style={styles.scoreText}>Score : {score}</Text>
                <Text style={styles.timerText}>Chronomètre : {Math.floor(seconds/60)}:{String(seconds%60).padStart(2, '0')}</Text>
            </View>
            <View style={styles.drawingArea}>

            </View>
            <View style={styles.answerArea}>
                <TextInput
                    value={guessInputText}
                    onChangeText={setGuessInputText}
                    style={styles.inputText2}
                    placeholder="Guess the word..."
                    placeholderTextColor="#aaa"
                />
                <TouchableOpacity onPress={() => submitAnswer(guessInputText)} style={styles.submitButton}>
                    <Text style={styles.submitButtonText}>Guess</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.chatArea}>
                <FlatList
                    style={styles.messages}
                    data={messages}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.messageContainer}>
                            <Text style={styles.emailText}>{item.userEmail} · {formatDate(item.timestamp)}</Text>
                            <Text style={styles.messageText}>{item.text}</Text>
                        </View>
                    )}
                    inverted
                />

                <View style={styles.inputArea}>
                    <TextInput
                        value={inputText}
                        onChangeText={setInputText}
                        style={styles.inputText}
                        placeholder="Type your message..."
                        placeholderTextColor="#aaa"
                    />
                    <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
                        <Text style={styles.sendButtonText}>Send</Text>
                    </TouchableOpacity>
                </View>
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 10,
    },
    drawingArea: {
        flex: 6,
        backgroundColor: '#E0FFFF',
        borderRadius: 15,
        marginVertical: 10,
        borderColor: '#008B8B',
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedWordText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        textShadowColor: 'rgba(0, 0, 0, 0.1)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
        backgroundColor: '#007575',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 3,
        borderColor: '#005555',
        alignSelf: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
        elevation: 10,
        marginBottom: 20,
        overflow: 'hidden',
    },
    chatArea: {
        flex: 3,
        backgroundColor: '#20B2AA',
        borderRadius: 15,
        marginVertical: 10,
        padding: 10,
    },
    messages: {
        flex: 4,
        backgroundColor: '#E0FFFF',
        borderRadius: 15,
        margin: 5,
    },
    messageContainer: {
        paddingVertical: 10,
        paddingHorizontal: 12,
    },
    emailText: {
        fontSize: 13,
        color: '#20B2AA',
        marginBottom: 5,
    },
    messageText: {
        fontSize: 15,
        color: '#000000',
        borderRadius: 8,
        padding: 8,
    },
    inputArea: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FAFAFA',
        borderRadius: 30,
        marginVertical: 5,
        paddingHorizontal: 20,
        height: 50,
    },
    inputText: {
        flex: 1,
        backgroundColor: '#008080',
        borderRadius: 25,
        paddingHorizontal: 15,
        height: 40,
        color: '#FAFAFA',
    },
    sendButton: {
        marginLeft: 10,
        padding: 10,
        backgroundColor: '#1FAB89',
        borderRadius: 25,
    },
    sendButtonText: {
        color: 'white',
        fontSize: 16,
    },
    scoreArea: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#008080',
        borderRadius: 15,
        padding: 12,
    },
    scoreText: {
        color: '#FFC107',
        fontSize: 16,
    },
    timerText: {
        color: '#8BC34A',
        fontSize: 16,
    },
    answerArea: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
        backgroundColor: '#e8e8e8',
        borderRadius: 12,
        margin: 10,
    },
    inputText2: {
        flex: 3,
        backgroundColor: '#fff',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 6,
        padding: 10,
        fontSize: 18,
        marginRight: 10,
        color: '#333',
    },
    submitButton: {
        flex: 1,
        backgroundColor: '#4CAF50',
        paddingVertical: 15,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    roundText: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        margin: 10,
        color: '#4a4a4a',
    },
});

export default GameScreen;
