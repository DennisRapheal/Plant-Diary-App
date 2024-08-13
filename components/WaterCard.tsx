import { StyleSheet, Text, View, Dimensions, TouchableOpacity, Image, Animated } from 'react-native'
import React from 'react'
import { router, useRouter} from 'expo-router';
const CARD_WIDTH = 250;
const SPACING = 10;
const ITEM_WIDTH = CARD_WIDTH + SPACING * 2;
const WaterCard = ({ item, index, scrollX, width}) => {
    const inputRange = [
        (index - 2) * ITEM_WIDTH,
        (index - 1) * ITEM_WIDTH,
        index * ITEM_WIDTH,
    ];
    const EMPTY_ITEM_WIDTH = (width - ITEM_WIDTH) / 2;

    const scale = scrollX.interpolate({
        inputRange,
        outputRange: [0.8, 1, 0.8],
    });

    const opacity = scrollX.interpolate({
        inputRange,
        outputRange: [0.5, 1, 0.5],
    }); 

    const router = useRouter()
    return (
        <TouchableOpacity onPress={ () => ( router.push(`/(setWaterCard)/${item.id}`) ) }>
            <Animated.View
            style={[
                styles.card,
                {
                transform: [{ scale }],
                opacity,
                },
            ]}
            >
            <Text style={styles.cardDate}>{item.createdAt}</Text>
            <Image style={styles.imagePlaceholder} source={{uri:item.startingImage}}/>
            <Text style={styles.cardDetail}>Height: {item.height} cm</Text>
            <Text style={styles.cardDetail}>Note: {item.note}</Text>
            </Animated.View>
      </TouchableOpacity>
    )
}

export default WaterCard

const styles = StyleSheet.create({
    cardDetail: {
        color: '#FFFFFF',
    },
    card: {
        width: CARD_WIDTH,
        height: 350,
        backgroundColor: '#6B7969',
        borderRadius: 10,
        padding: 10,
        alignItems: 'center',
        marginTop: 20,
        marginHorizontal: SPACING,
    },
    cardDate: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    imagePlaceholder: {
        width: '90%',
        height: 200,
        backgroundColor: '#FFFFFF',
        marginBottom: 10,
        borderRadius: 10,
    },
})