import { Link, router, useFocusEffect, useGlobalSearchParams, useLocalSearchParams } from 'expo-router';
import React, { useState, useRef, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, Switch, Dimensions, Animated, TouchableOpacity, Image, ActivityIndicator} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { setDoc, doc, collection, addDoc, getDocs, query, where, getDoc, onSnapshot} from 'firebase/firestore';
import { db } from 'lib/firebase';
import { useGlobalContext } from 'context/GlobalProvider';
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types';
import AddDiaryBtn from 'components/AddDiaryBtn';
import DiarySettings from '../../components/DiarySettings';
import { isLoading } from 'expo-font';
import WaterCard from '../../components/WaterCard';

const { width } = Dimensions.get('window');
const CARD_WIDTH = 250;
const SPACING = 10;
const ITEM_WIDTH = CARD_WIDTH + SPACING * 2;
const EMPTY_ITEM_WIDTH = (width - ITEM_WIDTH) / 2;

export default function App() {
    const [switchValue, setSwitch] = useState(false)
    const scrollX = useRef(new Animated.Value(0)).current
    const [activeIndex, setActiveIndex] = useState(0)
    const [cards, setCards] = useState(null)
    const [cardData, setCardData] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [diary, setdiary] = useState(null)
    const handleSwitch = (e) => {
      setSwitch(e);
    }
    const { diaryId } = useGlobalSearchParams()
    const diaryIdString = diaryId?.toString()
  
    const handleScroll = (event) => {
      const scrollPosition = event.nativeEvent.contentOffset.x;
      const index = Math.round(scrollPosition / ITEM_WIDTH);
      setActiveIndex(index);
    };

    const { user } = useGlobalContext()

    useEffect(() => {
      if(cards){
        const transformedData = [
          { key: 'empty-left' },
          { key: diaryIdString, type: 'settings' },
          ...cards.map(doc => ({
            key: doc.id, 
            date: doc.date,
            height: doc.height,
            note: doc.note
          })),
          { key: 'empty-right' },
        ];

        setCardData(transformedData)
    }
    }, [cards])

    const fetch_data = async() => {
      try{
        const diaryRef = doc(db, "diaries", diaryId.toString())
        const diary = (await getDoc(diaryRef)).data()
        setdiary(diary)
      }catch(err){
        console.log(err)
      }
    }

    console.log(cardData)

    useFocusEffect(
      React.useCallback(
      () => {
      setIsLoading(true)
      const unSub = onSnapshot(doc(db, "diaries", diaryIdString), async(res) => {
        const items = res.data().wateringRecords
        const promises = items.map(async (item) => {
          const waterCardRef = doc(db, "watercards", item)
          const waterCard = (await getDoc(waterCardRef)).data()
          const waterCardData = { ...waterCard, id: item}
          return waterCardData
        })

        const cardsData = await Promise.all(promises) 
        setCards(cardsData)
        setIsLoading(false)
      })

      return () => {
        unSub()
      }
    }, []))


    useFocusEffect(
      React.useCallback(() => {
        setIsLoading(true)
        try{
          fetch_data()
          // console.log(diary)
        }catch(e){
          console.log(e.message)
        }finally{
          setIsLoading(false)
        }
      }, [])
    );
  
    return (
      <SafeAreaView style={styles.container}>
        <View className='flex-1'>
          { isLoading ? (<ActivityIndicator/>) : (
            <>
          <Animated.FlatList
            data={cardData}
            renderItem={({ item, index }) => {
              if (item.key === 'empty-left' || item.key === 'empty-right') {
                return <View style={{ width: EMPTY_ITEM_WIDTH }} />;
              }
              return <WaterCard item={item} index={index} scrollX={scrollX} width={width}/>;
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
            {cards?.slice(-1, 1).map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  index === activeIndex && styles.paginationDotActive,
                ]}
              />
            ))}
          </View> 
        </>)}

          { <View style={styles.infoCard}>
            <Text style={styles.PlantName}>{cards?.plantName}</Text>
            <Text style={styles.days}>23 Days</Text>
            <Text style={styles.plantType}>{cards?.plantType}</Text>
            <Text style={styles.wateringInfo}> {`Day left to water: ${cards?.createdAt} days`}</Text>
            <View style={styles.reminderRow}>
              <Text style={styles.reminderText}>Watering Reminder:</Text>
              <Switch value={switchValue} onValueChange={handleSwitch} />
            </View>
            <AddDiaryBtn 
              title = "add watering record" 
              handlePress={() => { console.log('diaryId: ', diaryId); router.push(`/(addWaterCard)/${diaryId}`)}} 
              isLoading={false}
            />
          </View> }

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
    settingsCard: {
      backgroundColor: '#8A9A8E', // A slightly different shade for distinction
      justifyContent: 'center',
    },
    settingsTitle: {
      color: '#FFFFFF',
      fontSize: 24,
      fontWeight: 'bold',
    },
    infoCard: {
        width: '90%',
        padding:16,
        backgroundColor: '#F5F5F5',
        borderRadius: 10,
        marginBottom: 20,
        alignSelf: 'center',
    },
    PlantName: {
        fontSize: 24,
        color: '#6B7969',
        marginBottom: 10,
        textAlign: 'center',
    },
    days: {
        fontSize: 20,
        color: '#6B7969',
        marginBottom: 10,
        textAlign: 'center',
    },
    plantType: {
        fontSize: 18,
        color: '#6B7969',
        marginBottom: 10,
        textAlign: 'center',
    },
    wateringInfo: {
        fontSize: 16,
        color: '#6B7969',
        marginBottom: 10,
        textAlign: 'center',
    },
    reminderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
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

