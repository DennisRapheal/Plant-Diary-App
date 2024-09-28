import React, { useState } from 'react';
import {
  View, ScrollView, StyleSheet, Keyboard, SafeAreaView,
  TextInput, Text, TouchableOpacity, Modal, Image, Alert, Linking,
  KeyboardAvoidingView, Platform
} from 'react-native';
import AddDiaryBtn from '@/components/addButton/AddDiaryBtn';
import { images } from '@/constants';
import * as ImagePicker from 'expo-image-picker';
import UplaodImgBlock from '@/components/UplaodImgBlock';
import MlkitOcr from 'react-native-mlkit-ocr';


const FLIR_estimate = () => {
  const [tempPlant, setTempPlant] = useState('');
  const [environmentTemp, setEnvironmentTemp] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [image, setImage] = useState('');

  const detectTextFromImage = async (imagePath) => {
    try {
      const result = await MlkitOcr.detectFromUri(imagePath);
      console.log('OCR Result:', result);

      // Extract temperatures using regex (to match values like '26.3°')
      const temperaturePattern = /\d{2}\.\d°/g;
      const temperatures = result.map(block => block.text).join(' ').match(temperaturePattern);

      if (temperatures && temperatures.length >= 2) {
        setEnvironmentTemp(temperatures[0].replace('°', ''));
        setTempPlant(temperatures[1].replace('°', ''));
        console.log('Detected temperatures:', temperatures);
      } else {
        Alert.alert('Temperature Detection Failed', 'Could not detect temperatures in the image.');
      }
    } catch (error) {
      console.error("Error detecting text from image:", error);
      Alert.alert("Error", "Failed to analyze image. Please try again.");
    }
  };



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
      await detectTextFromImage(image);
    } else {
      Alert.alert('Oops...', 'Please upload an image again')
    }
  };

  const openFlirApp = () => {
    const url = 'https://apps.apple.com/tw/app/flir-one/id875842742';
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

  const calculateTemp = () => {
    if (!tempPlant || !environmentTemp) {
      Alert.alert("Please enter all the temperatures.");
      return;
    }
    const roomTemp = Number(environmentTemp);
    const plantTemp = Number(tempPlant);

    if (plantTemp - roomTemp > 1) {
      setSuggestion("Your plant may be sending signals of dehydration, please water it!");
    } else {
      setSuggestion("Your plant doesn't seem to need water urgently!");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollViewContent}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity style={styles.helpButton} onPress={() => setModalVisible(true)}>
            <Text style={styles.helpButtonText}>?</Text>
          </TouchableOpacity>

          <UplaodImgBlock
              image={image}
              pickImage={pickImageFromLibrary}
              script={"Upload an image!"}
          />

          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={environmentTemp}
                onChangeText={setEnvironmentTemp}
                placeholder="Room Temp"
                placeholderTextColor="gray"
                keyboardType="numeric"
              />
              <Text style={styles.unitText}>℃</Text>
            </View>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={tempPlant}
                onChangeText={setTempPlant}
                placeholder="Plant Temp"
                placeholderTextColor="gray"
                keyboardType="numeric"
              />
              <Text style={styles.unitText}>℃</Text>
            </View>
          </View>

          <AddDiaryBtn
            title="Check plant status"
            handlePress={calculateTemp}
            isLoading={false}
          />

          <TextInput
            style={styles.noteInput}
            value={suggestion}
            onChangeText={setSuggestion}
            placeholder="Write down some notes..."
            placeholderTextColor="gray"
            multiline
            editable={false}
          />

          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <View style={{justifyContent: 'flex-start'}}>
                    <Text style={styles.instructionsTitle}>Please follow these steps:</Text>
                    <Text style={styles.instruction}>1. Open the FLIR ONE app.</Text>
                    <Text style={styles.instruction}>2. Connect your FLIR camera.</Text>
                    <Text style={styles.instruction}>3. After connecting, press the button below and choose measurement mode, select two measurement points (colorless points).</Text>
                    <Text style={styles.instruction}>4. Align the center point with the plant leaf, and the other point with a room temperature object.</Text>
                    <Text style={styles.instruction}>5. Fill in the temperatures in the input boxes below, with the center point corresponding to the center input box.</Text>
                </View>
                <Image
                  style={styles.image}
                  source={images.hint}
                  resizeMode='contain'
                />
                <TouchableOpacity style={styles.button} onPress={openFlirApp}>
                    <Text style={{color: 'white', fontWeight: '800'}}>Open FLIR app</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#4a5b4c',
        paddingHorizontal: 100,
        paddingVertical: 20,
        borderRadius: 15,
        color: 'white'

    },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    padding: 16,
  },
  helpButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    borderWidth: 2,               // Width of the border
    borderColor: '#4a5b4c',       // Color of the border
    borderRadius: 50,             // Rounded corners
    borderStyle: 'solid',          // Style of the border
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  helpButtonText: {
    color: '#4a5b4c',
    fontSize: 18,
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 60,
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 50,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  unitText: {
    marginLeft: 5,
    fontSize: 18,
    color: '#555',
  },
  noteInput: {
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 5,
    padding: 10,
    height: 150,
    textAlignVertical: 'top',
    marginTop: 20,
    backgroundColor: '#fff',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    maxHeight: '80%',
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  instruction: {
    fontSize: 16,
    marginBottom: 5,
    color: '#555',
  },
  image: {
    width: '100%',
    height: 200,
    marginVertical: 20,
    borderRadius: 10,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#4a5b4c',
    fontSize: 16,
  },
});

export default FLIR_estimate;