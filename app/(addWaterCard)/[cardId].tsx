import React, { useState } from 'react';
import { useLocalSearchParams, router} from 'expo-router';
import { View, Text, TouchableOpacity, TextInput, Switch, Alert, StyleSheet, KeyboardAvoidingView, ScrollView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import UplaodImgBlock from 'components/UplaodImgBlock';
import AddDiaryBtn from 'components/AddDiaryBtn';
import { setDoc, doc, collection, addDoc , query, where, getDocs, updateDoc, arrayUnion, Timestamp} from 'firebase/firestore';
import { db } from 'lib/firebase';
import upload from 'lib/storage';

const InputCard = () => {
  const dairyid = useLocalSearchParams().cardId;
  console.log("diaryid: ", dairyid);

  const [isWatered, setIsWatered] = useState(false);
  const [height, setHeight] = useState('');
  const [note, setNote] = useState('');
  const [image, setImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Allow only images
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    } else {
      Alert.alert('Oops...', 'Please upload an image again')
    }
  };

  const addWaterCard = async () => {
    const imgUrl = await upload(image)
    console.log(imgUrl)
    try{
      setIsLoading(true)
      const waterid = await addDoc(collection(db, "watercards"), {
        dairyid: dairyid,
        createdAt: Timestamp.now(),
        watered: isWatered,
        height: height, 
        startingImage: imgUrl,
        note: note, 
      })
      console.log('add card success');
      setIsLoading(false)

      const DiaryRef = doc(db, "diaries", dairyid.toString())
      await updateDoc(DiaryRef, {
        wateringRecords: arrayUnion(waterid.id)
      })
    } catch (err) {
      console.log('setWaterCard', err);
    } finally {
      setIsLoading(false)
    }
    router.replace('/(tabs)/home')
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={250}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <>
        <UplaodImgBlock 
          image={image}
          pickImage={pickImage}
          script={"Upload an image!"}
        />
        <View style={styles.formContainer2}>
          <Text style={styles.dateText}>2024 8/15</Text>
          <View style={styles.row}>
            <Text>Watered</Text>
            <Switch
              value={isWatered}
              onValueChange={setIsWatered}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={isWatered ? "#f5dd4b" : "#f4f3f4"}
            />
            <Text>Height</Text>
            <TextInput
              style={styles.heightInput}
              value={height}
              onChangeText={setHeight}
              placeholder="cm"
              keyboardType="numeric"
            />
          </View>
          <TextInput
            style={styles.noteInput}
            value={note}
            onChangeText={setNote}
            placeholder="write down some words..."
            multiline
          />
          <AddDiaryBtn
            title={"Add Card!"}
            handlePress={addWaterCard}
            isLoading={isLoading}
          />
        </View>
        </>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

export default InputCard

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
    marginTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  container_small: {
    flex: 1,
    height: "100%",
  },
  scrollContainer: {
    padding: 20,
    backgroundColor: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
  formContainer2: {
    height: '40%',
    width: '100%',
    padding: 16,
    borderRadius: 10,
  },
  uploadArea: {
    height: 250,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#888',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60,
  },
  uploadText: {
    marginTop: 10,
    color: '#888',
  },
  infoCard: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 20,
    marginTop: 20,
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  heightInput: {
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 5,
    paddingHorizontal: 10,
    width: 50,
  },
  noteInput: {
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 5,
    padding: 10,
    height: 200,
    textAlignVertical: 'top',
  },
});


