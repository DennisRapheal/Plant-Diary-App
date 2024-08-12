import { Link, router, useGlobalSearchParams, useLocalSearchParams } from 'expo-router';
import React, { useState, useRef, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, Switch, Dimensions, Animated, TouchableOpacity } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { setDoc, doc, collection, addDoc, getDoc } from 'firebase/firestore';
import { db } from 'lib/firebase';
import { useGlobalContext } from 'context/GlobalProvider';
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types';
import AddDiaryBtn from 'components/AddDiaryBtn';
import DiarySettings from '../../components/DiarySettings';
import { isLoading } from 'expo-font';

const { width } = Dimensions.get('window');
const CARD_WIDTH = 250;
const SPACING = 10;
const ITEM_WIDTH = CARD_WIDTH + SPACING * 2;
const EMPTY_ITEM_WIDTH = (width - ITEM_WIDTH) / 2;
const id = useLocalSearchParams()

const Card = ({ item, index, scrollX }) => {
  const inputRange = [
    (index - 2) * ITEM_WIDTH,
    (index - 1) * ITEM_WIDTH,
    index * ITEM_WIDTH,
  ];

  const scale = scrollX.interpolate({
    inputRange,
    outputRange: [0.8, 1, 0.8],
  });

  const opacity = scrollX.interpolate({
    inputRange,
    outputRange: [0.5, 1, 0.5],
  });

  console.log(id)

  return (
    <Link href={`/(waterCard)/1`} asChild>
      <TouchableOpacity>
        <Animated.View
          style={[
            styles.card,
            {
              transform: [{ scale }],
              opacity,
            },
          ]}
        >
          <Text style={styles.cardDate}>{item.date}</Text>
          <View style={styles.imagePlaceholder}></View>
          <Text style={styles.cardDetail}>Height: {item.height} cm</Text>
          <Text style={styles.cardDetail}>Note: {item.note}</Text>
        </Animated.View>
      </TouchableOpacity>
    </Link>
  );
};

export default function App() {
    const [switchValue, setSwitch] = useState(false);
    const scrollX = useRef(new Animated.Value(0)).current;
    const [activeIndex, setActiveIndex] = useState(0);
    const [diary, setDiary] = useState(null)
    const handleSwitch = (e) => {
      setSwitch(e);
    };


    const { diaryId } = useGlobalSearchParams()

    const data = [
      { key: 'empty-left' },
      { key: '1', date: '2024 8/5', nextDate: '2024 8/15', height: 10, note: 'blah blah blah blah.' },
      { key: '2', date: '2024 8/6', nextDate: '2024 8/16', height: 12, note: 'another note' },
      { key: '3', date: '2024 8/7', nextDate: '2024 8/17', height: 15, note: 'yet another note' },
      { key: 'empty-right' },
    ];
  
    const handleScroll = (event) => {
      const scrollPosition = event.nativeEvent.contentOffset.x;
      const index = Math.round(scrollPosition / ITEM_WIDTH);
      setActiveIndex(index);
    };

    const { user } = useGlobalContext()

    const fetch_data = async() => {
      const diaryRef = doc(db, "diaries", diaryId.toString())
      const diary = (await getDoc(diaryRef)).data()
      setDiary(diary)
    }
    useEffect(() => {
      fetch_data()
      console.log(diary)
    }, [])
  
    return (
      <SafeAreaView style={styles.container}>
        <View className='flex-1'>
          <Animated.FlatList
            data={data}
            renderItem={({ item, index }) => {
              if (!item.date) {
                return <View style={{ width: EMPTY_ITEM_WIDTH }} />;
              }
              return <Card item={item} index={index} scrollX={scrollX} />;
            }}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={ITEM_WIDTH}
            decelerationRate="fast"
            bounces={false}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: true, listener: handleScroll }
            )}
            scrollEventThrottle={16}
          />

          <View style={styles.pagination}>
            {data.slice(1, -1).map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  index === activeIndex && styles.paginationDotActive,
                ]}
              />
            ))}
          </View>




          <View style={styles.infoCard}>
            <Text style={styles.plantName}>{diary.plantName}</Text>
            <Text style={styles.days}>23 Days</Text>
            <Text style={styles.plantType}>{diary.plantType}</Text>
            <Text style={styles.wateringInfo}> {`Day left to water: ${diary.createdAt} days`}</Text>
            <View style={styles.reminderRow}>
              <Text style={styles.reminderText}>Watering Reminder:</Text>
              <Switch value={switchValue} onValueChange={handleSwitch} />
            </View>
            <AddDiaryBtn title = "add watering record" handlePress={() => {router.push("/(waterCard)/1")}} isLoading={false}/>
          </View>

        </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    cardContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
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
    cardDetail: {
        color: '#FFFFFF',
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 20,
    },
    paginationDot: {
        width: 10,
        height: 10,
        backgroundColor: '#D3D3D3',
        borderRadius: 5,
        marginHorizontal: 5,
    },
    paginationDotActive: {
        width: 10,
        height: 10,
        backgroundColor: '#6B7969',
        borderRadius: 5,
        marginHorizontal: 5,
    },
    infoCard: {
        width: '90%',
        padding: 20,
        backgroundColor: '#F5F5F5',
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20,
        alignSelf: 'center',
    },
    plantName: {
        fontSize: 24,
        color: '#6B7969',
        marginBottom: 10,
    },
    days: {
        fontSize: 20,
        color: '#6B7969',
        marginBottom: 10,
    },
    plantType: {
        fontSize: 18,
        color: '#6B7969',
        marginBottom: 10,
    },
    wateringInfo: {
        fontSize: 16,
        color: '#6B7969',
        marginBottom: 10,
    },
    reminderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    reminderText: {
        fontSize: 16,
        color: '#6B7969',
        marginRight: 10,
    },
    reminderBar: {
        width: '100%',
        height: 10,
        backgroundColor: '#D3D3D3',
        borderRadius: 5,
    },
    navBar: {
        width: '100%',
        height: 60,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#6B7969',
        position: 'absolute',
        bottom: 0,
    },
    navIcon: {
        width: 30,
        height: 30,
    },
});

