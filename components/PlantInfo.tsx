import { StyleSheet, Text, View, ScrollView, ActivityIndicator} from 'react-native'
import { useState, useEffect } from 'react';
import React from 'react'

const PlantInfo = ({isPlant, details}) => {
  return (
    <View style={styles.Container}>
      <ScrollView>
        { (isPlant)  ? (
          <Text>{details}</Text>
        ) : (
          <Text>This is probably not a plant!!!</Text>
        ) }
      </ScrollView>
    </View>
  )
}

export default PlantInfo

const styles = StyleSheet.create({
    Container: {
        width: '100%',
        height: "40%",
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
      },
})