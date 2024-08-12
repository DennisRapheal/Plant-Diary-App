import { StyleSheet, Text, View, Image, TouchableOpacity, TouchableWithoutFeedback} from 'react-native'
import React, { useEffect, useState } from 'react'
import { icons } from '../constants';
import { Link, router } from 'expo-router';
import { deleteDoc, getDocs, collection, query, doc} from 'firebase/firestore';
import { db } from 'lib/firebase';

const handlePress = async() => {
  router.push("/(diary)/1")
  console.log('ererer')
}
const DiaryCard = ({title, image, docid, onDelete}) => {
  
  return (
      <TouchableOpacity style={styles.card} onPress = {async () => (router.push(`/(diary)/${docid}`))}>
        <View style={styles.content} >
          <Image 
            source={{uri: image}}
          />
        </View>
        <View style={styles.footer}>
          <Text style={styles.title}>
              {title}
          </Text>
          <TouchableOpacity onPress={onDelete}>
            <Image
                source = {icons.trashcan}
                style={styles.icon}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
  );
};

export default DiaryCard

const styles = StyleSheet.create({
    card: {
      backgroundColor: '#5B6E57',
      borderRadius: 15,
      overflow: 'hidden',
      padding: 16, // padding insaide 
      marginBottom: 30,
      marginLeft: 30,
      marginRight: 30,
      shadowColor: "rgba(0, 0, 0, 0.25)",
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowRadius: 4,
      elevation: 4,
      shadowOpacity: 1,
      justifyContent: "center",
    },
    content: {
        // should be an image 
      height: 120,
      borderRadius: 10,
      backgroundColor: 'white',
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 10,
    },
    title: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
    icon: {
        width: 22,
        height: 22,
        marginLeft: 38,
        overflow: "hidden",
    }
  });