import { useCallback, useRef, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { Text, StyleSheet, TouchableOpacity, View } from 'react-native'
import { StackNavigationProp } from '@react-navigation/stack'
import { CommonActions, useNavigation } from '@react-navigation/core'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { Carousel } from 'react-native-ui-lib'
import { colors } from '../theme/colors'
import { RootStackParamList } from '../navigation/Navigator'
import { setUserHasSeenTutorial } from '../services/tutorial'


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.gray100,
    padding: 10
  },
  pageContainer: {
    flex: 1,
    marginBottom: 48
  },
  iconContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 48,
    color: colors.black,
    paddingBottom: 10,
    paddingHorizontal: 10,
    textAlign: 'center'
  },
  description: { textAlign: 'center', paddingBottom: 10 },
  nextButton: {
    marginTop: 20,
    height: 50,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.background.white
  }
})

const pages = [
  {
    title: 'tutorial.welcomeTitle',
    description: 'tutorial.welcomeDescription',
    icon: 'sitemap-outline'
  },
  {
    title: 'tutorial.explanationTitle',
    description: 'tutorial.explanationDescription',
    icon: 'wifi'
  },
  {
    title: 'tutorial.permissionTitle',
    description: 'tutorial.permissionDescription',
    icon: 'text-box-check'
  }
]

export default function TutorialScreen() {
  const { t } = useTranslation()
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Tutorial'>>()
  const [ currentPage, setCurrentPage ] = useState(0)
  const carouselRef = useRef<any>()

  // Handle pressint the action button
  const onButtonPress = useCallback(async () => {
    if (currentPage < 2) {
      setCurrentPage(prevPage => prevPage + 1)
      carouselRef.current.goToPage(currentPage + 1, false)
      return
    }
    await setUserHasSeenTutorial()
    navigation.dispatch(CommonActions.reset({
      index: 0,
      routes: [{ name: 'Main' }]
    }))
  }, [ currentPage, navigation ])

  return (
    <SafeAreaView style={styles.container}>
      <Carousel
        ref={carouselRef}
        containerStyle={{ flex: 5 }}
        pageControlProps={{ size: 10 }}
        onChangePage={setCurrentPage}
        pageControlPosition={Carousel.pageControlPositions.OVER}
      >
        {pages.map(({ title, description, icon }) => (
          <View key={title} style={styles.pageContainer}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons
                name={icon}
                color={colors.primary}
                size={156}
              />
            </View>
            <View>
              <Text style={styles.title}>{t(title)}</Text>
              <Text style={styles.description}>{t(description)}</Text>
            </View>
          </View>
        ))}
      </Carousel>
      <View style={{ flex: 1 }}>
        <TouchableOpacity onPress={onButtonPress} style={styles.nextButton}>
          <Text style={styles.nextButtonText}>
            {t(currentPage === 2 ? 'tutorial.done' : 'tutorial.next')}
          </Text>
        </TouchableOpacity>
      </View>
      <StatusBar style="auto" />
    </SafeAreaView>
  )
}
