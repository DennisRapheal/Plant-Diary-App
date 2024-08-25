import { Link, router, useFocusEffect, useGlobalSearchParams, useLocalSearchParams } from 'expo-router';
import React, { useState, useRef, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, Switch, Dimensions, Animated, TouchableOpacity, Image, ActivityIndicator} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { setDoc, doc, collection, addDoc, getDocs, query, where, getDoc, onSnapshot, Timestamp, updateDoc} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useGlobalContext } from '@/context/GlobalProvider';
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types';
import AddDiaryBtn from '@/components/addButton/AddDiaryBtn';
import DiarySetting from '@/components/SettingField/DiarySetting';
import { isLoading } from 'expo-font';
import WaterCard from '../../components/WaterCard';
import LoadingScreen from '@/components/Loading/Loading';
import { create } from 'zustand';

const { width } = Dimensions.get('window');
const CARD_WIDTH = 250;
const SPACING = 10;
const ITEM_WIDTH = CARD_WIDTH + SPACING * 2;
const EMPTY_ITEM_WIDTH = (width - ITEM_WIDTH) / 2;

export default function App() {
    const [switchValue, setSwitch] = useState(false)
    const scrollX = useRef(new Animated.Value(0)).current
    const [activeIndex, setActiveIndex] = useState(0)
    const [cards, setCards] = useState([])
    const [cardData, setCardData] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [diary, setdiary] = useState(null)
    const { diaryId } = useGlobalSearchParams()
    const diaryIdString = diaryId?.toString()

    const handleSwitch = async(e) => {
      setSwitch(e);
      const diaryRef = doc(db, "diaries", diaryId.toString())
      const diary = await updateDoc(diaryRef, {
        waterReminder: e
      })
      console.log("update water reminder")
    }

    const handleScroll = (event) => {
      const scrollPosition = event.nativeEvent.contentOffset.x;
      const index = Math.round(scrollPosition / ITEM_WIDTH);
      setActiveIndex(index);
    };

    const { user } = useGlobalContext()

    const fetch_data = async() => {
      try{
        const diaryRef = doc(db, "diaries", diaryId.toString())
        const diary = (await getDoc(diaryRef)).data()
        setdiary(diary)
        setSwitch(diary.waterReminder)
      }catch(err){
        console.log(err)
      }
    }

    useEffect(() => {
      if(cards){
        setIsLoading(true)
        try{
          const transformedData = [
            { key: 'empty-left' },
            { key: diaryIdString, type: 'settings' },
            ...cards.map(doc => ({
              key: doc.id, 
              date: doc.createdAt,
              height: doc.height,
              note: doc.note,
              Image: doc.startingImage,
            })),
            { key: 'empty-right' },
          ];

          setCardData(transformedData)
        }catch(e){
          console.error(e)
        }finally{
          setIsLoading(false)
        }
    }
    }, [cards])



      useEffect(
      () => {
        setIsLoading(true)
        fetch_data()
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
    }, [])

    const Days = (createdAt) => {
      if(!createdAt) return 0
      const createdAtDate = createdAt.toDate()
      const today = new Date()
      const diffInMilliseconds: number = today.getTime() - createdAtDate.getTime()
      const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));
      return diffInDays
    }
  
    return (
      <SafeAreaView style={styles.container}>
        <View className='flex-1'>
          { isLoading ? (<LoadingScreen/>) : (
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
            {cardData?.slice(-1, 1).map((_, index) => (
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
            <Text style={styles.PlantName}>{diary?.plantName}</Text>
            <Text style={styles.days}>{`Day ${Days(diary?.createdAt)}`}</Text>
            <Text style={styles.plantType}>{diary?.plantType}</Text>
            <Text style={styles.wateringInfo}> {`Day left to water: ${diary?.createdAt.toDate()} days`}</Text>
            <View style={styles.reminderRow}>
              <Text style={styles.reminderText}>Watering Reminder:</Text>
              <Switch value={switchValue} onValueChange={handleSwitch} />
            </View>
            <AddDiaryBtn title = "add watering record" handlePress={() => { console.log('diaryId: ', diaryId); router.push(`/(addWaterCard)/${diaryId}`)}} isLoading={false}/>
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
