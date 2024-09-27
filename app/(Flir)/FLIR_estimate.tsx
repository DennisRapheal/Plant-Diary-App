import { Linking, Button, Text, KeyboardAvoidingView, KeyboardAvoidingViewBase, TouchableWithoutFeedback, Platform, TextInput, Switch, Keyboard } from 'react-native';
import React, { useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AddDiaryBtn from '@/components/addButton/AddDiaryBtn';
import UplaodImgBlock from '@/components/UplaodImgBlock';

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

  const [isWatered, setIsWatered] = useState(false);
  const [height, setHeight] = useState('');
  const [note, setNote] = useState('');

  return (
    <KeyboardAvoidingView 
    style={styles.container}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    keyboardVerticalOffset={250}>
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <>

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
  );

};


export default FLIR_estimate;

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
  
  
  