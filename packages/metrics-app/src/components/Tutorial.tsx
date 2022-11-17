import * as React from 'react'
import { Button, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { text } from '../utils/tutorialText'


const Tutorial = () => {
  const [ isShowed, setIsShowed ] = useState(false)
  const [ isLoading, setIsLoading ] = useState(true)

  useEffect(() => {
    const value = AsyncStorage.getItem('tutorial').then(value => {
      console.log(value)
      setIsShowed(value !== null)
      setIsLoading(false)
    })
  }, [])

  if (isLoading) {
    return null
  }

  return (
    <Modal
      animationType={'slide'}
      transparent={true}
      visible={!isShowed}>
      <View style={styles.container}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>ATTENTION</Text>
          <Text>{text}</Text>
          <Pressable
            style={[ styles.button, styles.buttonClose ]}
            onPress={  () => {
              setIsShowed(true)
              AsyncStorage.setItem('tutorial', JSON.stringify(true))
            }}>
            <Text style={styles.textStyle}>Continue</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalContainer: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2
  },
  buttonClose: {
    backgroundColor: '#2196F3'
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  modalTitle: {
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 18
  }

})

export default Tutorial
// backgroundColor: 'rgba(0, 0, 0, 0.5)',
