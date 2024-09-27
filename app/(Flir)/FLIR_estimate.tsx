import { Linking, Button, Text, KeyboardAvoidingView, KeyboardAvoidingViewBase, TouchableWithoutFeedback, Platform, TextInput, Switch, Keyboard, StyleSheet, ScrollView, Image } from 'react-native';
import React, { useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AddDiaryBtn from '@/components/addButton/AddDiaryBtn';
import UplaodImgBlock from '@/components/UplaodImgBlock';
import { isLoaded, isLoading } from 'expo-font';
import { images } from '@/constants';

const FLIR_estimate = () => {
  const openFlirApp = () => {
    const url = 'https://apps.apple.com/tw/app/flir-one/id875842742'; // Replace with the correct URL scheme of the FLIR ONE app
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          console.log("Can't open the FLIR ONE app");
        }
      })
      .catch((err) => console.error('An error occurred', err));
  };

  const [height, setHeight] = useState('');
  const [note, setNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  return (
    <KeyboardAvoidingView 
    style={styles.container}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    keyboardVerticalOffset={250}>
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <>
      <ScrollView style={styles.formContainer2}>
      <View>
      <Text style={{ marginBottom: 10 }}>Please follow these steps:</Text>
      <Text style={{ marginBottom: 5 }}>1. Open the FLIR ONE app.</Text>
      <Text style={{ marginBottom: 5 }}>2. Connect your FLIR camera.</Text>
      <Text style={{ marginBottom: 5 }}>3. 連接後，按下方按鈕並選擇測量模式，選擇兩個以上的測量點（無色的點）。</Text>
      <Text style={{ marginBottom: 5 }}>4. 將中心點對準預測量植物的葉片，確保另一個點對準室溫的物體。</Text>
      <Text style={{ marginBottom: 10 }}>5. 將個點的溫度分別填入下面的輸入格中，中心點填在中心的輸入格。</Text>
      <Image
        style={styles.image}
        source={images.hint} // URL to a remote image
        resizeMode='contain'
      />      
      <AddDiaryBtn
        title={"Open FLIR app"}
        handlePress={openFlirApp}
        isLoading={isLoading}
      />
    </View>

        <View style={styles.row}>

            
            <TextInput
                style={styles.heightInput}
                value={height}
                onChangeText={setHeight}
                placeholderTextColor="gray"
                keyboardType="numeric"
            />
            <Text style={styles.text}>℃</Text>
            <TextInput
                style={styles.heightInput}
                value={height}
                onChangeText={setHeight}
                placeholder="cm"
                keyboardType="numeric"
            />
            <Text style={styles.text}>℃</Text>
            <TextInput
                style={styles.heightInput}
                value={height}
                onChangeText={setHeight}
                placeholder="cm"
                keyboardType="numeric"
            />
            <Text style={styles.text}>℃</Text>
        </View>
        <AddDiaryBtn
          title={"Check plant status"}
          handlePress={() => {}}
          isLoading={isLoading}
        />
        <TextInput
          style={styles.noteInput}
          value={note}
          onChangeText={setNote}
          placeholder="write down some words..."
          multiline
        />

      </ScrollView>
      </>
    </TouchableWithoutFeedback>
  </KeyboardAvoidingView>
  );

};


export default FLIR_estimate;

const styles = StyleSheet.create({
    image: {
        width: '100%',  // Ensure the image takes up the full width of the container
        borderRadius: 10,
      },
    text: {
        color: "gray"
    },
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
      gap: 40,
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
      height: 50,
      width: 80,
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
  
  
  