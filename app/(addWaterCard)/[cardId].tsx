import React, { useState } from 'react';
import { useLocalSearchParams, router} from 'expo-router';
import { View, Text, TouchableOpacity, TextInput, Switch, Alert, StyleSheet, KeyboardAvoidingView, ScrollView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import UplaodImgBlock from '@/components/UplaodImgBlock';
import AddDiaryBtn from '@/components/addButton/AddDiaryBtn';
import { setDoc, doc, collection, addDoc , query, where, getDocs, updateDoc, arrayUnion, Timestamp} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import upload from '@/lib/storage';

const InputCard = () => {
  const dairyid = useLocalSearchParams().cardId;
  console.log("diaryid: ", dairyid);

  const [isWatered, setIsWatered] = useState(false);
  const [height, setHeight] = useState('');
  const [note, setNote] = useState('');
  const [image, setImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const pickImageFromLibrary = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Allow only images
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      console.log('success pick img');
    } else {
      Alert.alert('Oops...', 'Please upload an image again')
    }
  };

  const takePhotoWithCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Sorry, we need camera permissions to make this work!',
        [{ text: 'OK' }]
      );
      return;
    }
    
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      // Handle the captured photo
      setImage(result.assets[0].uri);
      console.log('success take a photo img');
    } else {
      Alert.alert('Oops...', 'Please take a photo img again')
    }
  };

  const showImagePickerOptions = () => {
    Alert.alert(
      'Select Image Source',
      'Choose an option to select an image:',
      [
        {
          text: 'Camera',
          onPress: takePhotoWithCamera,
        },
        {
          text: 'Library',
          onPress: pickImageFromLibrary,
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };
  const check_FLIR = () => {
    router.push('/(Flir)/FLIR_estimate')
  }

  const addWaterCard = async () => {
    setIsLoading(true)
    const imgUrl = await upload(image)
    console.log(imgUrl)
    try{
      const waterid = await addDoc(collection(db, "watercards"), {
        dairyid: dairyid,
        createdAt: Timestamp.now(),
        watered: isWatered,
        height: height, 
        startingImage: imgUrl,
        note: note, 
      })
      console.log('add card success');
      router.push('/(tabs)/home');
      const DiaryRef = doc(db, "diaries", dairyid.toString())
      await updateDoc(DiaryRef, {
        wateringRecords: arrayUnion(waterid.id)
      })
    } catch (err) {
      console.log('setWaterCard', err);
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <UplaodImgBlock 
              image={image}
              pickImage={showImagePickerOptions}
              script={"Upload an image!"}
            />
            <View style={styles.formContainer}>
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
              <AddDiaryBtn
                title={"Check your plant with FLIR"}
                handlePress={check_FLIR}
                isLoading={isLoading}
              />
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default InputCard;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    padding: 20,
  },
  formContainer: {
    flex: 1,
    padding: 16,
    borderRadius: 10,
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
    height: 100,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
});