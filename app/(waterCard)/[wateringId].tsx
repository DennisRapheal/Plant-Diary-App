import React, { useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { View, Text, TouchableOpacity, TextInput, Switch, StyleSheet, KeyboardAvoidingView, ScrollView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';


const InputCard = () => {

    const id = useLocalSearchParams()
    console.log(id)

  const [isWatered, setIsWatered] = useState(false);
  const [height, setHeight] = useState('');
  const [note, setNote] = useState('');

  return (
    <KeyboardAvoidingView>
      <View style={styles.infoCard}>
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
      </View>
    </KeyboardAvoidingView>
  )
}

const Bookmark = () => {
  const [isWatered, setIsWatered] = useState(false);
  const [height, setHeight] = useState('');
  const [note, setNote] = useState('');

  const handleImageUpload = () => {
    // Implement image upload logic here
    console.log('Image upload triggered');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <TouchableOpacity onPress={() => {}} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleImageUpload} style={styles.uploadArea}>
            <Icon name="file-upload" size={48} color="#888" />
            <Text style={styles.uploadText}>upload your plant image!</Text>
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
      <InputCard/>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
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

export default Bookmark;
