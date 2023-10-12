import React, { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import eraser from '../assets/eraser.png';
import pencil from '../assets/pencil.png';
import color from '../assets/color.png';
import settings from "../assets/settings.png";

const GameArea = () => {
    const [drawing, setDrawing] = useState([]);
    const [isErasing, setIsErasing] = useState(false); 
    const [currentPath, setCurrentPath] = useState('');
    const [isDrawing, setIsDrawing] = useState(false);
    const [isPencilActive, setIsPencilActive] = useState(false);

    const handleTouchStart = (event) => {
        if (isErasing) { // Si la gomme est activée, ne pas commencer un nouveau dessin
            return;
        }
        setIsDrawing(true);
        setIsPencilActive(true);
        const { nativeEvent } = event;
        const x = nativeEvent.locationX;
        const y = nativeEvent.locationY;
        setCurrentPath(`M${x},${y}`);
    };

    const handleTouchMove = (event) => {
        if (!isDrawing || isErasing) return;
        const { nativeEvent } = event;
        const x = nativeEvent.locationX;
        const y = nativeEvent.locationY;
        setCurrentPath(`${currentPath} L${x},${y}`);
    };

    const handleTouchEnd = () => {
        setIsDrawing(false);
        if (currentPath !== '') {
        // Ajoutez le chemin actuel à la liste des chemins si un dessin a été effectué
        setDrawing([...drawing, currentPath]);
        setCurrentPath(''); // Réinitialisez le chemin actuel
        }
    };

    const handleEraserClick = () => {
        if (!isErasing) {
            // Si la gomme est désactivée, activez-la
            setIsErasing(true);
            setDrawing([]);
        } else {
            setIsErasing(false);
        }
    };

    return (
        <View>
            <View
            style={{ flex: 0, height: 630 }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            >
            <Svg height="100%" width="100%">
                {drawing.map((path, index) => (
                <Path key={index} d={path} stroke="black" strokeWidth="2" fill="none" />
                ))}
                <Path d={currentPath} stroke="black" strokeWidth="2" fill="none" />
            </Svg>
            {/* Barre de menu */}
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding:10, backgroundColor: '#FFFACD', height: 200, borderTopWidth: 2, borderTopColor: 'white' }}>
                <TouchableOpacity style={[styles.button, styles.activeButton]}>
                    <Image source={pencil} style={styles.img1}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleEraserClick} style={[styles.button, !isErasing ? null : styles.activeButton]}>
                    <Image source={eraser} style={styles.img2}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleEraserClick} style={{ backgroundColor: 'white', borderRadius: 8, width: 70, height: 70, alignItems: 'center', marginVertical: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5,
                }}>
                    <Image source={color} style={styles.img3}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleEraserClick} style={styles.button}>
                    <Image source={settings} style={styles.img2}/>
                </TouchableOpacity>
            </View>
            {/* <Text>Hello</Text> */}
        </View>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: 'white',
        paddingVertical: 12,
        paddingHorizontal: 0,
        borderRadius: 8,
        width: 70,
        height: 70,
        alignItems: 'center',
        marginVertical: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },

    img2: {
        width: 40,
        height: 40,
        marginBottom: 40,
        alignSelf: 'center'
    },

    img1: {
        width: 60,
        height: 50,
        marginBottom: 40,
        alignSelf: 'center'
    },

    img3: {
        width: 70,
        height: 70,
        marginBottom: 40,
        alignSelf: 'center',
        borderRadius: 8,
    },
    activeButton: {
        borderColor: 'black',
        borderWidth: 2,
    },
    
});

export default GameArea;